<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $shortlink_id
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $browser
 * @property string|null $operating_system
 * @property string|null $device_type
 * @property string|null $referrer
 * @property string|null $country
 * @property string|null $region
 * @property Carbon $clicked_at
 * @property Carbon|null $created_at
 * @property-read Shortlink $shortlink
 */
#[Fillable([
    'shortlink_id',
    'ip_address',
    'user_agent',
    'browser',
    'operating_system',
    'device_type',
    'referrer',
    'country',
    'region',
    'clicked_at',
    'created_at',
])]
class ClickEvent extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    public $timestamps = false;

    protected $keyType = 'string';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'clicked_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Shortlink, $this>
     */
    public function shortlink(): BelongsTo
    {
        return $this->belongsTo(Shortlink::class);
    }
}
