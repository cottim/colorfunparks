<x-mail::message>
# Convite para a equipa

Foi convidado para integrar a área interna da Color Fun Parks como
**{{ $invitation->role->label() }}**.

<x-mail::button :url="$acceptUrl">
Aceitar convite
</x-mail::button>

Este convite é pessoal, só pode ser utilizado uma vez e expira em
{{ config('staff_invitations.expires_after_hours') }} horas.

Até já,<br>
Color Fun Parks
</x-mail::message>
