<?php

namespace App\Services;

class UserAgentParser
{
    /**
     * Parse User Agent into browser, OS, and device type.
     *
     * @return array{browser: string, operating_system: string, device_type: string}
     */
    public static function parse(?string $userAgent): array
    {
        if (empty($userAgent)) {
            return [
                'browser' => 'Unknown',
                'operating_system' => 'Unknown',
                'device_type' => 'Unknown',
            ];
        }

        return [
            'browser' => self::detectBrowser($userAgent),
            'operating_system' => self::detectOS($userAgent),
            'device_type' => self::detectDevice($userAgent),
        ];
    }

    private static function detectBrowser(string $ua): string
    {
        if (preg_match('/Edg/i', $ua)) {
            return 'Edge';
        }
        if (preg_match('/Chrome/i', $ua) && ! preg_match('/Edg/i', $ua)) {
            return 'Chrome';
        }
        if (preg_match('/Firefox/i', $ua)) {
            return 'Firefox';
        }
        if (preg_match('/Safari/i', $ua) && ! preg_match('/Chrome/i', $ua)) {
            return 'Safari';
        }
        if (preg_match('/Opera|OPR/i', $ua)) {
            return 'Opera';
        }
        if (preg_match('/MSIE|Trident/i', $ua)) {
            return 'Internet Explorer';
        }

        return 'Other';
    }

    private static function detectOS(string $ua): string
    {
        if (preg_match('/Windows NT 10.0/i', $ua)) {
            return 'Windows 10/11';
        }
        if (preg_match('/Windows NT 6.3/i', $ua)) {
            return 'Windows 8.1';
        }
        if (preg_match('/Windows NT 6.2/i', $ua)) {
            return 'Windows 8';
        }
        if (preg_match('/Windows NT 6.1/i', $ua)) {
            return 'Windows 7';
        }
        if (preg_match('/Windows/i', $ua)) {
            return 'Windows';
        }
        if (preg_match('/Android/i', $ua)) {
            return 'Android';
        }
        if (preg_match('/iPhone|iPad|iPod/i', $ua)) {
            return 'iOS';
        }
        if (preg_match('/Macintosh|Mac OS X/i', $ua)) {
            return 'macOS';
        }
        if (preg_match('/Linux/i', $ua)) {
            return 'Linux';
        }

        return 'Other';
    }

    private static function detectDevice(string $ua): string
    {
        if (preg_match('/Tablet|iPad/i', $ua)) {
            return 'Tablet';
        }
        if (preg_match('/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i', $ua)) {
            return 'Mobile';
        }

        return 'Desktop';
    }
}
