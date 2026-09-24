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
        Schema::create('shortlinks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('slug', 100)->unique();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->text('destination_url');
            $table->string('password_hash')->nullable();

            $table->enum('status', [
                'active',
                'disabled',
                'expired',
            ])->default('active');

            $table->timestamp('expires_at')->nullable();
            $table->unsignedBigInteger('click_count')->default(0);
            $table->timestamp('last_clicked_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('status');
            $table->index('expires_at');
            $table->index('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shortlinks');
    }
};
