import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        `
        relative overflow-hidden
        rounded-xl
        px-6 py-3
        text-sm font-medium
        text-neutral-50
        bg-neutral-900
        border border-neutral-200
        transition-all duration-300 ease-out
        hover:shadow-md
        hover:bg-neutral-700
        cursor-pointer
        `,
        className
      )}
    >
      {/* Borde energético */}
      <span
        className="
          pointer-events-none
          absolute inset-0
          rounded-xl
          opacity-0
          transition-opacity duration-300
          hover:opacity-100
          ring-1 ring-transparent
          bg-linear-to-r from-sky-300 via-violet-300 to-amber-300
          cursor-pointer
        "
      />

      {/* Overlay de color */}
      <span
        className="
          pointer-events-none
          absolute inset-0
          opacity-0
          transition-opacity duration-300
          hover:opacity-100
          bg-linear-to-r
          from-sky-100
          via-pink-100
          to-amber-100
          cursor-pointer
        "
      />

      <span className="relative z-10 flex items-center gap-1">{children}</span>
    </button>
  );
}


export function ButtonGhost({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        `
        relative overflow-hidden
        rounded-xl
        px-6 py-3
        text-sm font-medium
        text-neutral-900
        bg-neutral-50
        border border-neutral-200
        transition-all duration-300 ease-out
        hover:shadow-md
        hover:bg-neutral-100
        cursor-pointer
        `,
        className
      )}
    >

      <span className="relative z-10 flex items-center gap-1 justify-center">{children}</span>
    </button>
  );
}
