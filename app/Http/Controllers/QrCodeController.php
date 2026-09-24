<?php

namespace App\Http\Controllers;

use App\Models\Shortlink;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class QrCodeController extends Controller
{
    public function __construct(
        protected QrCodeService $qrCodeService
    ) {}

    /**
     * Show QR code image inline.
     */
    public function show(Request $request, Shortlink $shortlink): Response
    {
        $this->authorizeAccess($request, $shortlink);

        $svg = $this->qrCodeService->getSvg($shortlink);

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Regenerate QR code.
     */
    public function generate(Request $request, Shortlink $shortlink)
    {
        $this->authorizeAccess($request, $shortlink);

        $this->qrCodeService->generate($shortlink);

        return back()->with('success', 'QR Code berhasil dibuat ulang.');
    }

    /**
     * Download QR code file.
     */
    public function download(Request $request, Shortlink $shortlink, string $format = 'svg')
    {
        $this->authorizeAccess($request, $shortlink);

        return $this->qrCodeService->download($shortlink, $format);
    }

    /**
     * Authorize access to shortlink QR code.
     */
    private function authorizeAccess(Request $request, Shortlink $shortlink): void
    {
        $user = $request->user();
        if (! $user->isAdmin() && $shortlink->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki hak akses untuk QR Code ini.');
        }
    }
}
