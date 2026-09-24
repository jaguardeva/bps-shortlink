<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $user_id
 * @property string $slug
 * @property string|null $title
 * @property string|null $description
 * @property string $destination_url
 * @property string|null $password_hash
 * @property string $status
 * @property Carbon|null $expires_at
 * @property int $click_count
 * @property Carbon|null $last_clicked_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User $user
 * @property-read Collection<int, Tag> $tags
 * @property-read Collection<int, ClickEvent> $clickEvents
 * @property-read QrCode|null $qrCode
 */
#[Fillable([
    'user_id',
    'slug',
    'title',
    'description',
    'destination_url',
    'password_hash',
    'status',
    'expires_at',
    'click_count',
    'last_clicked_at',
])]
class Shortlink extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'last_clicked_at' => 'datetime',
            'click_count' => 'integer',
            'status' => 'string',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<Tag, $this>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'shortlink_tags', 'shortlink_id', 'tag_id');
    }

    /**
     * @return HasMany<ClickEvent, $this>
     */
    public function clickEvents(): HasMany
    {
        return $this->hasMany(ClickEvent::class);
    }

    /**
     * @return HasOne<QrCode, $this>
     */
    public function qrCode(): HasOne
    {
        return $this->hasOne(QrCode::class);
    }

    /**
     * Scope for active shortlinks.
     *
     * @param  Builder<Shortlink>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active')
            ->where(function (Builder $q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope for expired shortlinks.
     *
     * @param  Builder<Shortlink>  $query
     */
    public function scopeExpired(Builder $query): void
    {
        $query->where('status', 'expired')
            ->orWhere(function (Builder $q) {
                $q->whereNotNull('expires_at')
                    ->where('expires_at', '<=', now());
            });
    }

    /**
     * Check if shortlink is protected by password.
     */
    public function isPasswordProtected(): bool
    {
        return ! empty($this->password_hash);
    }

    /**
     * Check if shortlink is expired.
     */
    public function isExpired(): bool
    {
        if ($this->status === 'expired') {
            return true;
        }

        return $this->expires_at !== null && $this->expires_at->isPast();
    }
}
