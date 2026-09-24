<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ClickEvent;
use App\Models\Shortlink;
use App\Models\User;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected AnalyticsService $analyticsService
    ) {}

    /**
     * Show the application dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return $this->adminDashboard($request);
        }

        return $this->userDashboard($request, $user);
    }

    /**
     * Admin Dashboard view data.
     */
    protected function adminDashboard(Request $request): Response
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'total_shortlinks' => Shortlink::count(),
            'active_shortlinks' => Shortlink::where('status', 'active')->count(),
            'expired_shortlinks' => Shortlink::where('status', 'expired')
                ->orWhere(fn ($q) => $q->whereNotNull('expires_at')->where('expires_at', '<=', now()))
                ->count(),
            'total_clicks' => (int) Shortlink::sum('click_count'),
            'clicks_today' => ClickEvent::where('clicked_at', '>=', now()->startOfDay())->count(),
            'clicks_this_month' => ClickEvent::where('clicked_at', '>=', now()->startOfMonth())->count(),
        ];

        $clicksOverTime = $this->analyticsService->getClicksOverTime(null, null, '30d');
        $topShortlinks = $this->analyticsService->getTopShortlinks(null, 5);

        $recentClicks = ClickEvent::with(['shortlink:id,slug,title,destination_url'])
            ->orderByDesc('clicked_at')
            ->limit(6)
            ->get();

        $recentShortlinks = Shortlink::with(['user:id,name,email', 'tags'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $expiringSoon = Shortlink::where('status', 'active')
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [now(), now()->addDays(7)])
            ->orderBy('expires_at')
            ->limit(5)
            ->get();

        $recentActivity = AuditLog::with(['user:id,name,email'])
            ->orderByDesc('created_at')
            ->limit(6)
            ->get();

        return Inertia::render('dashboard', [
            'isAdmin' => true,
            'stats' => $stats,
            'clicksOverTime' => $clicksOverTime,
            'topShortlinks' => $topShortlinks,
            'recentClicks' => $recentClicks,
            'recentShortlinks' => $recentShortlinks,
            'expiringSoon' => $expiringSoon,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Staff/User Dashboard view data.
     */
    protected function userDashboard(Request $request, User $user): Response
    {
        $shortlinkQuery = Shortlink::where('user_id', $user->id);
        $shortlinkIds = (clone $shortlinkQuery)->pluck('id');

        $stats = [
            'total_shortlinks' => (clone $shortlinkQuery)->count(),
            'active_shortlinks' => (clone $shortlinkQuery)->where('status', 'active')->count(),
            'expired_shortlinks' => (clone $shortlinkQuery)->where('status', 'expired')
                ->orWhere(fn ($q) => $q->whereNotNull('expires_at')->where('expires_at', '<=', now()))
                ->count(),
            'total_clicks' => (int) (clone $shortlinkQuery)->sum('click_count'),
            'clicks_today' => ClickEvent::whereIn('shortlink_id', $shortlinkIds)
                ->where('clicked_at', '>=', now()->startOfDay())
                ->count(),
        ];

        $clicksOverTime = $this->analyticsService->getClicksOverTime(null, $user->id, '30d');
        $topShortlinks = $this->analyticsService->getTopShortlinks($user->id, 5);

        $recentShortlinks = Shortlink::where('user_id', $user->id)
            ->with('tags')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'isAdmin' => false,
            'stats' => $stats,
            'clicksOverTime' => $clicksOverTime,
            'topShortlinks' => $topShortlinks,
            'recentShortlinks' => $recentShortlinks,
        ]);
    }
}
