<?php

namespace App\Http\Requests;

use App\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AcceptCustomerLegalConsentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Customer;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'privacy_accepted' => ['required', 'accepted'],
            'terms_accepted' => ['required', 'accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'privacy_accepted.required' => 'É necessário aceitar a Política de Privacidade.',
            'privacy_accepted.accepted' => 'É necessário aceitar a Política de Privacidade.',
            'terms_accepted.required' => 'É necessário aceitar os Termos e Condições.',
            'terms_accepted.accepted' => 'É necessário aceitar os Termos e Condições.',
        ];
    }
}
