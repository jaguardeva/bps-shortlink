<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'setting_key' => 'app_name',
                'setting_value' => 'BPS Mojokerto Shortlink',
                'value_type' => 'string',
                'description' => 'Application name displayed on dashboard and headers',
            ],
            [
                'setting_key' => 'default_shortlink_length',
                'setting_value' => '6',
                'value_type' => 'integer',
                'description' => 'Default random slug length for generated shortlinks',
            ],
            [
                'setting_key' => 'default_expiration_days',
                'setting_value' => '0',
                'value_type' => 'integer',
                'description' => 'Default expiration days (0 means no expiration)',
            ],
            [
                'setting_key' => 'allow_custom_slug',
                'setting_value' => '1',
                'value_type' => 'boolean',
                'description' => 'Whether users are permitted to define custom slugs',
            ],
            [
                'setting_key' => 'analytics_retention_days',
                'setting_value' => '365',
                'value_type' => 'integer',
                'description' => 'Days to retain click events analytics data',
            ],
            [
                'setting_key' => 'max_login_attempts',
                'setting_value' => '5',
                'value_type' => 'integer',
                'description' => 'Max login attempts allowed before throttle per minute',
            ],
            [
                'setting_key' => 'password_min_length',
                'setting_value' => '8',
                'value_type' => 'integer',
                'description' => 'Minimum length required for passwords',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                $setting
            );
        }
    }
}
