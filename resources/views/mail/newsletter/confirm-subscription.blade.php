<x-mail::message>
# Confirma a tua inscrição

Recebemos um pedido para receber novidades, campanhas e atividades da Color Fun Parks.

<x-mail::button :url="$confirmationUrl">
Confirmar inscrição
</x-mail::button>

Se não fizeste este pedido, podes ignorar este email. O link expira dentro de {{ $expirationMinutes }} minutos.

Até breve,<br>
{{ config('app.name') }}
</x-mail::message>
