// Empty State Components
// Reusable empty states for better UX

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Icon className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

export function EmptyTableState({
    icon: Icon,
    message = "Belum ada data",
    description = "Data akan muncul di sini setelah ada aktivitas"
}: {
    icon: LucideIcon;
    message?: string;
    description?: string;
}) {
    return (
        <div className="text-center py-12">
            <Icon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium mb-1">{message}</p>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    );
}
