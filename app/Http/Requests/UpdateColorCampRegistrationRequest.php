<?php

namespace App\Http\Requests;

use App\ColorCampRegistrationStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateColorCampRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccessManagement() ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::enum(ColorCampRegistrationStatus::class),
            ],
        ];
    }
}
