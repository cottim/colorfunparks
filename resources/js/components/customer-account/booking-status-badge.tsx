import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CustomerBookingStatus } from '@/types/customer-account';

export function CustomerBookingStatusBadge({
    status,
    children,
}: {
    status: CustomerBookingStatus;
    children: string;
}) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'rounded-full px-2.5 py-1',
                status === 'confirmed' &&
                    'border-emerald-200 bg-emerald-50 text-emerald-800',
                status === 'contacted' &&
                    'border-blue-200 bg-blue-50 text-blue-800',
                status === 'pending' &&
                    'border-amber-200 bg-amber-50 text-amber-800',
                status === 'cancelled' &&
                    'border-gray-200 bg-gray-50 text-gray-600',
            )}
        >
            {children}
        </Badge>
    );
}
