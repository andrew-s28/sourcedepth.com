// TODO: Clean up code
// TODO: Add y-axis resizing?

import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
  XAxisProps,
  Legend,
  LegendProps,
  Symbols,
  Surface,
} from "recharts";
import { scaleTime } from "d3-scale";
import { utcFormat } from "d3";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";
import { Calendar } from "./Calendar";
import { setDate } from "date-fns";

const formatMillisecond = utcFormat(".%L"),
  formatMinute = utcFormat("%b %d %Y %H:%M"),
  formatHour = utcFormat("%b %d %Y %H:%M"),
  formatDay = utcFormat("%b %d %Y"),
  formatWeek = utcFormat("%b %d"),
  formatMonth = utcFormat("%b %Y"),
  formatYear = utcFormat("%b %Y");

function multiFormat(min: number, max: number) {
  // Calculate time difference in milliseconds
  const domainDiff = max - min;

  return function (date: number) {
    const d = new Date(date);

    // Choose format based on the visible range
    if (domainDiff < 1000 * 60 * 60) {
      // Less than 1 hour
      return formatMinute(d);
    } else if (domainDiff < 1000 * 60 * 60 * 24 * 5) {
      // Less than 3 days
      return formatHour(d);
    } else if (domainDiff < 1000 * 60 * 60 * 24 * 7) {
      // Less than 1 week
      return formatDay(d);
    } else if (domainDiff < 1000 * 60 * 60 * 24 * 30) {
      // Less than 1 month
      return formatDay(d);
    } else if (domainDiff < 1000 * 60 * 60 * 24 * 365) {
      // Less than 1 year
      return formatMonth(d);
    } else {
      return formatYear(d);
    }
  };
}

export function TimeSeriesPlot() {
  const data = [
    { date: "2023-10-01T00:00:00.000Z", uv: 400, pv: 2400, amt: 2400 },
    {
      date: "2023-12-01T00:00:00.000Z",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    { date: "2024-01-01T00:00:00.000Z", uv: 2000, amt: 2290 },
    { date: "2024-05-05T00:00:00.000Z", uv: 2780, pv: 3908, amt: 2000 },
    { date: "2025-01-01T00:00:00.000Z", uv: 1890, pv: 4800, amt: 2181 },
  ];

  const timeValues = data.map((row) => row.date);
  const numericValues = timeValues.map((time) => Date.parse(time) || 0);
  const dataParsed = data.map((row) => ({
    ...row,
    date: Date.parse(row.date) || 0, // Convert date strings to Date objects
  })); // Convert date strings to Date objects
  const minDate = new Date(Math.min(...numericValues));
  const maxDate = new Date(Math.max(...numericValues));
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: minDate,
    to: maxDate,
  });
  const timeScale = scaleTime().domain([
    dateRange.from.getTime(),
    dateRange.to.getTime(),
  ]);
  const xAxisArgs: XAxisProps = {
    domain: timeScale.domain().map((date) => date.getTime()),
    scale: timeScale,
    type: "number",
    ticks: timeScale.ticks().map((date) => date.getTime()),
    tickFormatter: (date: number) => {
      return multiFormat(
        dateRange.from.getTime(),
        dateRange.to.getTime()
      )(date);
    },
  };
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active) {
      const d = new Date(label as string);
      const utcDate = utcFormat("%Y-%m-%d")(d);
      return (
        <div className="custom-tooltip bg-dawn-pink-200 dark:bg-slate-800 p-3 rounded-md">
          <p className="intro">{utcDate}</p>
          {payload?.map((entry, i) => (
            <p
              key={`item-${String(i)}`}
              className="label"
              style={{ color: entry.color }}
            >
              {`${String(entry.name)} : ${String(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const renderLegend = ({ payload }: LegendProps) => {
    return (
      <div className="flex gap-x-2 justify-center items-center">
        {payload?.map((entry) => {
          return (
            <div
              key={`item-${String(entry.value)}`}
              className="flex items-center"
            >
              <Surface
                width={28}
                height={28}
                viewBox={{ x: 0, y: 0, width: 28, height: 28 }}
              >
                <Symbols
                  cx={14}
                  cy={14}
                  className="stroke-black dark:stroke-white fill-none"
                  // size={14}
                  type="circle"
                />
              </Surface>
              <span className="text-black dark:text-white">{entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataParsed}
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <Line
              type="monotone"
              dataKey="uv"
              className="stroke-black dark:stroke-white"
              stroke=""
            />
            <Line
              type="monotone"
              dataKey="pv"
              className="stroke-black dark:stroke-white"
              stroke=""
            />
            <Line
              type="monotone"
              dataKey="amt"
              className="stroke-black dark:stroke-white"
              stroke=""
            />
            <CartesianGrid
              stroke="#ffffff"
              className="stroke-black dark:stroke-white"
              vertical={false}
            />
            <Tooltip
              labelClassName="text-black"
              content={CustomTooltip}
              allowEscapeViewBox={{ x: false, y: false }}
            />
            <XAxis
              dataKey="date"
              padding={{ left: 20, right: 20 }}
              allowDataOverflow
              {...xAxisArgs}
            />
            <YAxis />
            <Legend content={renderLegend} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-5 z-50 justify-center items-center">
        <div>
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            disabledCalendar={{ before: minDate, after: maxDate }}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </div>
    </>
  );
}
