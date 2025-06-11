import * as React from "react";
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { addYears, format } from "date-fns";
import {
  DayPicker,
  useDayPicker,
  type PropsRange,
  type PropsSingle,
  type DayProps,
  type Matcher,
  PropsBase,
} from "react-day-picker";

import { cn } from "@/lib/utils";

interface NavigationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  icon: React.ElementType;
  disabled?: boolean;
}

const NavigationButton = React.forwardRef<
  HTMLButtonElement,
  NavigationButtonProps
>(
  (
    { onClick, icon, disabled, ...props }: NavigationButtonProps,
    forwardedRef
  ) => {
    const Icon = icon;
    return (
      <button
        ref={forwardedRef}
        type="button"
        disabled={disabled}
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-sm border p-1 outline-hidden transition sm:size-[30px] cursor-pointer",
          // text color
          "text-gray-600 hover:text-gray-800",
          "dark:text-gray-400 dark:hover:text-gray-200",
          // border color
          "border-gray-300 dark:border-gray-800",
          // background color
          "bg-dawn-pink-100 hover:bg-dawn-pink-200 active:bg-dawn-pink-200",
          "dark:bg-slate-800 dark:hover:bg-gray-900 dark:active:bg-gray-800",
          // disabled
          "disabled:pointer-events-none",
          "disabled:border-gray-200 dark:disabled:border-gray-800",
          "disabled:text-gray-400 dark:disabled:text-gray-600",
          // base
          "outline-offset-2 outline-0 focus-visible:outline-2",
          // outline color
          "outline-blue-500 dark:outline-blue-500"
        )}
        onClick={onClick}
        {...props}
      >
        <Icon className="size-full shrink-0" />
      </button>
    );
  }
);

NavigationButton.displayName = "NavigationButton";

type OmitKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

type KeysToOmit = "showWeekNumber" | "captionLayout" | "mode";

type BaseProps = OmitKeys<PropsBase, KeysToOmit>;

type CalendarProps =
  | ({
      mode: "single";
    } & PropsSingle)
  | ({
      mode?: undefined;
    } & PropsSingle)
  | ({
      mode: "range";
    } & PropsRange);

const Calendar = ({
  mode = "single",
  weekStartsOn = 0,
  numberOfMonths = 1,
  enableYearNavigation = false,
  disableNavigation,
  disabledDates,
  className,
  classNames,
  startMonth,
  endMonth,
  ...props
}: CalendarProps &
  BaseProps & {
    enableYearNavigation?: boolean;
    disabledDates?: Matcher | Matcher[];
  }) => {
  return (
    <DayPicker
      mode={mode}
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      showOutsideDays={numberOfMonths === 1}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn(className)}
      disabled={{ before: new Date() }}
      classNames={{
        months: "flex space-y-0",
        month: "space-y-4 p-3",
        nav: "gap-1 flex items-center rounded-full size-full justify-between p-4",
        table: "w-full border-collapse space-y-1",
        head_cell:
          "w-9 font-medium text-sm sm:text-xs text-center text-gray-400 dark:text-gray-600 pb-2",
        row: "w-full mt-0.5",
        cell: cn(
          "relative p-0 text-center focus-within:relative",
          "text-gray-900 dark:text-gray-50"
        ),
        day: cn(
          "size-9 rounded-sm text-sm focus:z-10",
          "text-gray-900 dark:text-gray-50",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          // base
          "outline-offset-2 outline-0 focus-visible:outline-2",
          // outline color
          "outline-blue-500 dark:outline-blue-500"
        ),
        today: cn(
          "bg-gray-200 dark:bg-gray-700",
          "text-gray-900 dark:text-gray-50",
          "hover:bg-gray-200 dark:hover:bg-gray-700"
        ),
        day_button: cn(
          "flex items-center justify-center h-full w-full",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-gray-950"
        ),
        selected: cn(
          "rounded-sm",
          "bg-blue-500 text-white",
          "dark:bg-blue-500 dark:text-white"
        ),
        disabled:
          "text-gray-300 dark:text-gray-700 line-through disabled:hover:bg-transparent",
        outside: "text-gray-400 dark:text-gray-600",
        hidden: "invisible",
        range_end:
          "bg-blue-100 text-gray-900 dark:bg-blue-500 dark:text-gray-50 rounded-l-none rounded-r-sm",
        range_start:
          "bg-blue-100 text-gray-900 dark:bg-blue-500 dark:text-gray-50 rounded-l-sm rounded-r-none",
        range_middle:
          "bg-gray-100 text-gray-900 dark:bg-gray-500 dark:text-gray-50 rounded-none",
        ...classNames,
      }}
      components={{
        PreviousMonthButton: () => <></>,
        NextMonthButton: () => <></>,
        Nav: () => <></>,
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <RiArrowLeftSLine aria-hidden="true" className="size-4" />;
          }
          return <RiArrowRightSLine aria-hidden="true" className="size-4" />;
        },
        MonthCaption: ({ displayIndex }) => {
          const {
            goToMonth,
            nextMonth,
            previousMonth,
            months,
            dayPickerProps,
          } = useDayPicker();
          const currentMonth = months[displayIndex].date;
          const isFirst = displayIndex === 0;
          const isLast = displayIndex === months.length - 1;
          const fromDate = dayPickerProps.startMonth?.getTime();
          const toDate = dayPickerProps.endMonth?.getTime();

          const hideNextButton = numberOfMonths > 1 && (isFirst || !isLast);
          const hidePreviousButton = numberOfMonths > 1 && (isLast || !isFirst);

          const goToPreviousYear = () => {
            const targetMonth = addYears(currentMonth, -1);
            if (!fromDate || targetMonth.getTime() >= fromDate) {
              goToMonth(targetMonth);
            }
          };

          const goToNextYear = () => {
            const targetMonth = addYears(currentMonth, 1);
            if (!toDate || targetMonth.getTime() <= toDate) {
              goToMonth(targetMonth);
            }
          };

          return (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {enableYearNavigation && !hidePreviousButton && (
                  <NavigationButton
                    disabled={
                      disableNavigation ||
                      !previousMonth ||
                      ((fromDate &&
                        addYears(currentMonth, -1).getTime() <
                          fromDate) as boolean)
                    }
                    aria-label="Go to previous year"
                    onClick={goToPreviousYear}
                    icon={RiArrowLeftDoubleLine}
                  />
                )}
                {!hidePreviousButton && (
                  <NavigationButton
                    disabled={disableNavigation || !previousMonth}
                    aria-label="Go to previous month"
                    onClick={() => {
                      if (previousMonth) goToMonth(previousMonth);
                    }}
                    icon={RiArrowLeftSLine}
                  />
                )}
              </div>

              <div
                role="presentation"
                aria-live="polite"
                className="text-sm font-medium capitalize tabular-nums text-gray-900 dark:text-gray-50"
              >
                {format(currentMonth, "LLLL yyy")}
              </div>

              <div className="flex items-center gap-1">
                {!hideNextButton && (
                  <NavigationButton
                    disabled={disableNavigation || !nextMonth}
                    aria-label="Go to next month"
                    onClick={() => {
                      if (nextMonth) goToMonth(nextMonth);
                    }}
                    icon={RiArrowRightSLine}
                  />
                )}
                {enableYearNavigation && !hideNextButton && (
                  <NavigationButton
                    disabled={
                      disableNavigation ||
                      !nextMonth ||
                      ((toDate &&
                        addYears(currentMonth, 1).getTime() >
                          toDate) as boolean)
                    }
                    aria-label="Go to next year"
                    onClick={goToNextYear}
                    icon={RiArrowRightDoubleLine}
                  />
                )}
              </div>
            </div>
          );
        },
        Day: ({ modifiers, hidden, children, className }: DayProps) => {
          const ref = React.useRef<HTMLTableCellElement>(null);
          const { selected, today, disabled, range_middle } = modifiers;

          if (hidden) {
            return <></>;
          }
          return (
            <td ref={ref} className={cn("relative", className)}>
              {children}
              {today && (
                <span
                  className={cn(
                    "absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 -translate-x-1/2 rounded-[2px]",
                    {
                      "bg-blue-500 dark:bg-blue-500": !selected,
                      "bg-white dark:bg-gray-950": selected,
                      "bg-gray-400 dark:bg-gray-600": selected && range_middle,
                      "bg-gray-400 text-gray-400 dark:bg-gray-400 dark:text-gray-600":
                        disabled,
                    }
                  )}
                />
              )}
            </td>
          );
        },
        Footer: () => {
          return (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Reset
                </span>
              </div>
            </div>
          );
        },
      }}
      {...(props as PropsBase & CalendarProps)}
    />
  );
};

Calendar.displayName = "Calendar";

export { Calendar, type Matcher };
