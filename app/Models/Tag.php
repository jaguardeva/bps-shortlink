<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $name
 * @property string $slug
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Shortlink> $shortlinks
 */
#[Fillable(['name', 'slug'])]
class Tag extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return BelongsToMany<Shortlink, $this>
     */
    public function shortlinks(): BelongsToMany
    {
        return $this->belongsToMany(Shortlink::class, 'shortlink_tags', 'tag_id', 'shortlink_id');
    }
}
