import { MouseEvent, useEffect, useRef, useState } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Legend,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  annotationPlugin,
);

interface LinearPlotData {
  x: number;
  y: number | null;
}

interface TimeSeriesPlotData {
  x: Date;
  y: number | null;
}

interface LinearPlotOptions {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  title?: string;
  xlabel?: string;
  ylabel?: string;
  legend?: boolean;
  plugins?: ChartOptions<"line">["plugins"];
}

type TimeSeriesPlotOptions = Omit<
  LinearPlotOptions,
  "xMin" | "xMax" | "xlabel"
> & {
  tMin: Date;
  tMax: Date;
  tlabel?: string;
};

interface LinearPlotProps {
  chartData: Omit<ChartData<"line">, "datasets"> & {
    datasets: Omit<ChartData<"line">["datasets"][number], "data"> &
      {
        data: LinearPlotData[];
      }[];
  };
  chartOptions: LinearPlotOptions;
}

interface TimeSeriesPlotProps {
  chartData: Omit<ChartData<"line">, "datasets"> & {
    datasets: Omit<ChartData<"line">["datasets"][number], "data"> &
      {
        data: TimeSeriesPlotData[];
      }[];
  };
  chartOptions: TimeSeriesPlotOptions;
}

function getLinearPlotOptions(options: LinearPlotOptions) {
  return {
    type: "line",
    responsive: true,
    scales: {
      x: {
        type: "linear" as const,
        min: options.xMin,
        max: options.xMax,
        title: {
          display: true,
          text: options.xlabel,
          color: "#4A5568", // Gray-700
        },
      },
      y: {
        type: "linear" as const,
        min: options.yMin,
        max: options.yMax,
        title: {
          display: true,
          text: options.ylabel,
          color: "#4A5568", // Gray-700
        },
      },
    },
    plugins: options.plugins,
  };
}

function getTimeSeriesPlotOptions(options: TimeSeriesPlotOptions) {
  return {
    type: "line",
    responsive: true,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month" as const,
          displayFormats: {
            month: "MMM yyyy",
          },
        },
        min: options.tMin.toISOString(),
        max: options.tMax.toISOString(),
        title: {
          display: true,
          text: options.tlabel ?? "Date",
          color: "#4A5568", // Gray-700
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: options.ylabel,
          color: "#4A5568", // Gray-700
        },
        min: options.yMin,
        max: options.yMax,
      },
    },
    plugins: options.plugins,
  };
}

function YearSelector({
  year,
  setYear,
  defaultYear,
}: {
  year: number | null;
  setYear: (_year: number) => void;
  defaultYear?: number;
}) {
  const years = Array.from(
    { length: 10 },
    (_, i) =>
      new Date(defaultYear ?? new Date().getFullYear()).getFullYear() - i,
  );
  return (
    <div className="mb-4">
      <label htmlFor="year" className="block text-sm font-medium text-gray-700">
        Select Year:
      </label>
      <select
        id="year"
        value={year ?? ""}
        onChange={(e) => {
          setYear(e.target.value ? parseInt(e.target.value, 10) : 2021);
        }}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

export function LinearPlot({ chartData, chartOptions }: LinearPlotProps) {
  const chartRef =
    useRef<ChartJSOrUndefined<"line", LinearPlotData[]>>(undefined);
  const options = getLinearPlotOptions(chartOptions);

  return (
    <div className="max-w-4xl p-4 overflow-x-auto bg-neutral-100 rounded-lg shadow-md border border-gray-200 flex-col justify-center mx-auto">
      {chartOptions.title ? (
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {chartOptions.title}
        </h2>
      ) : null}
      <div className="w-full min-w-[600px] h-[800px] md:h-[500px]">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            aspectRatio: 1,
            ...options,
          }}
          ref={chartRef}
        />
      </div>
    </div>
  );
}

export function TimeSeriesPlot({
  chartData,
  chartOptions,
}: TimeSeriesPlotProps) {
  const chartRef =
    useRef<ChartJSOrUndefined<"line", TimeSeriesPlotData[]>>(undefined);
  const options = getTimeSeriesPlotOptions(chartOptions);

  return (
    <div className="max-w-4xl p-4 overflow-x-auto bg-neutral-100 rounded-lg shadow-md border border-gray-200 flex-col justify-center mx-auto">
      {chartOptions.title ? (
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {chartOptions.title}
        </h2>
      ) : null}
      <div className="w-full min-w-[600px] h-[800px] md:h-[500px]">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            aspectRatio: 1,
            ...options,
          }}
          ref={chartRef}
        />
      </div>
    </div>
  );
}
