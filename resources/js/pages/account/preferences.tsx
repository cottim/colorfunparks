import { Head } from '@inertiajs/react';
import { MailCheckIcon } from 'lucide-react';
import { SectionPlaceholder } from '@/pages/account/section-placeholder';

export default function CustomerPreferences() {
    return (
        <>
            <Head title="Preferências" />
            <SectionPlaceholder
                eyebrow="Área de cliente"
                title="Preferências"
                description="Aqui vais poder gerir as tuas preferências de comunicação e marketing."
                icon={MailCheckIcon}
            />
        </>
    );
}
