<?php

namespace App\Services;

use App\Models\QrCode;
use App\Models\Shortlink;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QrCodeService
{
    /**
     * Generate and save QR code for a shortlink.
     */
    public function generate(Shortlink $shortlink, string $format = 'svg', int $size = 400): string
    {
        $url = url('/'.$shortlink->slug);

        $renderer = new ImageRenderer(
            new RendererStyle($size, 2),
            new SvgImageBackEnd
        );

        $writer = new Writer($renderer);
        $svgContent = $writer->writeString($url);

        $filename = "qrcodes/{$shortlink->id}.svg";
        Storage::disk('public')->put($filename, $svgContent);

        QrCode::updateOrCreate(
            ['shortlink_id' => $shortlink->id],
            [
                'format' => 'svg',
                'size' => $size,
            ]
        );

        return $svgContent;
    }

    /**
     * Get or generate the QR Code SVG content.
     */
    public function getSvg(Shortlink $shortlink, int $size = 400): string
    {
        $filename = "qrcodes/{$shortlink->id}.svg";

        if (Storage::disk('public')->exists($filename)) {
            return Storage::disk('public')->get($filename) ?: $this->generate($shortlink, 'svg', $size);
        }

        return $this->generate($shortlink, 'svg', $size);
    }

    /**
     * Download the QR Code.
     */
    public function download(Shortlink $shortlink, string $format = 'svg'): StreamedResponse
    {
        $svgContent = $this->getSvg($shortlink);
        $filename = "qrcode-{$shortlink->slug}.svg";

        return response()->streamDownload(function () use ($svgContent) {
            echo $svgContent;
        }, $filename, [
            'Content-Type' => 'image/svg+xml',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
