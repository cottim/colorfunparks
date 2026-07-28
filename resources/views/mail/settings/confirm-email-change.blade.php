<x-mail::message>
# Confirma o teu novo email

Recebemos um pedido para utilizar este endereço na conta Color Fun Parks.

<x-mail::button :url="$confirmationUrl">
Confirmar novo email
</x-mail::button>

O endereço atual só será substituído depois desta confirmação. O link é
descartável e expira dentro de {{ $expirationMinutes }} minutos.

Se não fizeste este pedido, ignora este email. A conta não será alterada.

Até breve,<br>
Color Fun Parks
</x-mail::message>
