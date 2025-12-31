"use client";

import { cn } from "@/lib/utils";
import { Field, ErrorMessage, FieldProps } from "formik";
import { InputHTMLAttributes } from "react";

// Extendemos de props nativos de HTML para que acepte value, onChange, disabled, etc.
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  // Opcional: para permitir clases extra desde fuera
  containerClassName?: string; 
}

export function TextInput({
  name,
  label,
  className,
  containerClassName,
  ...props // Aquí vienen value, onChange, type, placeholder, etc.
}: TextInputProps) {

  // Estilos base para reutilizarlos en ambos casos
  const baseInputStyles = cn(
    "w-full rounded-xl px-4 py-3 text-sm text-neutral-900 bg-neutral-50 border border-neutral-200 placeholder:text-neutral-400 outline-none transition-all duration-200 focus:bg-white focus:border-neutral-300 focus:ring-2 focus:ring-blue-500/30",
    className
  );

  // Lógica: Si nos pasan un 'value' o 'onChange' explícito, asumimos que NO es Formik
  // o que queremos controlar el input manualmente.
  const isControlled = props.value !== undefined || props.onChange !== undefined;

  return (
    <div className={cn("w-full space-y-1.5", containerClassName)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div className="relative">
        {isControlled ? (
          /* MODO STANDALONE (React State normal) */
          <input
            id={name}
            name={name}
            className={baseInputStyles}
            {...props}
          />
        ) : (
          /* MODO FORMIK (Automático) */
          <Field name={name}>
            {({ field }: FieldProps) => (
              <input
                {...field}
                {...props}
                id={name}
                className={baseInputStyles}
              />
            )}
          </Field>
        )}
      </div>

      {/* Error Message solo se muestra si estamos en contexto Formik y no es controlado manualmente */}
      {!isControlled && (
        <ErrorMessage name={name}>
          {(err) => <p className="text-sm text-red-500 pt-0.5">{err}</p>}
        </ErrorMessage>
      )}
    </div>
  );
}