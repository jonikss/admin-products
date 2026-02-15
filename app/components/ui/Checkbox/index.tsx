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
      <img
        src={checked ? "/icons/checkbox-checked.svg" : "/icons/checkbox.svg"}
        alt=""
        width={20}
        height={20}
      />
      {label && (
        <span className="text-[#9C9C9C] text-sm select-none">{label}</span>
      )}
    </button>
  );
}
