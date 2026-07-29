<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\ArticleImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ArticleImage>
 */
class ArticleImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'article_id' => Article::factory(),
            'path' => 'articles/gallery/'.fake()->uuid().'.jpg',
            'alt_text' => fake()->sentence(),
            'caption' => fake()->optional()->sentence(),
            'position' => fake()->numberBetween(1, 10),
        ];
    }
}
