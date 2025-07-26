import { useEffect, useRef, useState } from "react";
import "chartjs-adapter-date-fns";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { api } from "../utils/dataset-api";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { Line } from "react-chartjs-2";

import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  annotationPlugin
);

interface MonthlyNitratePlotData {
  x: string;
  y: number | null;
}

export const MonthlyNitratePlot = () => {
  // const chartRef = useRef<ChartJSOrUndefined<"line", { x: Date; y: number | null }[], unknown>>(null);
  const chartRef =
    useRef<ChartJSOrUndefined<"line", MonthlyNitratePlotData["y"][]>>(
      undefined
    );
  const [monthlyNitrateData, setMonthlyNitrateData] = useState<
    MonthlyNitratePlotData[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getMonthlyNitrateData();
        const data = Object.entries(result.data).map(([index, values]) => {
          const month = index;
          const nitrateConc = values === -9999 ? null : values;
          return {
            x: month,
            y: nitrateConc,
          };
        });
        setMonthlyNitrateData(data);
        return data;
      } catch (error) {
        console.error("Error fetching nitrate data:", error);
      }
    };
    void fetchData();
  }, []);
  const chartData = {
    labels: monthlyNitrateData?.map((d) => d.x) || [],
    datasets: [
      {
        label: "Nitrate Concentration",
        data: monthlyNitrateData?.map((d) => d.y) || [],
        borderColor: "rgba(0, 0, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        yAxisID: "y",
      },
    ],
  };

  const options = {
    type: "line",
    responsive: true,
    scales: {
      x: {
        position: "bottom" as const,
        title: {
          display: true,
          text: "Month",
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
        min: 0,
        max: 40,
      },
    },
    plugins: {
      legend: {
        display: false, // Set this to false to hide the legend
      },
    },
  };

  return (
    <div className="max-w-4xl overflow-x-auto p-4 bg-neutral-100 rounded-lg shadow-md border border-gray-200 flex-col justify-center mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Monthly Mean Nitrate Concentration
      </h2>
      <div className="flex flex-col md:flex-row w-full h-[800px] md:h-[500px]">
        <div className="w-full min-w-[600px] h-full">
          <Line
            data={chartData}
            options={{
              ...options,
              maintainAspectRatio: false,
              aspectRatio: 1,
            }}
            ref={chartRef}
          />
        </div>
      </div>
    </div>
  );
};
