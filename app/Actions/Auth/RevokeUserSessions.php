<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RevokeUserSessions
{
    public function handle(User $user, ?string $exceptSessionId = null): void
    {
        $user->forceFill([
            'remember_token' => Str::random(60),
        ])->save();

        if (config('session.driver') !== 'database') {
            return;
        }

        $sessions = DB::table((string) config('session.table', 'sessions'))
            ->where('user_id', $user->getKey());

        if ($exceptSessionId !== null) {
            $sessions->where('id', '!=', $exceptSessionId);
        }

        $sessions->delete();
    }
}
