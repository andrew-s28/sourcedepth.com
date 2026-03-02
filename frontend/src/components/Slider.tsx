import { useState } from "react";

import { Slider } from "radix-ui";

import { cn } from "~/utils/utils";

export const SliderWithValue = ({
  min,
  max,
  step,
  defaultValue,
  label,
  onChange,
  className,
}: {
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  label?: string;
  onChange?: (value: number) => void;
  className?: string;
}) => {
  const [value, setValue] = useState(defaultValue || (min + max) / 2);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Slider.Root
        className="relative flex w-full touch-none items-center h-10"
        min={min}
        max={max}
        defaultValue={[value]}
        step={step || 0}
        onValueChange={(newValue) => {
          setValue(newValue[0]);
          if (onChange) {
            onChange(newValue[0]);
          }
        }}
      >
        <Slider.Track className="bg-night-sky-300 dark:bg-dawn-pink-300 relative grow rounded-full h-2 ">
          <Slider.Range className="absolute bg-night-sky-700 dark:bg-dawn-pink-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-night-sky-900 dark:bg-dawn-pink-700 rounded-full hover:size-6 transition-all duration-200 ease-in-out focus:border-2 focus:ring-2 focus:ring-night-sky-500 dark:focus:ring-dawn-pink-400" />
      </Slider.Root>
      <span className="text-sm">
        {label}: {value}
      </span>
    </div>
  );
};
