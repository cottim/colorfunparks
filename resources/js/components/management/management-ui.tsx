import { Link } from '@inertiajs/react';
import { PartyPopperIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Pagination, Status } from '@/types/management';

export function ManagementPageHeader({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow: string;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
                <p className="text-sm font-semibold tracking-wide text-[#558b6e] uppercase">
                    {eyebrow}
                </p>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="max-w-3xl text-muted-foreground">{description}</p>
            </div>
            {action}
        </header>
    );
}

export function ManagementSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
            <div className="border-b px-4 py-5 sm:px-6">
                <h2 className="text-xl font-bold">{title}</h2>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </section>
    );
}

export function StatusBadge({ status }: { status: Status }) {
    return (
        <span
            className={cn(
                'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold',
                status.value === 'accepted' ||
                    status.value === 'confirmed' ||
                    status.value === 'admin'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                    : status.value === 'pending' ||
                        status.value === 'waitlisted'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      : status.value === 'staff' ||
                          status.value === 'contacted' ||
                          status.value === 'reviewing'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200'
                        : 'bg-muted text-muted-foreground',
            )}
        >
            {status.label}
        </span>
    );
}

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="grid justify-items-center gap-3 rounded-xl border border-dashed p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <PartyPopperIcon className="size-5" />
            </span>
            <p className="max-w-xl text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

export function PaginationNav<T>({
    pagination,
    label,
}: {
    pagination: Pagination<T>;
    label: string;
}) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label={label}
            className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5"
        >
            <p className="text-sm text-muted-foreground">
                {pagination.from}–{pagination.to} de {pagination.total}
            </p>
            <div className="flex flex-wrap gap-1">
                {pagination.links.map((link) => {
                    const labelText = paginationLabel(link.label);

                    if (!link.url) {
                        return (
                            <span
                                key={link.label}
                                aria-disabled="true"
                                className="inline-flex min-w-9 items-center justify-center rounded-md border px-3 py-2 text-sm text-muted-foreground opacity-50"
                            >
                                {labelText}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={link.label}
                            href={link.url}
                            preserveScroll
                            className={cn(
                                'inline-flex min-w-9 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none',
                                link.active &&
                                    'border-[#558b6e] bg-[#558b6e] text-white hover:bg-[#47775d]',
                            )}
                        >
                            {labelText}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('pt-PT').format(new Date(value));
}

export function formatPartyDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT').format(
        new Date(`${value}T00:00:00`),
    );
}

function paginationLabel(label: string): string {
    if (label.includes('Previous')) {
        return 'Anterior';
    }

    if (label.includes('Next')) {
        return 'Seguinte';
    }

    return label;
}
