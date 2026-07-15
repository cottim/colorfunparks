import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { CalendarDaysIcon } from 'lucide-react';
import { CtaButton } from '@/components/ui/cta-button';
import { Separator } from '@/components/ui/separator';

export function BookParty() {
    return (
        <Sheet>
            <SheetTrigger>
                <CtaButton attention="shine">
                    <CalendarDaysIcon />
                    Agendar Festa
                </CtaButton>
            </SheetTrigger>
            <SheetContent className="px-2 bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <SheetHeader className="">
                    <SheetTitle className="text-gray-900">
                        Marcar Festa
                    </SheetTitle>
                    <SheetDescription className="text-gray-900">
                        Por favor preencha os dados da sua festa o melhor que
                        souber
                    </SheetDescription>
                </SheetHeader>
                <Separator></Separator>
            </SheetContent>
        </Sheet>
    );
}
