import CheckboxIcon from "@icons/checkbox.svg?react";
import CheckboxCheckedIcon from "@icons/checkbox-checked.svg?react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group"
    >
      {checked ? (
        <CheckboxCheckedIcon width={20} height={20} />
      ) : (
        <CheckboxIcon width={20} height={20} />
      )}
      {label && (
        <span className="text-[#9C9C9C] text-sm select-none">{label}</span>
      )}
    </button>
  );
}
