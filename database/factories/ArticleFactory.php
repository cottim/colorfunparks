<?php

namespace Database\Factories;

use App\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_id' => User::factory()->staff(),
            'title' => fake()->sentence(6),
            'subtitle' => fake()->optional()->sentence(),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->paragraph(),
            'category' => fake()->randomElement([
                'festas',
                'color-camp',
                'seguranca',
                'atividades',
                'bastidores',
                'novidades',
            ]),
            'status' => ArticleStatus::Draft,
            'cover_image_path' => null,
            'cover_image_alt' => null,
            'blocks' => [
                [
                    'type' => 'paragraph',
                    'content' => fake()->paragraphs(2, true),
                ],
            ],
            'seo_title' => null,
            'seo_description' => null,
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (): array => [
            'status' => ArticleStatus::Published,
            'published_at' => now()->subHour(),
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (): array => [
            'status' => ArticleStatus::Archived,
            'published_at' => null,
        ]);
    }
}
