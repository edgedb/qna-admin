"use client";

interface SwitchButtonProps {
  disabled: boolean;
  onChange: () => Promise<void>;
}

const SwitchButton = ({ disabled, onChange }: SwitchButtonProps) => {
  return (
    <label className="relative inline-block w-8 h-5 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={!disabled}
        onChange={onChange}
        aria-label="Switch tag button"
      />
      <div className="block w-8 h-5 bg-placeholder rounded-full transition-colors ease-linear duration-300 peer-checked:bg-accentGreen"></div>
      <div className="absolute left-0.5 top-[3px] w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 ease-[cubic-bezier(0.3, 1.5, 0.7, 1)] peer-checked:translate-x-3.5"></div>
    </label>
  );
};

export default SwitchButton;
