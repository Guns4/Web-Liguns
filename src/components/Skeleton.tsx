// Skeleton Loading Components
// Reusable skeleton loaders for consistent UX

export function SkeletonCard() {
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-white/10 rounded-xl" />
            </div>
            <div className="h-8 w-20 bg-white/10 rounded mb-2" />
            <div className="h-4 w-32 bg-white/10 rounded" />
        </div>
    );
}

export function SkeletonTable({ rows = 5, columns = 6 }) {
    return (
        <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-6 py-4">
                                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-white/5">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
                <div className="flex-1">
                    <div className="h-6 w-40 bg-white/10 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                </div>
            </div>
            <div className="h-[300px] bg-white/5 rounded-xl animate-pulse" />
        </div>
    );
}

export function SkeletonText({ width = 'full' }) {
    const widthClass = width === 'full' ? 'w-full' : `w-${width}`;
    return <div className={`h-4 ${widthClass} bg-white/10 rounded animate-pulse`} />;
}

export function SkeletonAvatar({ size = 'md' }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    return (
        <div className={`${sizeClasses[size]} bg-white/10 rounded-full animate-pulse`} />
    );
}
