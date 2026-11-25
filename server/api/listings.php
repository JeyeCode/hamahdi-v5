<?php
/**
 * HAMAHDI (هم‌عهدی) - ماژول آگهی‌ها، استوری‌های ۴۸ ساعته، اسلایدر و حریم خصوصی داده‌ها (نسخه 9.0)
 * رفع کامل نشت اطلاعات شهروندان و سفارش‌ها و چت‌های خصوصی اهالی (SEC-02)
 */

require_once __DIR__ . '/auth.php';

function store_base64_image_to_disk(string $dataUri, string $prefix = 'img'): string {
    if (preg_match('/^data:video\//i', $dataUri)) {
        throw new RuntimeException('ذخیره فایل‌های ویدیویی و حجیم در سرور مجاز نیست؛ فقط تصاویر فشرده در قالب باینری صفر و یک (BLOB) در دیتابیس ذخیره می‌شوند.');
    }
    if (!preg_match('/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i', $dataUri, $matches)) {
        throw new RuntimeException('فرمت تصویر معتبر نیست. فقط تصاویر فشرده WebP، JPG و PNG مجاز هستند.');
    }
    $ext = strtolower($matches[1]) === 'jpeg' ? 'jpg' : strtolower($matches[1]);
    $mimeType = 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext);
    $binary = base64_decode($matches[2], true);
    if ($binary === false || strlen($binary) < 64) {
        throw new RuntimeException('فایل تصویر ناقص یا نامعتبر است.');
    }
    if (strlen($binary) > MAX_SITE_IMAGE_BLOB_BYTES) {
        throw new RuntimeException('حجم فایل بیش از حد مجاز است؛ فایل‌های حجیم در سرور ذخیره نمی‌شوند.');
    }
    if (function_exists('getimagesizefromstring')) {
        $info = @getimagesizefromstring($binary);
        if ($info === false) {
            throw new RuntimeException('ساختار باینری صفر و یک تصویر معتبر نیست.');
        }
    }
    // ذخیره صرفاً به صورت باینری صفر و یک (BLOB فشرده با Deduplication) در کانتینر دیتابیس بدون ایجاد هیچ فایلی در پوشه آپلودها
    return store_binary_blob_in_db_container($binary, $mimeType);
}

function unlink_stored_image(?string $imgUrl): void {
    if (!$imgUrl) return;
    if (strpos($imgUrl, 'action=blob&h=') !== false) {
        delete_binary_blob_from_db_container($imgUrl);
        return;
    }
    if (strpos($imgUrl, 'storage/uploads/') === 0) {
        $basename = basename($imgUrl);
        $fullPath = UPLOADS_DIR . $basename;
        if (is_file($fullPath)) {
            @unlink($fullPath);
        }
    }
}

function purge_expired_stories($pdo): void {
    $nowTs = time();
    $stmt = $pdo->prepare("SELECT id, image_url FROM business_stories WHERE (expires_at > 0 AND expires_at < ?) OR image_url LIKE '%600%20400%' OR image_url LIKE '%0 0 600 400%'");
    $stmt->execute([$nowTs]);
    $expired = $stmt->fetchAll();
    if (!empty($expired)) {
        $delStmt = $pdo->prepare("DELETE FROM business_stories WHERE id = ?");
        foreach ($expired as $ex) {
            unlink_stored_image($ex['image_url']);
            $delStmt->execute([$ex['id']]);
        }
    }
}

function cleanup_orphan_uploads($pdo): int {
    if (!is_dir(UPLOADS_DIR)) return 0;
    $used = [];
    $queries = [
        "SELECT image_url FROM market_listings",
        "SELECT image_url FROM business_stories",
        "SELECT image_url FROM hero_slides",
        "SELECT media_url AS image_url FROM community_media_posts WHERE media_url IS NOT NULL AND media_url != ''",
        "SELECT booth_logo AS image_url FROM users WHERE booth_logo IS NOT NULL",
        "SELECT national_card_url AS image_url FROM users WHERE national_card_url IS NOT NULL",
        "SELECT setting_value AS image_url FROM site_settings WHERE setting_key IN ('leader_photo_1', 'leader_photo_2')"
    ];
    foreach ($queries as $q) {
        try {
            $stmt = $pdo->query($q);
            while ($r = $stmt->fetch()) {
                if (!empty($r['image_url']) && strpos($r['image_url'], 'storage/uploads/') === 0) {
                    $used[basename($r['image_url'])] = true;
                }
            }
        } catch (Throwable $e) {}
    }
    $removed = 0;
    $files = @scandir(UPLOADS_DIR) ?: [];
    foreach ($files as $f) {
        if ($f === '.' || $f === '..' || $f === '.htaccess' || $f === 'index.html') continue;
        $full = UPLOADS_DIR . $f;
        if (is_file($full) && empty($used[$f])) {
            if (filemtime($full) < (time() - 300)) {
                if (@unlink($full)) $removed++;
            }
        }
    }
    return $removed;
}

function build_full_state($pdo, bool $isAdmin, string $sessionUser = ''): array {
    purge_expired_stories($pdo);

    // 1. Hero Slides
    $slides = [];
    $sqlSlides = $isAdmin
        ? "SELECT id, image_url as image_data, photographer_name, submitted_by, status, created_at FROM hero_slides ORDER BY id DESC LIMIT 60"
        : "SELECT id, image_url as image_data, photographer_name, submitted_by, status, created_at FROM hero_slides WHERE status = 'approved' ORDER BY id DESC LIMIT 30";
    $stmt = $pdo->query($sqlSlides);
    while ($row = $stmt->fetch()) {
        $slides[] = [
            'id' => (int)$row['id'],
            'image_data' => $row['image_data'],
            'photographer_name' => $row['photographer_name'],
            'submitted_by' => $row['submitted_by'] ?? 'اهالی شمال شرق',
            'status' => $row['status']
        ];
    }

    // 2. Business Stories (Active 48h window)
    $stories = [];
    $sqlStories = $isAdmin
        ? "SELECT * FROM business_stories ORDER BY id DESC LIMIT 60"
        : "SELECT * FROM business_stories WHERE status = 'approved' ORDER BY id DESC LIMIT 30";
    $stmtSt = $pdo->query($sqlStories);
    while ($st = $stmtSt->fetch()) {
        $stories[] = [
            'id' => (int)$st['id'],
            'owner_username' => $st['owner_username'],
            'booth_title' => $st['booth_title'],
            'caption' => $st['caption'],
            'image_data' => $st['image_url'],
            'status' => $st['status'],
            'created_ts' => (int)($st['created_ts'] ?? time()),
            'expires_at' => (int)($st['expires_at'] ?? (time() + 172800))
        ];
    }

    // 3. Registered Users & Booths - Strict Data Protection & Masking (SEC-02)
    $usersMap = [];
    $stmtU = $pdo->query("SELECT * FROM users ORDER BY id DESC");
    while ($u = $stmtU->fetch()) {
        $uname = $u['username'];
        $bStat = $u['booth_status'] ?? 'pending';
        $isSelf = ($sessionUser !== '' && $sessionUser === $uname);
        $isPrivileged = ($isAdmin || $isSelf);

        $usersMap[$uname] = [
            'username' => $uname,
            'first_name' => $isPrivileged ? ($u['first_name'] ?? '') : '',
            'last_name' => $isPrivileged ? ($u['last_name'] ?? '') : '',
            'display_name' => $u['display_name'],
            'age' => $isPrivileged ? (int)($u['age'] ?? 0) : 0,
            'national_code' => $isAdmin ? ($u['national_code'] ?? '') : ($isSelf ? ($u['national_code'] ?? '') : ''),
            'exact_address' => $isPrivileged ? ($u['exact_address'] ?: ($u['alley'] ?? 'شمال شرق')) : ($u['alley'] ?: 'شمال شرق'),
            'phone' => ($isPrivileged || $bStat === 'approved') ? $u['phone'] : '',
            'email' => $isPrivileged ? ($u['email'] ?? '') : '',
            'national_card_image' => $isAdmin ? ($u['national_card_url'] ?? null) : ($isSelf ? ($u['national_card_url'] ?? null) : null),
            'alley' => $u['alley'] ?: 'شمال شرق',
            'role' => $u['role'],
            'role_title' => ($bStat === 'approved') ? 'غرفه‌دار تاییدشده شمال شرق' : 'عضو محله (در انتظار تایید غرفه توسط ادمین)',
            'booth_title' => $u['booth_title'] ?: ('غرفه ' . $u['display_name']),
            'booth_bio' => $u['booth_bio'] ?: ('عرضه مستقیم کالا و خدمات در محدوده ' . ($u['exact_address'] ?: $u['alley'])),
            'booth_hours' => $u['booth_hours'] ?: 'همه‌روزه ۹ صبح تا ۲۱',
            'booth_logo' => $u['booth_logo'] ?: null,
            'profile_note' => $u['profile_note'] ?? 'همسایه هم‌عهدی',
            'booth_status' => $bStat,
            'booth_rejection_reason' => $isPrivileged ? ($u['booth_rejection_reason'] ?? null) : null,
            'is_suspended' => (bool)$u['is_suspended'],
            'created_at' => $isPrivileged ? ($u['created_at'] ?? '') : ''
        ];
    }

    // 4. Market Listings & Two-Way Messages Filtering (SEC-02)
    $listings = [];
    $rowsL = $pdo->query("SELECT * FROM market_listings ORDER BY laddered_at DESC, id DESC LIMIT 250")->fetchAll();

    $listingSellerMap = [];
    foreach ($rowsL as $r) {
        $listingSellerMap[(int)$r['id']] = $r['seller_username'] ?? '';
    }

    $msgMap = [];
    $stmtM = $pdo->query("SELECT * FROM listing_messages ORDER BY id ASC");
    while ($m = $stmtM->fetch()) {
        $lid = (int)$m['listing_id'];
        $mType = $m['message_type'] ?? 'pv';
        $mStatus = $m['status'] ?? 'approved';
        $sUname = trim((string)($m['sender_username'] ?? ''));
        $rUname = trim((string)($m['receiver_username'] ?? ''));
        $sellerUname = trim((string)($listingSellerMap[$lid] ?? ''));

        $canView = false;
        if ($isAdmin) {
            $canView = true;
        } elseif ($mType === 'comment') {
            $canView = ($mStatus === 'approved');
        } elseif ($mType === 'pv') {
            if ($sessionUser !== '') {
                if (strcasecmp($sUname, $sessionUser) === 0 || strcasecmp($rUname, $sessionUser) === 0 || ($sellerUname !== '' && strcasecmp($sellerUname, $sessionUser) === 0)) {
                    $canView = true;
                }
            }
        }

        if ($canView) {
            $msgMap[$lid][] = [
                'id' => (int)$m['id'],
                'listing_id' => $lid,
                'sender_username' => $sUname ?: 'resident',
                'receiver_username' => $rUname,
                'sender' => $m['sender_name'],
                'text' => $m['message_text'],
                'offered_price' => (int)($m['offered_price'] ?? 0),
                'offer_status' => $m['offer_status'] ?? 'pending',
                'message_type' => $mType,
                'status' => $mStatus
            ];
        }
    }

    foreach ($rowsL as $r) {
        $lid = (int)$r['id'];
        $specs = $r['specs_json'] ? (json_decode($r['specs_json'], true) ?: []) : [];
        $listings[] = [
            'id' => $lid,
            'seller_username' => $r['seller_username'],
            'seller_name' => $r['seller_name'],
            'booth_title' => $r['booth_title'] ?: ('غرفه ' . $r['seller_name']),
            'seller_phone' => $r['seller_phone'],
            'category' => $r['category'],
            'subcategory' => $specs['زیردسته تخصصی'] ?? '',
            'spiritual_summary' => $specs['هزینه معنوی ثبت‌شده'] ?? '',
            'title' => $r['title'],
            'description' => $r['description'],
            'price' => (int)$r['price'],
            'old_price' => (int)($r['old_price'] ?? 0),
            'discount_percent' => (int)($r['discount_percent'] ?? 0),
            'price_unit' => $r['price_unit'],
            'condition_badge' => $r['condition_badge'] ?: 'نو / تولید تازه',
            'delivery_badge' => $r['delivery_badge'] ?: 'تحویل حضوری در شمال شرق',
            'specs' => $specs,
            'address_detail' => $r['address_detail'],
            'image_data' => $r['image_url'],
            'is_amazing' => (bool)$r['is_amazing'],
            'amazing_status' => $r['amazing_status'] ?? 'none',
            'is_urgent' => (bool)$r['is_urgent'],
            'urgent_status' => $r['urgent_status'] ?? 'none',
            'ladder_status' => $r['ladder_status'] ?? 'none',
            'laddered_at' => (int)($r['laddered_at'] ?? 0),
            'views_count' => (int)($r['views_count'] ?? 0),
            'rating_avg' => round((float)($r['rating_avg'] ?? 4.8), 1),
            'rating_count' => (int)($r['rating_count'] ?? 12),
            'stock_count' => (int)($r['stock_count'] ?? 15),
            'status' => $r['status'],
            'rejection_reason' => $r['rejection_reason'] ?? null,
            'messages' => $msgMap[$lid] ?? []
        ];
    }

    // 5. Orders - Visible only to Admins and the involved buyer/seller (SEC-02)
    $orders = [];
    $stmtO = $pdo->query("SELECT * FROM market_orders ORDER BY id DESC LIMIT 100");
    while ($o = $stmtO->fetch()) {
        if ($isAdmin) {
            $orders[] = [
                'id' => (int)$o['id'],
                'order_code' => $o['order_code'],
                'listing_id' => (int)$o['listing_id'],
                'listing_title' => $o['listing_title'],
                'buyer_username' => $o['buyer_username'],
                'buyer_name' => $o['buyer_name'],
                'buyer_phone' => $o['buyer_phone'],
                'buyer_address' => $o['buyer_address'],
                'seller_username' => $o['seller_username'],
                'total_price' => (int)$o['total_price'],
                'order_status' => $o['order_status']
            ];
        } elseif ($sessionUser !== '') {
            if (($o['buyer_username'] ?? '') === $sessionUser || ($o['seller_username'] ?? '') === $sessionUser) {
                $orders[] = [
                    'id' => (int)$o['id'],
                    'order_code' => $o['order_code'],
                    'listing_id' => (int)$o['listing_id'],
                    'listing_title' => $o['listing_title'],
                    'buyer_username' => $o['buyer_username'],
                    'buyer_name' => $o['buyer_name'],
                    'buyer_phone' => $o['buyer_phone'],
                    'buyer_address' => $o['buyer_address'],
                    'seller_username' => $o['seller_username'],
                    'total_price' => (int)$o['total_price'],
                    'order_status' => $o['order_status']
                ];
            }
        }
    }

    // 6. Leader Photos
    $leaderPhotos = ['1' => null, '2' => null];
    $stmtS = $pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('leader_photo_1', 'leader_photo_2')");
    while ($s = $stmtS->fetch()) {
        if ($s['setting_key'] === 'leader_photo_1') $leaderPhotos['1'] = $s['setting_value'];
        if ($s['setting_key'] === 'leader_photo_2') $leaderPhotos['2'] = $s['setting_value'];
    }

    return [
        'status' => 'ok',
        'state_hash' => md5(count($listings) . ':' . count($stories) . ':' . count($orders) . ':' . json_encode(array_keys($msgMap)) . ':' . count($usersMap)),
        'csrf_token' => get_csrf_token(),
        'heroSlides' => $slides,
        'stories' => $stories,
        'users' => $usersMap,
        'listings' => $listings,
        'messagesByListingId' => $msgMap,
        'orders' => $orders,
        'leaderPhotos' => $leaderPhotos,
        'activeModules' => ['ahdbazar', 'ahdbot', 'ai_text'],
        'spiritualStats' => get_spiritual_stats($pdo),
        // v5: communityPosts removed
        // v5: followsData removed
        'registeredBotChannels' => get_registered_bot_channels($pdo, $isAdmin, $sessionUser),
        'serverVersion' => defined('HAMAHDI_VERSION') ? HAMAHDI_VERSION : '5.0.0',
        'directMessages' => $msgMap[0] ?? [],
        'ahdinoMessages' => $msgMap[-1] ?? []
    ];
}


function get_spiritual_stats($pdo): array {
    $defaults = [
        'total_salawat' => 0,
        'total_faraj' => 0,
        'completed_khatms' => 0,
        'locked_pages' => []
    ];
    try {
        $stmt = $pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?");
        $stmt->execute(['spiritual_stats_json']);
        $row = $stmt->fetch();
        if ($row && !empty($row['setting_value'])) {
            $decoded = json_decode($row['setting_value'], true);
            if (is_array($decoded)) {
                return [
                    'total_salawat' => max(0, (int)($decoded['total_salawat'] ?? 0)),
                    'total_faraj' => max(0, (int)($decoded['total_faraj'] ?? 0)),
                    'completed_khatms' => max(0, (int)($decoded['completed_khatms'] ?? 0)),
                    'locked_pages' => is_array($decoded['locked_pages'] ?? null) ? $decoded['locked_pages'] : []
                ];
            }
        }
    } catch (Throwable $e) {}
    return $defaults;
}

function save_spiritual_stats($pdo, array $stats): void {
    $json = json_encode($stats, JSON_UNESCAPED_UNICODE);
    try {
        if (defined('DB_DRIVER') && DB_DRIVER === 'mysql') {
            $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmt->execute(['spiritual_stats_json', $json]);
        } else {
            $stmt = $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
            $stmt->execute(['spiritual_stats_json', $json]);
        }
    } catch (Throwable $e) {}
}

function apply_spiritual_pledge($pdo, array $pledge, string $userDisplayName = 'همسایه هم‌عهدی'): array {
    $stats = get_spiritual_stats($pdo);
    $method = (string)($pledge['method'] ?? 'salawat');
    $who = clean_str($userDisplayName ?: 'همسایه هم‌عهدی');

    if ($method === 'salawat') {
        $cnt = max(1, min(100000, (int)($pledge['count'] ?? 14)));
        $stats['total_salawat'] = (int)$stats['total_salawat'] + $cnt;
    } elseif ($method === 'faraj') {
        $cnt = max(1, min(100000, (int)($pledge['count'] ?? 14)));
        $stats['total_faraj'] = (int)$stats['total_faraj'] + $cnt;
    } elseif ($method === 'quran') {
        $pages = $pledge['pages'] ?? [];
        if (!is_array($pages)) $pages = [$pages];
        if (!is_array($stats['locked_pages'])) $stats['locked_pages'] = [];
        foreach ($pages as $p) {
            $pNum = (int)$p;
            if ($pNum >= 1 && $pNum <= 604) {
                $pKey = (string)$pNum;
                if (empty($stats['locked_pages'][$pKey])) {
                    $stats['locked_pages'][$pKey] = $who;
                }
            }
        }
        if (count($stats['locked_pages']) >= 604) {
            $stats['completed_khatms'] = (int)($stats['completed_khatms'] ?? 0) + 1;
            $stats['locked_pages'] = [];
        }
    }

    save_spiritual_stats($pdo, $stats);
    return $stats;
}


function get_community_media_posts($pdo): array {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS community_media_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            app_target TEXT NOT NULL DEFAULT 'ahdino',
            media_type TEXT NOT NULL DEFAULT 'text',
            author_username TEXT NOT NULL DEFAULT 'resident',
            author_name TEXT NOT NULL,
            author_role TEXT DEFAULT '',
            title TEXT DEFAULT '',
            caption TEXT NOT NULL,
            media_url TEXT DEFAULT '',
            published_networks TEXT DEFAULT '[]',
            likes_count INTEGER NOT NULL DEFAULT 0,
            comments_json TEXT DEFAULT '[]',
            created_at TEXT NOT NULL
        )");
    } catch (Throwable $e) {}

    $rows = [];
    try {
        $rows = $pdo->query("SELECT * FROM community_media_posts ORDER BY id DESC LIMIT 120")->fetchAll();
    } catch (Throwable $e) {}

    $out = [];
    foreach ($rows as $r) {
        $nets = !empty($r['published_networks']) ? (json_decode((string)$r['published_networks'], true) ?: []) : [];
        $cmts = !empty($r['comments_json']) ? (json_decode((string)$r['comments_json'], true) ?: []) : [];
        $poll = !empty($r['poll_json']) ? (json_decode((string)$r['poll_json'], true) ?: null) : null;
        $gallery = !empty($r['media_gallery_json']) ? (json_decode((string)$r['media_gallery_json'], true) ?: []) : [];
        if (empty($gallery) && !empty($r['media_url'])) {
            $gallery = [$r['media_url']];
        }
        $out[] = [
            'id' => (int)$r['id'],
            'app_target' => $r['app_target'] ?: 'ahdino',
            'media_type' => $r['media_type'] ?: 'text',
            'author_username' => $r['author_username'] ?: 'resident',
            'author_name' => $r['author_name'] ?: 'کاربر',
            'author_role' => $r['author_role'] ?? '',
            'title' => $r['title'] ?? '',
            'caption' => $r['caption'] ?? '',
            'media_url' => $r['media_url'] ?? '',
            'media_gallery' => $gallery,
            'poll' => $poll,
            'repost_of_id' => (int)($r['repost_of_id'] ?? 0),
            'repost_author' => $r['repost_author'] ?? '',
            'reposts_count' => (int)($r['reposts_count'] ?? 0),
            'is_pinned' => (bool)($r['is_pinned'] ?? 0),
            'published_networks' => $nets,
            'likes_count' => (int)($r['likes_count'] ?? 0),
            'comments' => $cmts,
            'created_at' => $r['created_at'] ?? date('Y-m-d H:i:s')
        ];
    }
    return $out;
}

function get_user_follows_data($pdo): array {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS user_follows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_username TEXT NOT NULL,
            following_username TEXT NOT NULL,
            created_at TEXT NOT NULL
        )");
    } catch (Throwable $e) {}

    $rows = [];
    try {
        $rows = $pdo->query("SELECT follower_username, following_username FROM user_follows")->fetchAll();
    } catch (Throwable $e) {}

    $pairs = [];
    foreach ($rows as $r) {
        if (!empty($r['follower_username']) && !empty($r['following_username'])) {
            $pairs[] = [
                'follower' => $r['follower_username'],
                'following' => $r['following_username']
            ];
        }
    }
    return $pairs;
}

function get_registered_bot_channels($pdo, bool $isAdmin = true, string $sessionUser = ''): array {
    try {
        $st = $pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?");
        $st->execute(['registered_bot_channels_json']);
        $row = $st->fetch();
        if ($row && !empty($row['setting_value'])) {
            $decoded = json_decode($row['setting_value'], true);
            if (is_array($decoded)) {
                $clean = [];
                foreach ($decoded as $item) {
                    if (!is_array($item)) continue;
                    $cid = (int)($item['id'] ?? 0);
                    $pf = strtolower((string)($item['platform'] ?? ''));
                    if (($cid >= 701 && $cid <= 710) || !in_array($pf, ['bale', 'rubika', 'eitaa', 'telegram'], true)) {
                        continue;
                    }
                    $clean[] = $item;
                }
                return $clean;
            }
        }
    } catch (Throwable $e) {}
    return [];
}


function get_social_stories_list($pdo): array {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS social_stories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_name TEXT NOT NULL,
            author_username TEXT NOT NULL,
            author_role TEXT DEFAULT '',
            visibility TEXT DEFAULT 'public',
            title TEXT NOT NULL,
            caption TEXT NOT NULL,
            media_url TEXT DEFAULT '',
            media_type TEXT DEFAULT 'image',
            media_format TEXT DEFAULT 'image',
            likes_count INTEGER DEFAULT 0,
            replies_json TEXT DEFAULT '[]',
            created_at TEXT NOT NULL
        )");
        $rows = $pdo->query("SELECT * FROM social_stories ORDER BY id DESC LIMIT 80")->fetchAll();
        $out = [];
        foreach ($rows as $r) {
            $out[] = [
                'id' => (int)$r['id'],
                'scope' => ($r['visibility'] ?? 'public') === 'personal' ? 'personal' : 'public',
                'owner_username' => $r['author_username'] ?? 'resident',
                'owner_name' => $r['author_name'] ?? 'همسایه هم‌عهدی',
                'title' => $r['title'] ?? '',
                'caption' => $r['caption'] ?? '',
                'image' => $r['media_url'] ?? '',
                'media_type' => $r['media_type'] ?? 'image',
                'likes_count' => (int)($r['likes_count'] ?? 0),
                'created_at' => $r['created_at'] ?? 'امروز',
                'seen' => false
            ];
        }
        return $out;
    } catch (Throwable $e) {
        return [];
    }
}
