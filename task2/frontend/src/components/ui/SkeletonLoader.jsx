const SkeletonCard = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-100 dark:border-slate-700 animate-pulse">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-700"></div>
            <div className="p-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
        </div>
    );
};

export const SkeletonGrid = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export const SkeletonDetails = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image skeleton */}
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-200 dark:bg-slate-700"></div>
                
                {/* Info skeleton */}
                <div className="space-y-6">
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
