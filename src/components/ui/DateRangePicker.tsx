import { RiCalendar2Fill, RiSubtractFill } from "@remixicon/react";
import { Time } from "@internationalized/date";
import { enUS, Locale } from "date-fns/locale";
import React from "react";
import * as PopoverPrimitives from "@radix-ui/react-popover";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar as CalendarPrimitive } from "~/components/ui/Calendar";
import {
  useDateSegment,
  useTimeField,
  type AriaTimeFieldProps,
  type TimeValue,
} from "@react-aria/datepicker";
import {
  useTimeFieldState,
  type DateFieldState,
  type DateSegment,
} from "@react-stately/datepicker";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRef, useState } from "react";
import { DateRange, Matcher } from "react-day-picker";
type DateRangePickerProps = {
  date: DateRange | undefined;
  onDateChange: (date: DateRange) => void;
  locale?: Locale;
  className?: string;
  disableButton?: boolean;
  disabled?: boolean;
  disabledDates?: Date[];
  disabledCalendar?: Matcher | Matcher[];
  minDate?: Date;
  maxDate?: Date;
};

export function DateRangePicker({
  date,
  onDateChange,
  locale = enUS,
  className,
  disableButton,
  disabledCalendar,
  disabledDates,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formatDisplayDate = (date: DateRange | undefined) => {
    if (!date) return "Select a date range";
    if (date.from && date.to) {
      return `${format(date.from, "PP", { locale })} - ${format(date.to, "PP", { locale })}`;
    }
    if (date.from) {
      return `${format(date.from, "PP", { locale })} - ...`;
    }
    return "Select a date range";
  };

  return (
    <PopoverPrimitives.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitives.Trigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-dawn-pink-200 dark:bg-slate-800",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disableButton}
        >
          <RiCalendar2Fill className="mr-2 h-4 w-4" />
          <span>{formatDisplayDate(date)}</span>
        </Button>
      </PopoverPrimitives.Trigger>
      <PopoverPrimitives.Content
        className="w-auto p-0 bg-dawn-pink-200 dark:bg-slate-800 border rounded-md shadow-md z-50"
        align="start"
      >
        <CalendarPrimitive
          mode="range"
          selected={date}
          onSelect={onDateChange}
          locale={locale}
          disabled={disabledDates}
          disabledDates={disabledCalendar}
          startMonth={minDate}
          endMonth={maxDate}
          numberOfMonths={1}
          defaultMonth={date?.to || new Date()}
          enableYearNavigation
        />
      </PopoverPrimitives.Content>
    </PopoverPrimitives.Root>
  );
}
