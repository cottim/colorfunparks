<?php

namespace App\Providers;

use App\Actions\Article\GetLatestArticlePreviews;
use App\Models\User;
use App\UserRole;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\ExceptionResponse;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

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
        $this->configureInertiaErrorPages();

        Gate::define(
            'access-management',
            fn (User $user): bool => $user->canAccessManagement(),
        );
        Gate::define(
            'access-customer-account',
            fn (User $user): bool => $user->role === UserRole::Customer,
        );
        Gate::define(
            'manage-internal-users',
            fn (User $user): bool => $user->role === UserRole::Admin,
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

        RateLimiter::for(
            'email-change-requests',
            function (Request $request): array {
                $email = Str::lower(
                    trim((string) $request->input('email')),
                );

                return [
                    Limit::perMinute(
                        (int) config(
                            'email_changes.rate_limits.per_minute_per_user',
                        ),
                    )->by('user:'.$request->user()?->getAuthIdentifier()),
                    Limit::perHour(
                        (int) config(
                            'email_changes.rate_limits.per_hour_per_email',
                        ),
                    )->by('email:'.hash('sha256', $email)),
                ];
            },
        );

        RateLimiter::for(
            'party-booking-submissions',
            function (Request $request): array {
                $customer = $request->user();
                $email = $customer instanceof User
                    && $customer->role === UserRole::Customer
                    ? $customer->email
                    : Str::lower(
                        trim((string) $request->input('email')),
                    );
                $limits = [
                    Limit::perMinute(
                        (int) config(
                            'party_bookings.rate_limits.per_minute_per_ip',
                        ),
                    )->by('minute:'.$request->ip()),
                    Limit::perHour(
                        (int) config(
                            'party_bookings.rate_limits.per_hour_per_ip',
                        ),
                    )->by('hour-ip:'.$request->ip()),
                ];

                if ($email !== '') {
                    $limits[] = Limit::perHour(
                        (int) config(
                            'party_bookings.rate_limits.per_hour_per_email',
                        ),
                    )->by('hour-email:'.hash('sha256', $email));
                }

                return $limits;
            },
        );

        RateLimiter::for(
            'customer-login-links',
            function (Request $request): array {
                $email = Str::lower(
                    trim((string) $request->input('email')),
                );

                return [
                    Limit::perMinute(
                        (int) config(
                            'customer_auth.rate_limits.per_minute_per_ip',
                        ),
                    )->by('minute:'.$request->ip()),
                    Limit::perHour(
                        (int) config(
                            'customer_auth.rate_limits.per_hour_per_ip',
                        ),
                    )->by('hour-ip:'.$request->ip()),
                    Limit::perHour(
                        (int) config(
                            'customer_auth.rate_limits.per_hour_per_email',
                        ),
                    )->by('hour-email:'.hash('sha256', $email)),
                ];
            },
        );

        RateLimiter::for(
            'staff-invitations',
            fn (Request $request): Limit => Limit::perMinute(10)->by(
                $request->ip(),
            ),
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

    private function configureInertiaErrorPages(): void
    {
        Inertia::handleExceptionsUsing(
            function (ExceptionResponse $response): ?ExceptionResponse {
                $request = $response->request;

                if (
                    ! $request->isMethod('GET')
                    || $request->is('api/*')
                    || $request->expectsJson()
                    || ! in_array(
                        $response->statusCode(),
                        [
                            SymfonyResponse::HTTP_FORBIDDEN,
                            SymfonyResponse::HTTP_NOT_FOUND,
                        ],
                        true,
                    )
                ) {
                    return null;
                }

                $response->response->setStatusCode(
                    SymfonyResponse::HTTP_NOT_FOUND,
                );
                $user = $request->user();

                return $response
                    ->render('errors/not-found', [
                        'canAccessManagement' => $user instanceof User
                            && $user->canAccessManagement(),
                        'latestArticles' => Cache::remember(
                            'errors.latest-article-previews',
                            now()->addMinutes(10),
                            fn (): array => app(
                                GetLatestArticlePreviews::class,
                            )->handle(3),
                        ),
                    ])
                    ->withSharedData();
            },
        );
    }
}
