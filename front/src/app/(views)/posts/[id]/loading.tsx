import { MobileHeader } from "@/shared/components/MobileHeader";
import { routes } from "@/app/routes";

export default function Loading() {
  return (
    <div className="h-full w-full bg-[#f8f8f9]">
      {/* Header Skeleton */}
      <MobileHeader
        title="Cargando..."
        subtitle=""
        showBackButton={true}
        backUrl={routes.home}
      />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden animate-pulse">
          <div className="p-6 border-b border-neutral-100">
            {/* Meta tags skeleton */}
            <div className="flex gap-3 mb-4">
              <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
            </div>
            {/* Title skeleton */}
            <div className="h-10 w-3/4 bg-slate-200 rounded-lg mb-2"></div>
            <div className="h-10 w-1/2 bg-slate-200 rounded-lg"></div>
          </div>

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-64 bg-slate-200 rounded-xl w-full mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
