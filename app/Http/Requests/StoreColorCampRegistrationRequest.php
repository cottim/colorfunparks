<?php

namespace App\Http\Requests;

use App\UserRole;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreColorCampRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isAuthenticatedCustomer = $this->user()?->role === UserRole::Customer;
        $hasHealthData = $this
            ->string('allergies_and_health_notes')
            ->trim()
            ->isNotEmpty();
        /** @var list<array{value: string, available: bool}> $weeks */
        $weeks = config('color_camp.weeks');
        /** @var list<array{value: string}> $days */
        $days = config('color_camp.days');
        /** @var list<array{value: string}> $lunchOptions */
        $lunchOptions = config('color_camp.lunch_options');
        /** @var list<array{value: string}> $discounts */
        $discounts = config('color_camp.discounts');
        /** @var list<array{value: string}> $photoConsents */
        $photoConsents = config('color_camp.photo_consents');
        $availableWeeks = collect($weeks)
            ->where('available', true)
            ->pluck('value')
            ->all();

        return [
            'contact_name' => [
                Rule::requiredIf(! $isAuthenticatedCustomer),
                'nullable',
                'string',
                'max:255',
            ],
            'email' => [
                Rule::requiredIf(! $isAuthenticatedCustomer),
                'nullable',
                'string',
                Rule::email()->rfcCompliant(),
                'max:255',
            ],
            'phone' => ['required', 'string', 'max:30'],
            'child_name' => ['required', 'string', 'max:255'],
            'child_birth_date' => ['required', 'date_format:Y-m-d'],
            'allergies_and_health_notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'health_data_consent' => [
                Rule::requiredIf($hasHealthData),
                Rule::when($hasHealthData, ['accepted']),
                'nullable',
                'boolean',
            ],
            'authorized_pickup_name' => [
                'required',
                'string',
                'max:255',
            ],
            'authorized_pickup_phone' => [
                'required',
                'string',
                'max:30',
            ],
            'attendance_type' => [
                'required',
                'string',
                Rule::in(['weeks', 'days']),
            ],
            'selected_weeks' => [
                'exclude_unless:attendance_type,weeks',
                'required',
                'array',
                'min:1',
            ],
            'selected_weeks.*' => [
                'string',
                'distinct',
                Rule::in($availableWeeks),
            ],
            'selected_days' => [
                'exclude_unless:attendance_type,days',
                'required',
                'array',
                'min:1',
            ],
            'selected_days.*' => [
                'date_format:Y-m-d',
                'distinct',
                Rule::in(array_column($days, 'value')),
            ],
            'lunch_option' => [
                'required',
                'string',
                Rule::in(array_column($lunchOptions, 'value')),
            ],
            'discount' => [
                'nullable',
                'string',
                Rule::in(array_column($discounts, 'value')),
            ],
            'needs_extended_care' => ['required', 'boolean'],
            'trip_authorized' => ['required', 'boolean'],
            'photo_consent' => [
                'required',
                'string',
                Rule::in(array_column($photoConsents, 'value')),
            ],
            'notes' => ['nullable', 'string', 'max:5000'],
            'privacy_accepted' => ['required', 'accepted'],
            'terms_accepted' => ['required', 'accepted'],
            'website' => ['nullable', 'max:0'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $this->validatePhone(
                    $validator,
                    'phone',
                    'Indica um número de telefone válido.',
                );
                $this->validatePhone(
                    $validator,
                    'authorized_pickup_phone',
                    'Indica um contacto de recolha válido.',
                );
            },
            function (Validator $validator): void {
                $birthDate = CarbonImmutable::createFromFormat(
                    'Y-m-d',
                    $this->string('child_birth_date')->toString(),
                );

                if ($birthDate === null) {
                    return;
                }

                $firstCampDay = CarbonImmutable::parse(
                    (string) config('color_camp.first_day'),
                );
                $age = (int) $birthDate->diffInYears($firstCampDay);
                $minimumAge = (int) config('color_camp.minimum_age');
                $maximumAge = (int) config('color_camp.maximum_age');

                if ($age < $minimumAge || $age > $maximumAge) {
                    $validator->errors()->add(
                        'child_birth_date',
                        "O Color Camp destina-se a crianças dos {$minimumAge} aos {$maximumAge} anos.",
                    );
                }
            },
        ];
    }

    /**
     * @return array{
     *     contact_name: string|null,
     *     email: string|null,
     *     phone: string,
     *     child_name: string,
     *     child_birth_date: string,
     *     allergies_and_health_notes: string|null,
     *     authorized_pickup_name: string,
     *     authorized_pickup_phone: string,
     *     attendance_type: string,
     *     selected_weeks: list<string>,
     *     selected_days: list<string>,
     *     lunch_option: string,
     *     discount: string|null,
     *     needs_extended_care: bool,
     *     trip_authorized: bool,
     *     photo_consent: string,
     *     notes: string|null
     * }
     */
    public function registrationData(): array
    {
        return [
            'contact_name' => $this->nullableString('contact_name'),
            'email' => $this->nullableString('email'),
            'phone' => (string) $this->validated('phone'),
            'child_name' => (string) $this->validated('child_name'),
            'child_birth_date' => (string) $this->validated(
                'child_birth_date',
            ),
            'allergies_and_health_notes' => $this->nullableString(
                'allergies_and_health_notes',
            ),
            'authorized_pickup_name' => (string) $this->validated(
                'authorized_pickup_name',
            ),
            'authorized_pickup_phone' => (string) $this->validated(
                'authorized_pickup_phone',
            ),
            'attendance_type' => (string) $this->validated(
                'attendance_type',
            ),
            'selected_weeks' => $this->validatedStringList(
                'selected_weeks',
            ),
            'selected_days' => $this->validatedStringList('selected_days'),
            'lunch_option' => (string) $this->validated('lunch_option'),
            'discount' => $this->nullableString('discount'),
            'needs_extended_care' => (bool) $this->validated(
                'needs_extended_care',
            ),
            'trip_authorized' => (bool) $this->validated(
                'trip_authorized',
            ),
            'photo_consent' => (string) $this->validated('photo_consent'),
            'notes' => $this->nullableString('notes'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'contact_name.required' => 'Indica o teu nome.',
            'email.required' => 'Indica o teu email.',
            'email.email' => 'Indica um endereço de email válido.',
            'phone.required' => 'Indica o teu contacto telefónico.',
            'child_name.required' => 'Indica o nome da criança.',
            'child_birth_date.required' => 'Indica a data de nascimento.',
            'authorized_pickup_name.required' => 'Indica quem pode recolher a criança.',
            'authorized_pickup_phone.required' => 'Indica o contacto da pessoa autorizada.',
            'attendance_type.in' => 'Escolhe semanas completas ou dias avulso.',
            'selected_weeks.required' => 'Escolhe pelo menos uma semana.',
            'selected_weeks.*.in' => 'Uma das semanas escolhidas já não está disponível.',
            'selected_days.required' => 'Escolhe pelo menos um dia.',
            'selected_days.*.in' => 'Escolhe apenas dias disponíveis do Color Camp.',
            'lunch_option.in' => 'Escolhe uma opção de almoço válida.',
            'discount.in' => 'Escolhe uma opção de desconto válida.',
            'photo_consent.in' => 'Escolhe uma opção de autorização de imagem.',
            'health_data_consent.required' => 'É necessário autorizar especificamente o tratamento das informações de saúde indicadas.',
            'health_data_consent.accepted' => 'É necessário autorizar especificamente o tratamento das informações de saúde indicadas.',
            'privacy_accepted.accepted' => 'É necessário aceitar a Política de Privacidade.',
            'terms_accepted.accepted' => 'É necessário aceitar os Termos e Condições.',
            'website.max' => 'Não foi possível enviar a inscrição.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'contact_name' => $this->string('contact_name')->trim()->toString(),
            'email' => Str::lower($this->string('email')->trim()->toString()),
            'phone' => $this->string('phone')->trim()->toString(),
            'child_name' => $this->string('child_name')->trim()->toString(),
            'authorized_pickup_name' => $this
                ->string('authorized_pickup_name')
                ->trim()
                ->toString(),
            'authorized_pickup_phone' => $this
                ->string('authorized_pickup_phone')
                ->trim()
                ->toString(),
        ]);
    }

    private function validatePhone(
        Validator $validator,
        string $field,
        string $message,
    ): void {
        $phone = $this->string($field)->toString();

        if ($phone === '') {
            return;
        }

        $digitCount = Str::length(
            preg_replace('/\D/', '', $phone) ?? '',
        );

        if ($digitCount < 9 || $digitCount > 15) {
            $validator->errors()->add($field, $message);
        }
    }

    private function nullableString(string $key): ?string
    {
        $value = (string) $this->validated($key, '');

        return $value !== '' ? $value : null;
    }

    /**
     * @return list<string>
     */
    private function validatedStringList(string $key): array
    {
        $values = $this->validated($key, []);

        if (! is_array($values)) {
            return [];
        }

        return array_values(array_map(strval(...), $values));
    }
}
