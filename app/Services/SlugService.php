<?php

namespace App\Services;

use App\Models\Shortlink;
use App\Models\SystemSetting;
use Illuminate\Support\Str;

class SlugService
{
    /**
     * Reserved slug keywords that cannot be used as shortlinks.
     *
     * @var array<string>
     */
    public const RESERVED_SLUGS = [
        'admin',
        'dashboard',
        'login',
        'logout',
        'api',
        'users',
        'settings',
        'analytics',
        'shortlinks',
        'register',
        'forgot-password',
        'reset-password',
        'password',
        'tags',
        'qr',
        'monitoring',
        'audit-logs',
        'profile',
        'up',
        'home',
        'storage',
        'build',
        'assets',
    ];

    /**
     * Check if a slug is a reserved system keyword.
     */
    public static function isReserved(string $slug): bool
    {
        return in_array(strtolower(trim($slug)), self::RESERVED_SLUGS, true);
    }

    /**
     * Normalize a slug.
     */
    public static function normalize(string $slug): string
    {
        return Str::slug($slug, '-');
    }

    /**
     * Generate a unique random slug.
     */
    public static function generate(?int $length = null): string
    {
        $len = $length ?? (int) SystemSetting::get('default_shortlink_length', 6);
        $attempts = 0;
        $maxAttempts = 50;

        do {
            $slug = Str::random($len);
            $attempts++;

            if ($attempts >= $maxAttempts) {
                $len++;
                $attempts = 0;
            }
        } while (self::isReserved($slug) || Shortlink::withTrashed()->where('slug', $slug)->exists());

        return $slug;
    }
}
