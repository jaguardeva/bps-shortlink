<?php

namespace App\Services;

use App\Models\ClickEvent;
use App\Models\Shortlink;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get start date from period string (e.g. 7d, 30d, 90d, 1y).
     */
    protected function getStartDate(string $period): CarbonInterface
    {
        return match ($period) {
            '7d' => now()->subDays(7)->startOfDay(),
            '90d' => now()->subDays(90)->startOfDay(),
            '1y' => now()->subYear()->startOfDay(),
            default => now()->subDays(30)->startOfDay(),
        };
    }

    /**
     * Get overview summary statistics.
     */
    public function getOverviewStats(?string $userId = null): array
    {
        $shortlinkQuery = Shortlink::query();
        if ($userId) {
            $shortlinkQuery->where('user_id', $userId);
        }

        $shortlinkIds = $shortlinkQuery->pluck('id');

        $totalShortlinks = $shortlinkQuery->count();
        $activeShortlinks = (clone $shortlinkQuery)->where('status', 'active')->count();

        $clickQuery = ClickEvent::whereIn('shortlink_id', $shortlinkIds);

        $totalClicks = (clone $clickQuery)->count();
        $uniqueVisitors = (clone $clickQuery)->distinct('ip_address')->count('ip_address');
        $clicksToday = (clone $clickQuery)->where('clicked_at', '>=', now()->startOfDay())->count();
        $clicksThisWeek = (clone $clickQuery)->where('clicked_at', '>=', now()->startOfWeek())->count();
        $clicksThisMonth = (clone $clickQuery)->where('clicked_at', '>=', now()->startOfMonth())->count();

        return [
            'total_shortlinks' => $totalShortlinks,
            'active_shortlinks' => $activeShortlinks,
            'total_clicks' => $totalClicks,
            'unique_visitors' => $uniqueVisitors,
            'clicks_today' => $clicksToday,
            'clicks_this_week' => $clicksThisWeek,
            'clicks_this_month' => $clicksThisMonth,
        ];
    }

    /**
     * Get clicks aggregated over time.
     */
    public function getClicksOverTime(?string $shortlinkId = null, ?string $userId = null, string $period = '30d'): array
    {
        $startDate = $this->getStartDate($period);

        $query = ClickEvent::query()
            ->where('clicked_at', '>=', $startDate);

        if ($shortlinkId) {
            $query->where('shortlink_id', $shortlinkId);
        } elseif ($userId) {
            $shortlinkIds = Shortlink::where('user_id', $userId)->pluck('id');
            $query->whereIn('shortlink_id', $shortlinkIds);
        }

        $records = $query->select([
            DB::raw('DATE(clicked_at) as date'),
            DB::raw('COUNT(*) as total'),
            DB::raw('COUNT(DISTINCT ip_address) as unique_clicks'),
        ])
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        return $records->toArray();
    }

    /**
     * Get clicks by device type.
     */
    public function getClicksByDevice(?string $shortlinkId = null, ?string $userId = null, string $period = '30d'): array
    {
        $query = ClickEvent::query()
            ->where('clicked_at', '>=', $this->getStartDate($period));

        if ($shortlinkId) {
            $query->where('shortlink_id', $shortlinkId);
        } elseif ($userId) {
            $shortlinkIds = Shortlink::where('user_id', $userId)->pluck('id');
            $query->whereIn('shortlink_id', $shortlinkIds);
        }

        return $query->select('device_type', DB::raw('COUNT(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get()
            ->toArray();
    }

    /**
     * Get clicks by browser.
     */
    public function getClicksByBrowser(?string $shortlinkId = null, ?string $userId = null, string $period = '30d'): array
    {
        $query = ClickEvent::query()
            ->where('clicked_at', '>=', $this->getStartDate($period));

        if ($shortlinkId) {
            $query->where('shortlink_id', $shortlinkId);
        } elseif ($userId) {
            $shortlinkIds = Shortlink::where('user_id', $userId)->pluck('id');
            $query->whereIn('shortlink_id', $shortlinkIds);
        }

        return $query->select('browser', DB::raw('COUNT(*) as count'))
            ->groupBy('browser')
            ->orderByDesc('count')
            ->get()
            ->toArray();
    }

    /**
     * Get clicks by operating system.
     */
    public function getClicksByOS(?string $shortlinkId = null, ?string $userId = null, string $period = '30d'): array
    {
        $query = ClickEvent::query()
            ->where('clicked_at', '>=', $this->getStartDate($period));

        if ($shortlinkId) {
            $query->where('shortlink_id', $shortlinkId);
        } elseif ($userId) {
            $shortlinkIds = Shortlink::where('user_id', $userId)->pluck('id');
            $query->whereIn('shortlink_id', $shortlinkIds);
        }

        return $query->select('operating_system', DB::raw('COUNT(*) as count'))
            ->groupBy('operating_system')
            ->orderByDesc('count')
            ->get()
            ->toArray();
    }

    /**
     * Get top referrers.
     */
    public function getClicksByReferrer(?string $shortlinkId = null, ?string $userId = null, int $limit = 10): array
    {
        $query = ClickEvent::query()
            ->whereNotNull('referrer')
            ->where('referrer', '!=', '');

        if ($shortlinkId) {
            $query->where('shortlink_id', $shortlinkId);
        } elseif ($userId) {
            $shortlinkIds = Shortlink::where('user_id', $userId)->pluck('id');
            $query->whereIn('shortlink_id', $shortlinkIds);
        }

        return $query->select('referrer', DB::raw('COUNT(*) as count'))
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get top performing shortlinks.
     */
    public function getTopShortlinks(?string $userId = null, int $limit = 10): array
    {
        $query = Shortlink::query()
            ->with(['tags', 'user:id,name,email']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->orderByDesc('click_count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get full detailed analytics for a single shortlink.
     */
    public function getShortlinkAnalytics(Shortlink $shortlink, string $period = '30d'): array
    {
        $startDate = $this->getStartDate($period);

        $clickQuery = ClickEvent::where('shortlink_id', $shortlink->id)
            ->where('clicked_at', '>=', $startDate);

        $totalClicks = (clone $clickQuery)->count();
        $uniqueVisitors = (clone $clickQuery)->distinct('ip_address')->count('ip_address');

        return [
            'overview' => [
                'total_clicks' => $totalClicks,
                'unique_visitors' => $uniqueVisitors,
                'all_time_clicks' => $shortlink->click_count,
                'last_clicked_at' => $shortlink->last_clicked_at?->toISOString(),
            ],
            'clicks_over_time' => $this->getClicksOverTime($shortlink->id, null, $period),
            'devices' => $this->getClicksByDevice($shortlink->id, null, $period),
            'browsers' => $this->getClicksByBrowser($shortlink->id, null, $period),
            'operating_systems' => $this->getClicksByOS($shortlink->id, null, $period),
            'referrers' => $this->getClicksByReferrer($shortlink->id, null, 10),
            'recent_clicks' => ClickEvent::where('shortlink_id', $shortlink->id)
                ->orderByDesc('clicked_at')
                ->limit(20)
                ->get()
                ->map(fn ($event) => [
                    'id' => $event->id,
                    'ip_address' => $this->maskIp($event->ip_address),
                    'browser' => $event->browser,
                    'operating_system' => $event->operating_system,
                    'device_type' => $event->device_type,
                    'referrer' => $event->referrer,
                    'clicked_at' => $event->clicked_at?->toISOString(),
                ]),
        ];
    }

    /**
     * Mask IP address for privacy.
     */
    protected function maskIp(?string $ip): string
    {
        if (empty($ip)) {
            return 'Unknown';
        }

        $parts = explode('.', $ip);
        if (count($parts) === 4) {
            return "{$parts[0]}.{$parts[1]}.***.***";
        }

        return substr($ip, 0, 8).'***';
    }
}
