import { Head } from '@inertiajs/react';
import { UserRoundIcon } from 'lucide-react';
import { SectionPlaceholder } from '@/pages/account/section-placeholder';

export default function CustomerProfile() {
    return (
        <>
            <Head title="Dados pessoais" />
            <SectionPlaceholder
                eyebrow="Área de cliente"
                title="Dados pessoais"
                description="Nesta área vais poder adicionar e atualizar o teu nome e os teus contactos."
                icon={UserRoundIcon}
            />
        </>
    );
}
