"use client";

import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  name?: string;
  label?: string;
  placeholder?: string;
}

export function PasswordInput({
  name = "password",
  label = "Contraseña",
  placeholder = "contraseña",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label htmlFor={name} className="relative block">
      <p className="font-medium text-slate-700 pb-1 mt-4">{label}</p>
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="w-full py-3 mb-1 border border-zinc-500 rounded-lg px-3 pr-10 transition hover:outline-1 hover:outline-gray-600 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-800 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <ErrorMessage name={name}>
        {(err) => <div className="text-sm text-red-500">{err}</div>}
      </ErrorMessage>
    </label>
  );
}
