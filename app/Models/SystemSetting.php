<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $setting_key
 * @property string|null $setting_value
 * @property string $value_type
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'setting_key',
    'setting_value',
    'value_type',
    'description',
])]
class SystemSetting extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Get typed value of setting.
     *
     * @return mixed
     */
    public function getParsedValue()
    {
        if ($this->setting_value === null) {
            return null;
        }

        return match ($this->value_type) {
            'integer' => (int) $this->setting_value,
            'boolean' => filter_var($this->setting_value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($this->setting_value, true),
            default => $this->setting_value,
        };
    }

    /**
     * Static helper to get setting value by key.
     *
     * @param  mixed  $default
     * @return mixed
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('setting_key', $key)->first();

        if (! $setting) {
            return $default;
        }

        return $setting->getParsedValue() ?? $default;
    }

    /**
     * Static helper to set setting value by key.
     *
     * @param  mixed  $value
     */
    public static function set(string $key, $value, string $type = 'string', ?string $description = null): self
    {
        $serializedValue = match ($type) {
            'json' => is_string($value) ? $value : json_encode($value),
            'boolean' => $value ? '1' : '0',
            default => (string) $value,
        };

        return static::updateOrCreate(
            ['setting_key' => $key],
            [
                'setting_value' => $serializedValue,
                'value_type' => $type,
                'description' => $description,
            ]
        );
    }
}
