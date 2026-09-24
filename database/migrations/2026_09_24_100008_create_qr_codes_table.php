<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('qr_codes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('shortlink_id')
                ->unique()
                ->constrained('shortlinks')
                ->cascadeOnDelete();

            $table->enum('format', ['png', 'svg'])->default('png');
            $table->unsignedInteger('size')->default(500);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
    }
};
