<x-mail::message>
# Confirma a tua inscrição

Recebemos um pedido para receber novidades, campanhas e atividades da Color Fun Parks.

<x-mail::button :url="$confirmationUrl">
Confirmar inscrição
</x-mail::button>

Se não fizeste este pedido, podes [cancelar este pedido]({{ $unsubscribeUrl }}). O link de confirmação expira dentro de {{ $expirationMinutes }} minutos.

Até breve,<br>
{{ config('app.name') }}
</x-mail::message>
