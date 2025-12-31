"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Field, ErrorMessage } from "formik";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function PasswordInput({
  label,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-700">{label}</label>
      )}

      <div className="relative">
        <Field
          type={visible ? "text" : "password"}
          className={cn(
            `
            w-full
            rounded-xl
            px-4 py-3
            pr-12
            text-sm text-neutral-900
            bg-neutral-50
            border border-neutral-200
            placeholder:text-neutral-400
            outline-none
            transition-all duration-200

            focus:bg-white
            focus:border-neutral-300
            focus:ring-2
            focus:ring-blue-500/30
            `,
            className
          )}
          {...props}
        />

        {/* Toggle visibility */}
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            flex items-center justify-center
            h-8 w-8
            rounded-md
            text-neutral-500
            hover:text-neutral-800
            hover:bg-neutral-100
            transition-colors
          "
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? (
            // Eye off
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-4.4M9.9 4.2A9.7 9.7 0 0112 4.5c5 0 9.3 3.1 11 7.5a12.7 12.7 0 01-2.5 4"
              />
            </svg>
          ) : (
            // Eye
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.5 12c1.7-4.4 6-7.5 9.5-7.5s7.8 3.1 9.5 7.5c-1.7 4.4-6 7.5-9.5 7.5S4.2 16.4 2.5 12z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      <ErrorMessage name={props.name as string}>
        {(err) => <p className="text-sm text-red-500 pt-0.5">{err}</p>}
      </ErrorMessage>
    </div>
  );
}
