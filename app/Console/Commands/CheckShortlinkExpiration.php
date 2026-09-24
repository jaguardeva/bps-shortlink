<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use App\Models\Shortlink;
use Illuminate\Console\Command;

class CheckShortlinkExpiration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shortlinks:check-expiration';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and mark expired shortlinks as expired';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $expiredLinks = Shortlink::where('status', 'active')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->get();

        $count = $expiredLinks->count();

        foreach ($expiredLinks as $link) {
            $link->update(['status' => 'expired']);

            AuditLog::create([
                'user_id' => null,
                'action' => 'SHORTLINK_EXPIRED',
                'entity_type' => Shortlink::class,
                'entity_id' => $link->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'CLI Scheduler',
                'metadata' => [
                    'slug' => $link->slug,
                    'expired_at' => $link->expires_at?->toIso8601String(),
                ],
                'created_at' => now(),
            ]);
        }

        $this->info("Successfully marked {$count} shortlinks as expired.");

        return Command::SUCCESS;
    }
}
