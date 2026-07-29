<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;
use App\UserRole;

class ArticlePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessManagement();
    }

    public function create(User $user): bool
    {
        return $user->canAccessManagement();
    }

    public function update(User $user, Article $article): bool
    {
        return $user->canAccessManagement();
    }

    public function delete(User $user, Article $article): bool
    {
        return $user->role === UserRole::Admin;
    }
}
