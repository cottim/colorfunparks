<x-mail::message>
# Entra na tua conta

Recebemos um pedido para entrar ou criar uma conta de cliente na Color Fun Parks.

<x-mail::button :url="$loginUrl">
Entrar na minha conta
</x-mail::button>

Este link só pode ser utilizado uma vez e expira dentro de {{ $expirationMinutes }} minutos.

Se não fizeste este pedido, podes ignorar este email.

Até breve,<br>
{{ config('app.name') }}
</x-mail::message>
