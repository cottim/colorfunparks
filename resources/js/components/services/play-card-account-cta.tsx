import { Link, usePage } from '@inertiajs/react';
import { GiftIcon, UserPlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import { edit as accountPreferences } from '@/routes/account/preferences';

type PlayCardAccountCtaProps = {
    appearance?: 'compact' | 'panel';
    className?: string;
};

export function PlayCardAccountCta({
    appearance = 'panel',
    className,
}: PlayCardAccountCtaProps) {
    const user = usePage().props.auth.user;
    const isCustomer = user?.role === 'customer';

    if (user && !isCustomer) {
        return null;
    }

    const href = isCustomer ? accountPreferences() : login();
    const buttonLabel = isCustomer
        ? 'Ver o meu cartão'
        : 'Criar conta gratuita';

    if (appearance === 'compact') {
        return (
            <div
                className={cn(
                    'grid gap-3 border-t border-black/10 pt-4',
                    className,
                )}
            >
                <p className="text-xs leading-5 text-gray-600">
                    O cartão é gratuito e fica automaticamente disponível quando
                    crias a tua conta.
                </p>
                <Button
                    asChild
                    className="w-full rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                >
                    <Link href={href}>
                        {!isCustomer && <UserPlusIcon aria-hidden="true" />}
                        {buttonLabel}
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <aside
            className={cn(
                'mx-auto grid w-full max-w-5xl gap-5 px-4 sm:px-6 lg:px-8',
                className,
            )}
            aria-label="Acesso ao Cartão da Brincadeira"
        >
            <div className="grid gap-5 rounded-3xl border border-purple-200 bg-white/85 p-6 shadow-lg sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    <GiftIcon aria-hidden="true" />
                </span>
                <div>
                    <h2 className="text-xl font-black">
                        O Cartão da Brincadeira é gratuito
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        {isCustomer
                            ? 'Já tens acesso ao cartão através da tua conta. Consulta o estado e as vantagens disponíveis.'
                            : 'Cria uma conta sem custos e o cartão fica automaticamente desbloqueado, com 30 dias de benefícios incluídos.'}
                    </p>
                </div>
                <Button
                    asChild
                    className="rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                >
                    <Link href={href}>
                        {!isCustomer && <UserPlusIcon aria-hidden="true" />}
                        {buttonLabel}
                    </Link>
                </Button>
            </div>
        </aside>
    );
}
