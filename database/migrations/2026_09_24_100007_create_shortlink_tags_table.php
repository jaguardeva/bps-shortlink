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
        Schema::create('shortlink_tags', function (Blueprint $table) {
            $table->foreignUuid('shortlink_id')
                ->constrained('shortlinks')
                ->cascadeOnDelete();
            $table->foreignUuid('tag_id')
                ->constrained('tags')
                ->cascadeOnDelete();

            $table->primary(['shortlink_id', 'tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shortlink_tags');
    }
};
