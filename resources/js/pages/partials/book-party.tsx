import { Form } from '@inertiajs/react';
import { CalendarDaysIcon, FerrisWheelIcon } from 'lucide-react';
import { CtaButton } from '@/components/ui/cta-button';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export function BookParty() {

    return (
        <Sheet>
            <SheetTrigger>
                <CtaButton attention="shine">
                    <CalendarDaysIcon />
                    Agendar Festa
                </CtaButton>
            </SheetTrigger>
            <SheetContent className="bg-linear-to-b from-[#FFFE00] to-[#FFCD00] p-4 text-gray-900">
                <SheetHeader className="p-2">
                    <SheetTitle className="text-gray-900">
                        Marcar Festa
                    </SheetTitle>
                    <SheetDescription className="text-gray-900">
                        Por favor preencha os dados da sua festa de acordo com o
                        que pretende.
                    </SheetDescription>
                </SheetHeader>
                <Separator></Separator>
                <div className="flex w-full max-w-sm flex-col gap-8 px-2 py-8">
                    <Form method="post">
                        <Marker className="text-gray-900" role="radiogroup">
                            <MarkerIcon>
                                <FerrisWheelIcon />
                            </MarkerIcon>
                            <MarkerContent className="text-xl">
                                Escolha o Parque
                            </MarkerContent>
                        </Marker>
                        <div className="mx-auto flex w-full items-center justify-center gap-6 py-4">
                            <RadioGroup className="flex w-full gap-4">
                                <Field>
                                    <RadioGroupItem
                                        value="color-party"
                                        id="color-party"
                                        className="hidden"
                                    />
                                    <FieldContent>
                                        <FieldLabel
                                            className="cursor-pointer opacity-80 hover:opacity-100"
                                            htmlFor="color-party"
                                        >
                                            <img
                                                src="/img/CFP-color-party-logo.svg"
                                                alt="Color Party - Escolha este parque"
                                                className="w-42"
                                            />
                                        </FieldLabel>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <RadioGroupItem
                                        value="yupi-color"
                                        id="yupi-color"
                                        className="hidden"
                                    />
                                    <FieldContent>
                                        <FieldLabel
                                            className="cursor-pointer opacity-80 hover:opacity-100"
                                            htmlFor="yupi-color"
                                        >
                                            <img
                                                src="/img/CFP-yupi-color-logo.svg"
                                                alt="Yupi Color - Escolha este parque"
                                                className="w-42"
                                            />
                                        </FieldLabel>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <RadioGroupItem
                                        value="kiddy-color"
                                        id="kiddy-color"
                                        className="hidden"
                                    />
                                    <FieldContent>
                                        <FieldLabel
                                            className="cursor-pointer opacity-80 hover:opacity-100"
                                            htmlFor="kiddy-color"
                                        >
                                            <img
                                                src="/img/CFP-kiddy-color-logo.svg"
                                                alt="Kiddy Color - Escolha este parque"
                                                className="w-42"
                                            />
                                        </FieldLabel>
                                    </FieldContent>
                                </Field>
                            </RadioGroup>
                        </div>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
