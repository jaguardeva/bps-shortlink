<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    /**
     * Display a listing of the tags.
     */
    public function index(Request $request): JsonResponse
    {
        $tags = Tag::query()
            ->when($request->query('search'), function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return response()->json($tags);
    }

    /**
     * Store a newly created tag in storage.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $slug = Str::slug($validated['name']);

        $tag = Tag::firstOrCreate(
            ['slug' => $slug],
            ['name' => $validated['name']]
        );

        if ($request->wantsJson()) {
            return response()->json($tag, 201);
        }

        return back()->with('success', 'Tag berhasil ditambahkan.');
    }

    /**
     * Remove the specified tag from storage.
     */
    public function destroy(Tag $tag): JsonResponse|RedirectResponse
    {
        $tag->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Tag berhasil dihapus.']);
        }

        return back()->with('success', 'Tag berhasil dihapus.');
    }
}
