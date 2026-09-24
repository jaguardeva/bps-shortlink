<?php

namespace App\Http\Requests;

use App\Models\Shortlink;
use App\Services\SlugService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShortlinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $shortlink = $this->route('shortlink');

        if (! $shortlink instanceof Shortlink) {
            return false;
        }

        $user = $this->user();

        return $user && ($user->isAdmin() || $shortlink->user_id === $user->id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Shortlink|null $shortlink */
        $shortlink = $this->route('shortlink');
        $shortlinkId = $shortlink?->id;

        return [
            'destination_url' => ['required', 'string', 'url', 'max:2048'],
            'slug' => [
                'required',
                'string',
                'min:3',
                'max:100',
                'regex:/^[a-zA-Z0-9_-]+$/',
                Rule::unique('shortlinks', 'slug')->ignore($shortlinkId),
                function ($attribute, $value, $fail) {
                    if ($value && SlugService::isReserved($value)) {
                        $fail('Slug "'.$value.'" adalah kata yang dicadangkan oleh sistem dan tidak dapat digunakan.');
                    }
                },
            ],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'password' => ['nullable', 'string', 'min:4', 'max:100'],
            'remove_password' => ['nullable', 'boolean'],
            'expires_at' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['uuid', 'exists:tags,id'],
            'status' => ['nullable', 'in:active,disabled,expired'],
        ];
    }

    /**
     * Custom attribute names.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'destination_url' => 'URL Tujuan',
            'slug' => 'Kustom Slug',
            'title' => 'Judul',
            'description' => 'Deskripsi',
            'password' => 'Kata Sandi',
            'expires_at' => 'Waktu Kedaluwarsa',
            'tags' => 'Tag',
            'status' => 'Status',
        ];
    }
}
