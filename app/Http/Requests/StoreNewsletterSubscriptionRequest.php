<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreNewsletterSubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                Rule::email()->rfcCompliant(),
                'max:255',
            ],
            'privacy_consent' => ['required', 'accepted'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Indica o teu endereço de email.',
            'email.email' => 'Indica um endereço de email válido.',
            'privacy_consent.accepted' => 'É necessário aceitar a Política de Privacidade.',
            'privacy_consent.required' => 'É necessário aceitar a Política de Privacidade.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => Str::lower($this->string('email')->trim()),
        ]);
    }
}
