<?php

namespace App\Services;

use App\Models\QrCode;
use App\Models\Shortlink;
use BaconQrCode\Common\ErrorCorrectionLevel;
use BaconQrCode\Encoder\Encoder;
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
        if ($format === 'png') {
            return $this->generatePng($shortlink, $size);
        }

        return $this->generateSvg($shortlink, $size);
    }

    /**
     * Generate and save SVG QR code.
     */
    public function generateSvg(Shortlink $shortlink, int $size = 400): string
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
     * Generate PNG QR code using GD and store it.
     */
    public function generatePng(Shortlink $shortlink, int $size = 400): string
    {
        $url = url('/'.$shortlink->slug);
        $qr = Encoder::encode($url, ErrorCorrectionLevel::M());
        $matrix = $qr->getMatrix();

        $width = $matrix->getWidth();
        $height = $matrix->getHeight();
        $margin = 2;

        $totalModules = $width + ($margin * 2);
        $moduleSize = (int) max(1, (int) floor($size / $totalModules));
        $imgSize = $totalModules * $moduleSize;

        $img = imagecreatetruecolor($imgSize, $imgSize);
        $white = imagecolorallocate($img, 255, 255, 255);
        $black = imagecolorallocate($img, 0, 0, 0);

        imagefilledrectangle($img, 0, 0, $imgSize - 1, $imgSize - 1, $white);

        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width; $x++) {
                if ($matrix->get($x, $y) === 1) {
                    $x1 = ($x + $margin) * $moduleSize;
                    $y1 = ($y + $margin) * $moduleSize;
                    $x2 = $x1 + $moduleSize - 1;
                    $y2 = $y1 + $moduleSize - 1;
                    imagefilledrectangle($img, $x1, $y1, $x2, $y2, $black);
                }
            }
        }

        ob_start();
        imagepng($img);
        $pngContent = (string) ob_get_clean();
        imagedestroy($img);

        $filename = "qrcodes/{$shortlink->id}.png";
        Storage::disk('public')->put($filename, $pngContent);

        return $pngContent;
    }

    /**
     * Get or generate the QR Code SVG content.
     */
    public function getSvg(Shortlink $shortlink, int $size = 400): string
    {
        $filename = "qrcodes/{$shortlink->id}.svg";

        if (Storage::disk('public')->exists($filename)) {
            return Storage::disk('public')->get($filename) ?: $this->generateSvg($shortlink, $size);
        }

        return $this->generateSvg($shortlink, $size);
    }

    /**
     * Get or generate the QR Code PNG content.
     */
    public function getPng(Shortlink $shortlink, int $size = 400): string
    {
        $filename = "qrcodes/{$shortlink->id}.png";

        if (Storage::disk('public')->exists($filename)) {
            return Storage::disk('public')->get($filename) ?: $this->generatePng($shortlink, $size);
        }

        return $this->generatePng($shortlink, $size);
    }

    /**
     * Download the QR Code in requested format (svg or png).
     */
    public function download(Shortlink $shortlink, string $format = 'svg'): StreamedResponse
    {
        $format = strtolower($format) === 'png' ? 'png' : 'svg';
        $filename = "qrcode-{$shortlink->slug}.{$format}";

        if ($format === 'png') {
            $content = $this->getPng($shortlink);
            $mimeType = 'image/png';
        } else {
            $content = $this->getSvg($shortlink);
            $mimeType = 'image/svg+xml';
        }

        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, $filename, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}

