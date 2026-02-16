import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "~/lib/cn";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  endAction?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, error, icon, endAction, ...inputProps }, ref) {
    return (
      <div>
        {label && (
          <label className="block text-[#232323] text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            {...inputProps}
            className={cn(
              "w-full h-[54px] rounded-xl border bg-white text-[#232323] text-sm placeholder:text-[#9C9C9C] outline-none transition-colors",
              icon ? "pl-12" : "pl-4",
              endAction ? "pr-12" : "pr-4",
              error
                ? "border-red-400 focus:border-red-500"
                : "border-[#EDEDED] focus:border-[#242EDB]"
            )}
          />
          {endAction && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {endAction}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>
        )}
      </div>
    );
  },
);
