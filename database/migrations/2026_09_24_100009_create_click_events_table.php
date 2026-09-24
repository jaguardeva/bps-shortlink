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
        Schema::create('click_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('shortlink_id')
                ->constrained('shortlinks')
                ->cascadeOnDelete();

            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('browser', 100)->nullable();
            $table->string('operating_system', 100)->nullable();
            $table->string('device_type', 50)->nullable();
            $table->text('referrer')->nullable();
            $table->string('country', 100)->nullable();
            $table->string('region', 100)->nullable();
            $table->timestamp('clicked_at');
            $table->timestamp('created_at')->nullable();

            $table->index('shortlink_id');
            $table->index('clicked_at');
            $table->index('device_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('click_events');
    }
};
