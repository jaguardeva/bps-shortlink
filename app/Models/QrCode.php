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
 * @property string $format
 * @property int $size
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Shortlink $shortlink
 */
#[Fillable(['shortlink_id', 'format', 'size'])]
class QrCode extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
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
