import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { clamp } from "~/utils/utils";

import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { api } from "../utils/dataset-api";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  annotationPlugin
);

interface NitratePlotData {
  depth: string;
  data: { x: Date; y: number | null }[];
}

interface DepthPlotData {
  x: number | null;
  y: number | null;
}

const COLORS = [
  "rgba(191.34, 231.44, 173.77, 1.00)",
  "rgba(171.75, 225.02, 168.17, 1.00)",
  "rgba(150.33, 217.80, 164.52, 1.00)",
  "rgba(131.38, 210.54, 163.18, 1.00)",
  "rgba(115.35, 202.72, 163.22, 1.00)",
  "rgba(101.47, 193.43, 163.69, 1.00)",
  "rgba(92.09, 183.98, 163.82, 1.00)",
  "rgba(85.37, 174.34, 163.33, 1.00)",
  "rgba(80.71, 165.09, 162.24, 1.00)",
  "rgba(76.64, 154.99, 160.52, 1.00)",
  "rgba(73.35, 145.70, 158.58, 1.00)",
  "rgba(70.08, 135.93, 156.35, 1.00)",
  "rgba(67.24, 126.98, 154.31, 1.00)",
  "rgba(64.51, 117.14, 152.18, 1.00)",
  "rgba(62.68, 108.06, 150.35, 1.00)",
  "rgba(61.80, 97.93, 148.21, 1.00)",
  "rgba(62.30, 88.07, 145.30, 1.00)",
  "rgba(64.02, 77.37, 138.96, 1.00)",
  "rgba(65.04, 68.33, 128.70, 1.00)",
  "rgba(63.98, 60.08, 114.19, 1.00)",
  "rgba(60.85, 52.69, 98.39, 1.00)",
  "rgba(56.03, 45.42, 82.33, 1.00)",
  "rgba(50.87, 38.87, 68.42, 1.00)",
  "rgba(45.21, 32.26, 55.30, 1.00)",
  "rgba(39.81, 26.17, 44.04, 1.00)",
  "rgba(39.81, 26.17, 44.04, 1.00)",
];

function YearSelector({
  year,
  setYear,
}: {
  year: number | null;
  setYear: (_year: number) => void;
}) {
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date("2024-01-01").getFullYear() - i
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

export const NitratePlot = () => {
  // const chartRef = useRef<ChartJSOrUndefined<"line", { x: Date; y: number | null }[], unknown>>(null);
  const chartRef =
    useRef<ChartJSOrUndefined<"line", { x: Date; y: number | null }[]>>(
      undefined
    );
  const [year, setYear] = useState<number>(2021);
  const [data, setData] = useState<NitratePlotData[] | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [depthData, setDepthData] = useState<DepthPlotData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getNitrateData({ year: year });
        const data = Object.entries(result.data).map(([depth, values]) => {
          const dates = Object.keys(values);
          const nitrateConc = Object.values(values).map((value) => {
            return value === -9999 ? null : value;
          });
          const plotData = dates.map((date, index) => {
            return {
              x: new Date(date),
              y: nitrateConc[index],
            };
          });
          return {
            depth,
            data: plotData,
          };
        });
        setData(data);
        return data;
      } catch (error) {
        console.error("Error fetching nitrate data:", error);
      }
    };
    void fetchData().then((data) => {
      // Set the initial time to the first date of the first depth data
      if (data && data.length > 0 && data[0].data.length > 0) {
        setTime(data[0].data[0].x);
      } else {
        setTime(null);
      }
    });
  }, [year]);

  useEffect(() => {
    if (!data) return;
    if (!time) {
      setTime(data[0].data[0].x);
    }
    const depthData = data.map((singleDepthData) => {
      const depthPoints = singleDepthData.data.filter(
        (point) => point.x.getTime() === time?.getTime()
      );
      if (depthPoints.length > 0) {
        return {
          x: depthPoints[0].y,
          y: -parseFloat(singleDepthData.depth),
        };
      }
      return null;
    });
    // Filter out null values
    const filteredDepthData = depthData
      .filter((point) => point !== null)
      .sort((a, b) => (a.x ?? 0) - (b.x ?? 0));
    setDepthData(filteredDepthData);
  }, [time, data]);

  const chartData = {
    labels: data ? data[0].data.map((point) => point.x.toDateString()) : [],
    datasets: Object.entries(data || {}).map(([depth, values], index) => ({
      label: `Depth: ${depth} m`,
      data: values.data,
      borderColor: COLORS[index],
      backgroundColor: COLORS[index],
      // fill: false,
      // borderColor: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color for each depth
    })),
  };

  const depthChartData = {
    labels: depthData ? depthData.map((point) => point.x) : [],
    datasets: [
      {
        label: "Nitrate Concentration at Selected Depth",
        data: depthData
          ? depthData.map((point) => ({ x: point.x, y: point.y }))
          : [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
    ],
  };

  const options = {
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
        min: new Date(year, 3, 1).toISOString(),
        max: new Date(year, 9, 31).toISOString(),
        title: {
          display: true,
          text: "Date",
          color: "#4A5568", // Gray-700
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Nitrate Concentration (mg/L)",
          color: "#4A5568", // Gray-700
        },
        min: -5,
        max: 40,
      },
    },
    plugins: {
      annotation: {
        annotations: {
          verticalLine: {
            type: "line" as const,
            xMin: time ? time.toISOString() : new Date().toISOString(),
            xMax: time ? time.toISOString() : new Date().toISOString(),
            borderColor: "red",
            borderWidth: 2,
          },
          label1: {
            type: "label" as const,
            xValue: time ? time.toISOString() : new Date().toISOString(),
            yValue: 38,
            content: [
              `Selected Date: ${time ? time.toLocaleDateString() : "N/A"}`,
            ],
            backgroundColor: "rgba(245,245,245)",
            font: {
              size: 16,
            },
            borderRadius: 4,
            xAdjust: time
              ? clamp(-((time.getMonth() - 6) / 6) * 500, -90, 90)
              : 0,
          },
        },
      },
      legend: {
        display: false, // Set this to false to hide the legend
      },
    },
  };

  const depthPlotOptions = {
    type: "line",
    responsive: true,
    scales: {
      x: {
        type: "linear" as const,
        min: -5,
        max: 40,
        title: {
          display: true,
          text: "Nitrate Concentration (mg/L)",
          color: "#4A5568", // Gray-700
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Depth (m)",
          color: "#4A5568", // Gray-700
        },
        min: -30,
        max: 0,
      },
    },
    plugins: {
      legend: {
        display: false, // Set this to false to hide the legend
      },
    },
  };
  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    if (data === null) return;
    if (!(chartRef.current instanceof ChartJS)) return;
    const canvas = chartRef.current;
    const elements = canvas.getElementsAtEventForMode(
      event as unknown as Event,
      "nearest",
      { intersect: false, axis: "x" },
      true
    );
    if (!elements.length) return;
    const { index } = elements[0];
    const { x } = data[0].data[index];
    setTime(x);
  };

  return (
    <div className="max-w-4xl p-4 overflow-x-auto bg-neutral-100 rounded-lg shadow-md border border-gray-200 flex-col justify-center mx-auto">
      <div className="mb-4">
        <YearSelector year={year} setYear={setYear} />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Nitrate Concentration
      </h2>
      <div className="flex flex-col w-full min-w-150 md:flex-row w-full h-200 md:h-125">
        <div className="w-full md:w-2/3 h-1/2 md:h-full">
          <Line
            data={chartData}
            options={{
              ...options,
              maintainAspectRatio: false,
              aspectRatio: 1,
            }}
            onClick={onClick}
            ref={chartRef}
          />
        </div>
        <div className="w-full md:w-1/3 h-1/2 md:h-full">
          <Line
            data={depthChartData}
            options={{
              ...depthPlotOptions,
              maintainAspectRatio: false,
              aspectRatio: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};
