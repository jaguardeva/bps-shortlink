<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\MonitoringController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\RedirectController;
use App\Http\Controllers\ShortlinkController;
use App\Http\Controllers\ShortlinkPasswordController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;


// Redirect root to dashboard (if authenticated) or login
Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Dashboard

    // Shortlinks CRUD
    Route::resource('shortlinks', ShortlinkController::class);
    Route::patch('shortlinks/{shortlink}/toggle', [ShortlinkController::class, 'toggle'])
        ->name('shortlinks.toggle');

    // QR Codes
    Route::get('shortlinks/{shortlink}/qr', [QrCodeController::class, 'show'])->name('qr.show');
    Route::post('shortlinks/{shortlink}/qr', [QrCodeController::class, 'generate'])->name('qr.generate');
    Route::get('shortlinks/{shortlink}/qr/download/{format?}', [QrCodeController::class, 'download'])->name('qr.download');

    // Tags
    Route::apiResource('tags', TagController::class)->only(['index', 'store', 'destroy']);

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'overview'])->name('analytics.overview');
    Route::get('analytics/shortlink/{shortlink}', [AnalyticsController::class, 'shortlink'])->name('analytics.shortlink');

    // User Profile
    Route::get('profile', [ProfileController::class, 'index'])->name('profile');
    Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Admin Only Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        // Users Management
        Route::resource('users', UserController::class);
        Route::patch('users/{user}/toggle', [UserController::class, 'toggle'])->name('users.toggle');
        Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');

        // Roles & Permissions
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');

        // Audit Logs
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');

        // System Settings
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

        // System Monitoring
        Route::get('monitoring/activity', [MonitoringController::class, 'activity'])->name('monitoring.activity');
        Route::get('monitoring/failed-access', [MonitoringController::class, 'failedAccess'])->name('monitoring.failed-access');

        // Per-user analytics
        Route::get('analytics/users/{user}', [AnalyticsController::class, 'userAnalytics'])->name('analytics.users');
    });
});

// Password verification for shortlink
Route::get('/{slug}/password', [ShortlinkPasswordController::class, 'show'])->name('shortlink.password');
Route::post('/{slug}/password', [ShortlinkPasswordController::class, 'verify'])->name('shortlink.password.verify');

// Public Redirect Route (MUST BE LAST)
Route::get('/{slug}', RedirectController::class)->name('redirect');
