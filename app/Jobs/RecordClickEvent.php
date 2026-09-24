<?php

namespace App\Jobs;

use App\Models\ClickEvent;
use App\Services\UserAgentParser;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RecordClickEvent implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $shortlinkId,
        public ?string $ipAddress,
        public ?string $userAgent,
        public ?string $referrer,
        public string $clickedAt
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $parsed = UserAgentParser::parse($this->userAgent);

        ClickEvent::create([
            'shortlink_id' => $this->shortlinkId,
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent,
            'browser' => $parsed['browser'],
            'operating_system' => $parsed['operating_system'],
            'device_type' => $parsed['device_type'],
            'referrer' => $this->referrer,
            'country' => null,
            'region' => null,
            'clicked_at' => $this->clickedAt,
            'created_at' => now(),
        ]);
    }
}
