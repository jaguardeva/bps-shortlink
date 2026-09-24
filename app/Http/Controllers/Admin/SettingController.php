<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display a listing of system settings.
     */
    public function index(): Response
    {
        $settings = SystemSetting::all()->mapWithKeys(function ($item) {
            return [$item->setting_key => [
                'key' => $item->setting_key,
                'value' => $item->getParsedValue(),
                'type' => $item->value_type,
                'description' => $item->description,
            ]];
        });

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update system settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable'],
        ]);

        foreach ($validated['settings'] as $key => $val) {
            $existing = SystemSetting::where('setting_key', $key)->first();
            if ($existing) {
                SystemSetting::set(
                    key: $key,
                    value: $val,
                    type: $existing->value_type,
                    description: $existing->description
                );
            }
        }

        AuditLogService::log(
            action: 'SETTINGS_UPDATED',
            metadata: ['keys' => array_keys($validated['settings'])]
        );

        return back()->with('success', 'Pengaturan sistem berhasil disimpan.');
    }
}
