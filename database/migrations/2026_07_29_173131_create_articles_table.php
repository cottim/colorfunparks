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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->string('category')->index();
            $table->string('status')->default('draft')->index();
            $table->string('cover_image_path')->nullable();
            $table->string('cover_image_alt')->nullable();
            $table->json('blocks');
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();

            $table->index(['status', 'published_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
