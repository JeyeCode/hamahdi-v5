<?php
declare(strict_types=1);

/**
 * ماژول ثبت و بازیابی سوابق انتشار و تنظیمات ربات‌های عهدبات (نسخه 3.3.1 - کاملاً خام)
 * بدون هیچ‌گونه داده هاردکد؛ تمامی تنظیمات توسط ادمین ذخیره و بروزرسانی می‌شوند.
 */

namespace BalePublisher;

class HistoryLogger
{
    private string $historyFile;
    private string $baleConfigFile;
    private string $rubikaConfigFile;
    private string $eitaaConfigFile;
    private string $telegramConfigFile;

    public function __construct(string $storageDir)
    {
        $storageDir = rtrim($storageDir, '/\\');
        if (!is_dir($storageDir)) {
            @mkdir($storageDir, 0755, true);
        }
        $this->historyFile = $storageDir . '/publish_history.json';
        $this->baleConfigFile = $storageDir . '/bale_credentials.json';
        $this->rubikaConfigFile = $storageDir . '/rubika_credentials.json';
        $this->eitaaConfigFile = $storageDir . '/eitaa_credentials.json';
        $this->telegramConfigFile = $storageDir . '/telegram_credentials.json';
    }

    public function getBaleCredentials(array $baseConfig): array
    {
        $token = trim((string)($baseConfig['bale_bot_token'] ?? ''));
        $channelId = trim((string)($baseConfig['bale_channel_id'] ?? ''));
        $botName = '';
        $botUsername = trim((string)($baseConfig['bale_bot_username'] ?? ''));

        if (file_exists($this->baleConfigFile)) {
            $saved = json_decode((string)file_get_contents($this->baleConfigFile), true);
            if (is_array($saved)) {
                if (isset($saved['bale_bot_token']) && trim((string)$saved['bale_bot_token']) !== '') {
                    $token = trim((string)$saved['bale_bot_token']);
                }
                if (isset($saved['bale_channel_id'])) {
                    $channelId = trim((string)$saved['bale_channel_id']);
                }
                if (isset($saved['bot_name'])) {
                    $botName = trim((string)$saved['bot_name']);
                }
                if (isset($saved['bot_username'])) {
                    $botUsername = trim((string)$saved['bot_username']);
                }
            }
        }

        return [
            'token'        => $token,
            'channel_id'   => $channelId !== '' ? BaleClient::normalizeChannelId($channelId) : '',
            'bot_name'     => $botName,
            'bot_username' => ltrim($botUsername, '@'),
        ];
    }

    public function saveBaleCredentials(string $token, string $channelId, string $botName = '', string $botUsername = ''): void
    {
        $data = [
            'bale_bot_token'  => trim($token),
            'bale_channel_id' => trim($channelId) !== '' ? BaleClient::normalizeChannelId($channelId) : '',
            'bot_name'        => trim($botName),
            'bot_username'    => ltrim(trim($botUsername), '@'),
            'updated_at'      => date('Y-m-d H:i:s'),
        ];
        file_put_contents($this->baleConfigFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }

    public function getRubikaCredentials(array $baseConfig): array
    {
        $token = trim((string)($baseConfig['rubika_bot_token'] ?? ''));
        $channelId = trim((string)($baseConfig['rubika_channel_id'] ?? ''));
        $botName = '';
        $botUsername = trim((string)($baseConfig['rubika_bot_username'] ?? ''));

        if (file_exists($this->rubikaConfigFile)) {
            $saved = json_decode((string)file_get_contents($this->rubikaConfigFile), true);
            if (is_array($saved)) {
                if (isset($saved['rubika_bot_token']) && trim((string)$saved['rubika_bot_token']) !== '') {
                    $token = trim((string)$saved['rubika_bot_token']);
                }
                if (isset($saved['rubika_channel_id'])) {
                    $channelId = trim((string)$saved['rubika_channel_id']);
                }
                if (isset($saved['bot_name'])) {
                    $botName = trim((string)$saved['bot_name']);
                }
                if (isset($saved['bot_username'])) {
                    $botUsername = trim((string)$saved['bot_username']);
                }
            }
        }

        return [
            'token'        => $token,
            'channel_id'   => $channelId !== '' ? RubikaClient::normalizeChatId($channelId) : '',
            'bot_name'     => $botName,
            'bot_username' => ltrim($botUsername, '@'),
        ];
    }

    public function saveRubikaCredentials(string $token, string $channelId, string $botName = '', string $botUsername = ''): void
    {
        $data = [
            'rubika_bot_token'  => trim($token),
            'rubika_channel_id' => trim($channelId) !== '' ? RubikaClient::normalizeChatId($channelId) : '',
            'bot_name'          => trim($botName),
            'bot_username'      => ltrim(trim($botUsername), '@'),
            'updated_at'        => date('Y-m-d H:i:s'),
        ];
        file_put_contents($this->rubikaConfigFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }

    public function getTelegramCredentials(array $baseConfig): array
    {
        $token = trim((string)($baseConfig['telegram_bot_token'] ?? ''));
        $channelId = trim((string)($baseConfig['telegram_channel_id'] ?? ''));
        $proxy = trim((string)($baseConfig['telegram_proxy'] ?? ''));
        $botName = '';
        $botUsername = trim((string)($baseConfig['telegram_bot_username'] ?? ''));

        if (file_exists($this->telegramConfigFile)) {
            $saved = json_decode((string)file_get_contents($this->telegramConfigFile), true);
            if (is_array($saved)) {
                if (isset($saved['telegram_bot_token']) && trim((string)$saved['telegram_bot_token']) !== '') {
                    $token = trim((string)$saved['telegram_bot_token']);
                }
                if (isset($saved['telegram_channel_id'])) {
                    $channelId = trim((string)$saved['telegram_channel_id']);
                }
                if (isset($saved['telegram_proxy'])) {
                    $proxy = trim((string)$saved['telegram_proxy']);
                }
                if (isset($saved['bot_name'])) {
                    $botName = trim((string)$saved['bot_name']);
                }
                if (isset($saved['bot_username'])) {
                    $botUsername = trim((string)$saved['bot_username']);
                }
            }
        }

        return [
            'token'        => $token,
            'channel_id'   => $channelId !== '' ? TelegramClient::normalizeChannelId($channelId) : '',
            'proxy'        => $proxy,
            'bot_name'     => $botName,
            'bot_username' => ltrim($botUsername, '@'),
        ];
    }

    public function saveTelegramCredentials(string $token, string $channelId, string $proxy = '', string $botName = '', string $botUsername = ''): void
    {
        $data = [
            'telegram_bot_token'  => trim($token),
            'telegram_channel_id' => trim($channelId) !== '' ? TelegramClient::normalizeChannelId($channelId) : '',
            'telegram_proxy'      => trim($proxy),
            'bot_name'            => trim($botName),
            'bot_username'        => ltrim(trim($botUsername), '@'),
            'updated_at'          => date('Y-m-d H:i:s'),
        ];
        file_put_contents($this->telegramConfigFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }

    public function getEitaaCredentials(array $baseConfig): array
    {
        $token = trim((string)($baseConfig['eitaa_bot_token'] ?? ''));
        $channelId = trim((string)($baseConfig['eitaa_channel_id'] ?? ''));
        $botName = '';
        $botUsername = trim((string)($baseConfig['eitaa_bot_username'] ?? ''));

        if (file_exists($this->eitaaConfigFile)) {
            $saved = json_decode((string)file_get_contents($this->eitaaConfigFile), true);
            if (is_array($saved)) {
                if (isset($saved['eitaa_bot_token']) && trim((string)$saved['eitaa_bot_token']) !== '') {
                    $token = trim((string)$saved['eitaa_bot_token']);
                }
                if (isset($saved['eitaa_channel_id'])) {
                    $channelId = trim((string)$saved['eitaa_channel_id']);
                }
                if (isset($saved['bot_name'])) {
                    $botName = trim((string)$saved['bot_name']);
                }
                if (isset($saved['bot_username'])) {
                    $botUsername = trim((string)$saved['bot_username']);
                }
            }
        }

        return [
            'token'        => $token,
            'channel_id'   => $channelId !== '' ? EitaaClient::normalizeChannelId($channelId) : '',
            'bot_name'     => $botName,
            'bot_username' => ltrim($botUsername, '@'),
        ];
    }

    public function saveEitaaCredentials(string $token, string $channelId, string $botName = '', string $botUsername = ''): void
    {
        $data = [
            'eitaa_bot_token'  => trim($token),
            'eitaa_channel_id' => trim($channelId) !== '' ? EitaaClient::normalizeChannelId($channelId) : '',
            'bot_name'         => trim($botName),
            'bot_username'     => ltrim(trim($botUsername), '@'),
            'updated_at'       => date('Y-m-d H:i:s'),
        ];
        file_put_contents($this->eitaaConfigFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }

    public function logPublishAttempt(array $entry): array
    {
        $list = $this->getHistory(100);
        $msgId = $entry['remote_message_id'] ?? $entry['bale_message_id'] ?? null;

        $record = [
            'id'                => count($list) > 0 ? ((int)$list[0]['id'] + 1) : 1001,
            'created_at'        => date('Y-m-d H:i:s'),
            'platform'          => $entry['platform'] ?? 'bale',
            'channel_id'        => $entry['channel_id'] ?? '',
            'file_name'         => $entry['file_name'] ?? '',
            'original_name'     => $entry['original_name'] ?? '',
            'caption'           => $entry['caption'] ?? '',
            'status'            => $entry['status'] ?? 'published',
            'bale_message_id'   => $msgId,
            'remote_message_id' => $msgId,
            'error_message'     => $entry['error_message'] ?? null,
        ];

        array_unshift($list, $record);
        $list = array_slice($list, 0, 100);
        file_put_contents($this->historyFile, json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        return $record;
    }

    public function getHistory(int $limit = 50): array
    {
        if (!file_exists($this->historyFile)) {
            return [];
        }
        $data = json_decode((string)file_get_contents($this->historyFile), true);
        if (!is_array($data)) {
            return [];
        }
        return array_slice($data, 0, $limit);
    }
}
