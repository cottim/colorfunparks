<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StorePartyBookingRequest extends FormRequest
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
        /** @var list<array{value: string, label: string}> $parks */
        $parks = config('party_bookings.parks');
        /** @var list<array{value: string, label: string, description: string}> $programs */
        $programs = config('party_bookings.programs');
        /** @var list<string> $partyTimes */
        $partyTimes = config('party_bookings.party_times');
        $latestPartyDate = today()
            ->addMonths((int) config('party_bookings.max_months_ahead'))
            ->toDateString();

        return [
            'contact_name' => ['required', 'string', 'max:255'],
            'email' => [
                'nullable',
                'required_without:phone',
                Rule::requiredIf($this->boolean('marketing_accepted')),
                'string',
                Rule::email()->rfcCompliant(),
                'max:255',
            ],
            'phone' => [
                'nullable',
                'required_without:email',
                'string',
                'max:30',
            ],
            'privacy_accepted' => ['required', 'accepted'],
            'terms_accepted' => ['required', 'accepted'],
            'marketing_accepted' => ['required', 'boolean'],
            'park' => [
                'required',
                'string',
                Rule::in(array_column($parks, 'value')),
            ],
            'child_name' => ['required', 'string', 'max:255'],
            'child_age' => ['required', 'integer', 'between:1,99'],
            'party_date' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:today',
                'before_or_equal:'.$latestPartyDate,
            ],
            'party_time' => [
                'required',
                'string',
                Rule::in($partyTimes),
            ],
            'guests' => ['required', 'integer', 'between:10,100'],
            'program' => [
                'required',
                'string',
                Rule::in(array_column($programs, 'value')),
            ],
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
                $phone = $this->string('phone')->toString();

                if ($phone === '') {
                    return;
                }

                $digitCount = Str::length(
                    preg_replace('/\D/', '', $phone) ?? '',
                );

                if ($digitCount < 9 || $digitCount > 15) {
                    $validator->errors()->add(
                        'phone',
                        'Indica um número de telefone válido.',
                    );
                }
            },
        ];
    }

    /**
     * @return array{
     *     contact_name: string,
     *     email: string|null,
     *     phone: string|null,
     *     privacy_accepted: bool,
     *     terms_accepted: bool,
     *     marketing_accepted: bool,
     *     park: string,
     *     child_name: string,
     *     child_age: int,
     *     party_date: string,
     *     party_time: string,
     *     guests: int,
     *     program: string,
     *     website: string|null
     * }
     */
    public function partyBookingData(): array
    {
        $email = (string) $this->validated('email', '');
        $phone = (string) $this->validated('phone', '');
        $website = (string) $this->validated('website', '');

        return [
            'contact_name' => (string) $this->validated('contact_name'),
            'email' => $email !== '' ? $email : null,
            'phone' => $phone !== '' ? $phone : null,
            'privacy_accepted' => (bool) $this->validated('privacy_accepted'),
            'terms_accepted' => (bool) $this->validated('terms_accepted'),
            'marketing_accepted' => (bool) $this->validated('marketing_accepted'),
            'park' => (string) $this->validated('park'),
            'child_name' => (string) $this->validated('child_name'),
            'child_age' => (int) $this->validated('child_age'),
            'party_date' => (string) $this->validated('party_date'),
            'party_time' => (string) $this->validated('party_time'),
            'guests' => (int) $this->validated('guests'),
            'program' => (string) $this->validated('program'),
            'website' => $website !== '' ? $website : null,
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'contact_name.required' => 'Indica o teu nome.',
            'email.required_without' => 'Indica um email ou número de telefone.',
            'email.required' => 'Indica um email para receber campanhas e novidades.',
            'email.email' => 'Indica um endereço de email válido.',
            'phone.required_without' => 'Indica um email ou número de telefone.',
            'privacy_accepted.accepted' => 'É necessário aceitar a Política de Privacidade.',
            'terms_accepted.accepted' => 'É necessário aceitar os Termos e Condições.',
            'park.in' => 'Escolhe um parque válido.',
            'child_name.required' => 'Indica o nome da criança.',
            'child_age.between' => 'Indica uma idade válida.',
            'party_date.after_or_equal' => 'O dia da festa não pode estar no passado.',
            'party_date.before_or_equal' => 'O dia da festa ultrapassa o período disponível para reservas.',
            'party_time.in' => 'Escolhe um horário válido.',
            'guests.between' => 'O número de convidados deve estar entre 10 e 100.',
            'program.in' => 'Escolhe um programa válido.',
            'website.max' => 'Não foi possível enviar o pedido.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'contact_name' => $this->string('contact_name')->trim()->toString(),
            'email' => Str::lower($this->string('email')->trim()->toString()),
            'phone' => $this->string('phone')->trim()->toString(),
            'child_name' => $this->string('child_name')->trim()->toString(),
        ]);
    }
}
