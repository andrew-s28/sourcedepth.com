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
import { Scatter } from "react-chartjs-2";

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

interface WindNitrateChlorophyllPlotData {
  windNitratePlotData: {
    x: number | null;
    y: number | null;
  };
  windChlorophyllPlotData: {
    x: number | null;
    y: number | null;
  };
}

export const WindNitrateChlorophyllPlot = () => {
  // const chartRef = useRef<ChartJSOrUndefined<"line", { x: Date; y: number | null }[], unknown>>(null);
  const chartRef =
    useRef<
      ChartJSOrUndefined<
        "scatter",
        WindNitrateChlorophyllPlotData["windChlorophyllPlotData"][]
      >
    >(undefined);
  const [windNitrateChlorophyllData, setWindNitrateChlorophyllData] = useState<
    WindNitrateChlorophyllPlotData[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getWindNitrateChlorophyllData();
        const data = Object.entries(result.data).map(([_index, values]) => {
          const nitrateConc = values.nitrate === -9999 ? null : values.nitrate;
          const windStress = values.wind === -9999 ? null : values.wind;
          const chlorophyllConc =
            values.chlorophyll === -9999 ? null : values.chlorophyll;
          const windNitratePlotData = {
            x: windStress,
            y: nitrateConc,
          };
          const windChlorophyllPlotData = {
            x: windStress,
            y: chlorophyllConc,
          };
          return {
            windNitratePlotData,
            windChlorophyllPlotData,
          };
        });
        setWindNitrateChlorophyllData(data);
        return data;
      } catch (error) {
        console.error("Error fetching nitrate data:", error);
      }
    };
    void fetchData();
  }, []);

  const chartData = {
    labels: [-0.15, -0.1, -0.05, 0, 0.05, 0.1],
    datasets: [
      {
        label: "Nitrate Concentration",
        data: windNitrateChlorophyllData
          ? windNitrateChlorophyllData.map((point) => ({
              x: point.windNitratePlotData.x,
              y: point.windNitratePlotData.y,
            }))
          : [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Chlorophyll Concentration",
        data: windNitrateChlorophyllData
          ? windNitrateChlorophyllData.map((point) => ({
              x: point.windChlorophyllPlotData.x,
              y: point.windChlorophyllPlotData.y,
            }))
          : [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    type: "scatter",
    responsive: true,
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        title: {
          display: true,
          text: "Weighted Average of Recent Wind Stress (N/m²)",
          color: "#4A5568", // Gray-700
        },
        min: -0.15,
        max: 0.1,
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
      y1: {
        type: "linear" as const,
        position: "right" as const,
        title: {
          display: true,
          text: "Chlorophyll Concentration (mg/L)",
          color: "#4A5568", // Gray-700
        },
        min: 0,
        max: 40,
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          verticalLine: {
            type: "line" as const,
            xMin: 0,
            xMax: 0,
            borderColor: "black",
            borderWidth: 2,
          },
          label1: {
            type: "label" as const,
            content: "← Upwelling Favorable",
            xValue: -0.05,
            yValue: 38,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "#fff",
          },
          label2: {
            type: "label" as const,
            content: "Downwelling Favorable →",
            xValue: 0.05,
            yValue: 38,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "#fff",
          },
        },
      },
      legend: {
        position: "top" as const,
        labels: {
          color: "#4A5568", // Gray-700
        },
      },
    },
  };

  return (
    <div className="max-w-4xl p-4 overflow-x-auto bg-neutral-100 rounded-lg shadow-md border border-gray-200 flex-col justify-center mx-auto">
      <div className="flex flex-col md:flex-row w-full h-[800px] md:h-[500px]">
        <div className="w-full min-w-[600px] h-full">
          <Scatter
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
