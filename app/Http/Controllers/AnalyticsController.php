<?php

namespace App\Http\Controllers;

use App\Models\Shortlink;
use App\Models\User;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        protected AnalyticsService $analyticsService
    ) {}

    /**
     * Show general analytics overview.
     */
    public function overview(Request $request): Response
    {
        $user = $request->user();
        $userId = $user->isAdmin() ? null : $user->id;
        $period = $request->query('period', '30d');

        $stats = $this->analyticsService->getOverviewStats($userId);
        $clicksOverTime = $this->analyticsService->getClicksOverTime(null, $userId, $period);
        $devices = $this->analyticsService->getClicksByDevice(null, $userId, $period);
        $browsers = $this->analyticsService->getClicksByBrowser(null, $userId, $period);
        $operatingSystems = $this->analyticsService->getClicksByOS(null, $userId, $period);
        $referrers = $this->analyticsService->getClicksByReferrer(null, $userId, 10);
        $topShortlinks = $this->analyticsService->getTopShortlinks($userId, 10);

        return Inertia::render('analytics/index', [
            'period' => $period,
            'stats' => $stats,
            'clicksOverTime' => $clicksOverTime,
            'devices' => $devices,
            'browsers' => $browsers,
            'operatingSystems' => $operatingSystems,
            'referrers' => $referrers,
            'topShortlinks' => $topShortlinks,
        ]);
    }

    /**
     * Show per-shortlink detailed analytics.
     */
    public function shortlink(Request $request, Shortlink $shortlink): Response
    {
        $user = $request->user();
        if (! $user->isAdmin() && $shortlink->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki hak akses untuk statistik tautan ini.');
        }

        $period = $request->query('period', '30d');
        $analytics = $this->analyticsService->getShortlinkAnalytics($shortlink, $period);

        return Inertia::render('analytics/shortlink', [
            'shortlink' => $shortlink->load(['tags', 'user:id,name,email']),
            'period' => $period,
            'analytics' => $analytics,
        ]);
    }

    /**
     * Admin view: analytics for a specific user.
     */
    public function userAnalytics(Request $request, User $user): Response
    {
        $period = $request->query('period', '30d');

        $stats = $this->analyticsService->getOverviewStats($user->id);
        $clicksOverTime = $this->analyticsService->getClicksOverTime(null, $user->id, $period);
        $devices = $this->analyticsService->getClicksByDevice(null, $user->id, $period);
        $browsers = $this->analyticsService->getClicksByBrowser(null, $user->id, $period);
        $topShortlinks = $this->analyticsService->getTopShortlinks($user->id, 10);

        return Inertia::render('analytics/index', [
            'targetUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'period' => $period,
            'stats' => $stats,
            'clicksOverTime' => $clicksOverTime,
            'devices' => $devices,
            'browsers' => $browsers,
            'operatingSystems' => [],
            'referrers' => [],
            'topShortlinks' => $topShortlinks,
        ]);
    }
}
