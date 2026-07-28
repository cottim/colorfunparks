<?php

namespace App\Http\Requests\Settings;

use App\Models\PendingEmailChange;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class RequestEmailChangeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        $pendingEmailChangeId = $user
            ?->pendingEmailChange()
            ->value('id');

        return [
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::notIn([$user?->email]),
                Rule::unique(User::class),
                Rule::unique(PendingEmailChange::class, 'email')
                    ->where(
                        fn ($query) => $query->where(
                            'expires_at',
                            '>',
                            now(),
                        ),
                    )
                    ->ignore($pendingEmailChangeId),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.not_in' => 'O novo email tem de ser diferente do atual.',
            'email.unique' => 'Este endereço de email não está disponível.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => Str::lower(trim($this->string('email')->toString())),
        ]);
    }
}
