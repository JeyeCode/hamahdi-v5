<?php
/**
 * HAMAHDI (هم‌عهدی) - ماژول مدیریت غرفه‌ها، پروفایل شخصی، کاربران و پشتیبان‌گیری (نسخه 3.1.5)
 * کنترل سطح دسترسی IDOR در ویرایش غرفه‌ها و پروفایل یکپارچه
 */

require_once __DIR__ . '/listings.php';

function handle_update_booth($pdo, array $input, bool $isAdmin, string $sessionUser): void {
    $uname = clean_str($input['username'] ?? $sessionUser);
    if (!$uname) {
        http_response_code(400);
        echo json_encode(['error' => 'نام کاربری نامعتبر است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (!$isAdmin && (!$sessionUser || strcasecmp($sessionUser, $uname) !== 0)) {
        http_response_code(403);
        echo json_encode(['error' => 'شما فقط مجاز به ویرایش پروفایل و غرفه اختصاصی خود هستید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    foreach ([
        "ALTER TABLE users ADD COLUMN profile_note TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN booth_tagline TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN booth_category TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN booth_social TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN booth_perks TEXT DEFAULT ''"
    ] as $__alterSql) {
        try { $pdo->exec($__alterSql); } catch (Throwable $e) {}
    }

    $stmtCur = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmtCur->execute([$uname]);
    $curUser = $stmtCur->fetch();
    if (!$curUser) {
        http_response_code(404);
        echo json_encode(['error' => 'کاربر یافت نشد.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $displayName = clean_str($input['display_name'] ?? $curUser['display_name'] ?? $uname);
    $bTitle = clean_str($input['booth_title'] ?? $curUser['booth_title'] ?? ('غرفه ' . $displayName));
    $bBio = isset($input['booth_bio']) ? clean_str($input['booth_bio']) : ($curUser['booth_bio'] ?? '');
    $bHours = clean_str($input['booth_hours'] ?? $curUser['booth_hours'] ?? 'همه‌روزه ۹ صبح تا ۲۱');
    $bAlley = clean_str($input['alley'] ?? $curUser['alley'] ?? 'شمال شرق');
    $bPhone = clean_str($input['phone'] ?? $curUser['phone'] ?? '');
    $bTagline = isset($input['booth_tagline']) ? clean_str($input['booth_tagline']) : ($curUser['booth_tagline'] ?? '');
    $bCategory = isset($input['booth_category']) ? clean_str($input['booth_category']) : ($curUser['booth_category'] ?? '');
    $bSocial = isset($input['booth_social']) ? clean_str($input['booth_social']) : ($curUser['booth_social'] ?? '');
    $bPerks = isset($input['booth_perks']) ? clean_str($input['booth_perks']) : ($curUser['booth_perks'] ?? '');
    $profNote = isset($input['profile_note']) ? clean_str($input['profile_note']) : ($curUser['profile_note'] ?? '');

    $rawLogo = (string)($input['booth_logo'] ?? '');
    $storedLogo = $curUser['booth_logo'] ?? null;
    if ($rawLogo !== '') {
        if (str_starts_with($rawLogo, 'data:image/') && strpos($rawLogo, 'svg+xml') === false) {
            try {
                $storedLogo = store_base64_image_to_disk($rawLogo, 'avatar_' . $uname);
            } catch (Throwable $e) {
                $storedLogo = $rawLogo;
            }
        } else {
            $storedLogo = $rawLogo;
        }
    }

    $pdo->prepare("UPDATE users SET display_name = ?, booth_title = ?, booth_bio = ?, booth_hours = ?, alley = ?, exact_address = ?, phone = ?, booth_logo = ?, booth_tagline = ?, booth_category = ?, booth_social = ?, booth_perks = ?, profile_note = ? WHERE username = ?")
        ->execute([$displayName, $bTitle, $bBio, $bHours, $bAlley, $bAlley, $bPhone, $storedLogo, $bTagline, $bCategory, $bSocial, $bPerks, $profNote, $uname]);

    if ($bTitle !== '') {
        $pdo->prepare("UPDATE market_listings SET booth_title = ?, seller_name = ? WHERE seller_username = ?")
            ->execute([$bTitle, $displayName, $uname]);
    }
    try {
        $pdo->prepare("UPDATE community_media_posts SET author_name = ? WHERE author_username = ?")
            ->execute([$displayName, $uname]);
    } catch (Throwable $e) {}

    echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
    exit;
}

function handle_export_backup($pdo, bool $isAdmin): void {
    if (!$isAdmin) {
        http_response_code(403);
        echo json_encode(['error' => 'فقط مدیر کل (ادمین) مجاز به دریافت فایل پشتیبان است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $cleanedOrphans = cleanup_orphan_uploads($pdo);
    $backupPayload = [
        'platform' => 'هم‌عهدی - سوپراپلیکیشن جامع شمال شرق مشهد',
        'version' => '3.1.5',
        'exported_at' => date('c'),
        'orphans_cleaned' => $cleanedOrphans,
        'data' => build_full_state($pdo, true, 'admin')
    ];
    echo json_encode($backupPayload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
