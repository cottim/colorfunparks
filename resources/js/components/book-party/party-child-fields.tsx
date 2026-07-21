import type {
    PartyChild,
    PartyChildField,
} from '@/components/book-party/types';
import { Button } from '@/components/ui/button';

type PartyChildFieldsProps = {
    child: PartyChild;
    canRemove: boolean;
    onChange: (childId: string, key: PartyChildField, value: string) => void;
    onRemove: (childId: string) => void;
};

export function PartyChildFields({
    child,
    canRemove,
    onChange,
    onRemove,
}: PartyChildFieldsProps) {
    return (
        <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
                Nome da criança
                <input
                    value={child.name}
                    onChange={(event) =>
                        onChange(child.id, 'name', event.target.value)
                    }
                    className="rounded-md border p-2"
                />
            </label>

            <label className="flex flex-col gap-2">
                Data de nascimento
                <input
                    type="date"
                    value={child.birthDate}
                    onChange={(event) =>
                        onChange(child.id, 'birthDate', event.target.value)
                    }
                    className="rounded-md border p-2"
                />
            </label>

            {canRemove && (
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="self-start"
                    onClick={() => onRemove(child.id)}
                >
                    Remover criança
                </Button>
            )}
        </div>
    );
}
