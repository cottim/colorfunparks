<?php

namespace App\Providers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Gate::define(
            'access-management',
            fn (User $user): bool => $user->canAccessManagement(),
        );

        RateLimiter::for(
            'newsletter-subscriptions',
            function (Request $request): array {
                $email = Str::lower(
                    trim((string) $request->input('email')),
                );

                return [
                    Limit::perMinute(
                        (int) config('newsletter.rate_limits.per_minute_per_ip'),
                    )->by('minute:'.$request->ip()),
                    Limit::perHour(
                        (int) config('newsletter.rate_limits.per_hour_per_ip'),
                    )->by('hour-ip:'.$request->ip()),
                    Limit::perHour(
                        (int) config('newsletter.rate_limits.per_hour_per_email'),
                    )->by('hour-email:'.hash('sha256', $email)),
                ];
            },
        );
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
