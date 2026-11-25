<?php
/**
 * HAMAHDI (هم‌عهدی) - ماژول چت خصوصی آنی (PV)، چانه‌زنی، نظرات عمومی و سفارش‌ها (نسخه 9.0)
 * کنترل سطح دسترسی IDOR در ثبت پیام، چت خصوصی، سفارش‌ها و تغییر وضعیت سفارش‌ها
 */

require_once __DIR__ . '/listings.php';

function filter_forbidden_words_fa(string $text): string {
    $forbidden = [
        'کلاهبردار', 'دزد', 'احمق', 'بیشعور', 'آشغال', 'فحش', 'لعنت',
        'حرامزاده', 'کثافت', 'بی‌شرف', 'بیشرف', 'خفه', 'ابله', 'روانی', 'شارلاتان'
    ];
    return str_replace($forbidden, '***', $text);
}

function handle_add_message($pdo, array $input, bool $isAdmin, string $sessionUser, string $now): void {
    if (!$isAdmin && !$sessionUser) {
        http_response_code(401);
        echo json_encode(['error' => 'فقط اعضای ثبت‌نام‌شده می‌توانند پیام چت خصوصی (PV) یا دیدگاه ارسال کنند.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $lid = (int)($input['listing_id'] ?? 0);
    $clientSender = preg_replace('/[^a-zA-Z0-9_.-]/', '', trim((string)($input['sender_username'] ?? '')));
    $senderUname = ($clientSender !== '' && $clientSender !== 'guest') ? $clientSender : ($isAdmin ? 'admin' : $sessionUser);
    $receiverUname = clean_str($input['receiver_username'] ?? '');
    $sender = clean_str($input['sender'] ?? 'همسایه شمال شرق');
    $rawTxt = clean_str($input['text'] ?? '');
    $txt = filter_forbidden_words_fa($rawTxt);
    $offeredPrice = max(0, (int)($input['offered_price'] ?? 0));
    $msgType = (($input['message_type'] ?? 'pv') === 'comment') ? 'comment' : 'pv';

    $initialStatus = 'approved';

    if ($lid >= -2 && $txt !== '') {
        $stmt = $pdo->prepare("INSERT INTO listing_messages (listing_id, sender_username, receiver_username, sender_name, message_text, offered_price, message_type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$lid, $senderUname, $receiverUname, $sender, $txt, $offeredPrice, $msgType, $initialStatus, $now]);
    }
    echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
    exit;
}

function handle_create_order($pdo, array $input, bool $isAdmin, string $sessionUser, string $now): void {
    if (!$isAdmin && !$sessionUser) {
        http_response_code(401);
        echo json_encode(['error' => 'برای ثبت سفارش خرید باید ابتدا وارد حساب کاربری خود شوید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $buyerUname = $isAdmin ? clean_str($input['buyer_username'] ?? 'admin') : $sessionUser;
    $lid = (int)($input['listing_id'] ?? 0);
    $lTitle = clean_str($input['listing_title'] ?? '');
    $bName = clean_str($input['buyer_name'] ?? '');
    $bPhone = clean_str($input['buyer_phone'] ?? '');
    $bAddr = clean_str($input['buyer_address'] ?? '');
    $sUname = clean_str($input['seller_username'] ?? '');
    $tPrice = max(0, (int)($input['total_price'] ?? 0));
    $ordCode = 'TBR-' . rand(100000, 999999);

    $pdo->prepare("INSERT INTO market_orders (order_code, listing_id, listing_title, buyer_username, buyer_name, buyer_phone, buyer_address, seller_username, total_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        ->execute([$ordCode, $lid, $lTitle, $buyerUname, $bName, $bPhone, $bAddr, $sUname, $tPrice, $now]);
    echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
    exit;
}

function handle_update_order_status($pdo, array $input, bool $isAdmin, string $sessionUser): void {
    $oid = (int)($input['id'] ?? $input['order_id'] ?? 0);
    $newStatus = clean_str($input['order_status'] ?? $input['status'] ?? '');

    if ($oid <= 0 || $newStatus === '') {
        http_response_code(400);
        echo json_encode(['error' => 'شناسه سفارش یا وضعیت جدید مشخص نشده است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare("SELECT seller_username, buyer_username FROM market_orders WHERE id = ?");
    $stmt->execute([$oid]);
    $ord = $stmt->fetch();

    if (!$ord) {
        http_response_code(404);
        echo json_encode(['error' => 'سفارش موردنظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (!$isAdmin && (!$sessionUser || ($ord['seller_username'] !== $sessionUser && $ord['buyer_username'] !== $sessionUser))) {
        http_response_code(403);
        echo json_encode(['error' => 'فقط فروشنده (غرفه‌دار)، خریدار مربوطه یا ادمین مجاز به تغییر وضعیت سفارش هستند.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $pdo->prepare("UPDATE market_orders SET order_status = ? WHERE id = ?")->execute([$newStatus, $oid]);
    echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
    exit;
}


function handle_delete_message($pdo, array $input, bool $isAdmin, string $sessionUser): void {
    if (!$isAdmin && !$sessionUser) {
        http_response_code(401);
        echo json_encode(['error' => 'برای حذف پیام ابتدا وارد حساب کاربری خود شوید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $mid = (int)($input['id'] ?? 0);
    if ($mid > 0) {
        $stmt = $pdo->prepare("SELECT * FROM listing_messages WHERE id = ?");
        $stmt->execute([$mid]);
        $msg = $stmt->fetch();
        if ($msg) {
            $lid = (int)($msg['listing_id'] ?? 0);
            $sellerUname = '';
            if ($lid > 0) {
                $stmtL = $pdo->prepare("SELECT seller_username FROM market_listings WHERE id = ?");
                $stmtL->execute([$lid]);
                $listingRow = $stmtL->fetch();
                $sellerUname = $listingRow['seller_username'] ?? '';
            }

            $sUname = (string)($msg['sender_username'] ?? '');
            $rUname = (string)($msg['receiver_username'] ?? '');
            if ($isAdmin || strcasecmp($sUname, $sessionUser) === 0 || strcasecmp($rUname, $sessionUser) === 0 || strcasecmp($sellerUname, $sessionUser) === 0) {
                $pdo->prepare("DELETE FROM listing_messages WHERE id = ?")->execute([$mid]);
            }
        }
    }
    echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
    exit;
}

function handle_delete_chat($pdo, array $input, bool $isAdmin, string $sessionUser): void {
    if (!$isAdmin && !$sessionUser) {
        http_response_code(401);
        echo json_encode(['error' => 'برای حذف گفتگو ابتدا وارد حساب کاربری خود شوید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $lid = (int)($input['listing_id'] ?? 0);
    $partner = trim((string)($input['partner_username'] ?? ''));

    if ($lid >= -2) {
        $sellerUname = '';
        if ($lid > 0) {
            $stmtL = $pdo->prepare("SELECT seller_username FROM market_listings WHERE id = ?");
            $stmtL->execute([$lid]);
            $listingRow = $stmtL->fetch();
            $sellerUname = (string)($listingRow['seller_username'] ?? '');
        }

        $allMsgs = $pdo->query("SELECT * FROM listing_messages ORDER BY id ASC")->fetchAll();
        $delStmt = $pdo->prepare("DELETE FROM listing_messages WHERE id = ?");

        foreach ($allMsgs as $m) {
            if ((int)($m['listing_id'] ?? 0) !== $lid) continue;
            $s = (string)($m['sender_username'] ?? '');
            $r = (string)($m['receiver_username'] ?? '');

            $involvesUser = $isAdmin || strcasecmp($s, $sessionUser) === 0 || strcasecmp($r, $sessionUser) === 0 || strcasecmp($sellerUname, $sessionUser) === 0;
            $involvesPartner = ($partner === '' || $partner === 'resident' || strcasecmp($s, $partner) === 0 || strcasecmp($r, $partner) === 0 || strcasecmp($sellerUname, $partner) === 0);

            if ($involvesUser && $involvesPartner) {
                $delStmt->execute([(int)$m['id']]);
            }
        }
    }
    echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
    exit;
}
