<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@kanal3516.site'],
            [
                'name' => 'Administrator BPS',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');

        // Optional standard user for initial testing
        $user = User::firstOrCreate(
            ['email' => 'user@kanal3516.site'],
            [
                'name' => 'Pegawai BPS',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('user');
    }
}
