<x-mail::message>
# Recebemos o teu pedido de festa

O pedido **{{ $partyBooking->reference() }}** chegou à Color Fun Parks.

<x-mail::panel>
**Data pretendida:** {{ $partyBooking->party_date->format('d/m/Y') }}  
**Hora pretendida:** {{ mb_substr($partyBooking->party_time, 0, 5) }}  
**Parque:** {{ $partyBooking->park }}  
**Programa:** {{ $partyBooking->program }}  
**Número de convidados:** {{ $partyBooking->guests }}
</x-mail::panel>

Este email confirma apenas a receção do pedido. A nossa equipa vai verificar a disponibilidade e enviar outra confirmação quando a festa estiver aprovada ou se for necessário ajustar algum detalhe.

@if ($loginUrl !== null)
Podes acompanhar o pedido através da tua área de cliente:

<x-mail::button :url="$loginUrl">
Entrar e acompanhar o pedido
</x-mail::button>

Este acesso é pessoal, só pode ser utilizado uma vez e expira dentro de {{ $loginLinkExpirationMinutes }} minutos.
@endif

Até breve,<br>
{{ config('app.name') }}
</x-mail::message>
