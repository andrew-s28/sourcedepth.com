import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { cn } from "~/utils/utils";
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
      <div className="w-full min-w-150 h-200 md:h-125">
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
      <div className="w-full min-w-150 h-200 md:h-125">
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

// export const TimeSeriesPlotTestData = [
//   { x: new Date("2020-01-01"), y: 30 },
//   { x: new Date("2020-02-01"), y: 35 },
//   { x: new Date("2020-03-01"), y: 28 },
//   { x: new Date("2020-04-01"), y: 40 },
//   { x: new Date("2020-05-01"), y: 32 },
//   { x: new Date("2020-06-01"), y: 38 },
//   { x: new Date("2020-07-01"), y: 31 },
//     { x: new Date("2020-08-01"), y: 36 },
//     { x: new Date("2020-09-01"), y: 29 },
//     { x: new Date("2020-10-01"), y: 34 },
//     { x: new Date("2020-11-01"), y: 30 },
//     { x: new Date("2020-12-01"), y: 37 },
// ];

// export const TimeSeriesPlotChartData = {
//     datasets: [
//         {
//         label: "Test Data",
//         data: TimeSeriesPlotTestData,
//         borderColor: "blue",
//         backgroundColor: "blue",
//         },
//         {
//         label: "Test Data 2",
//         data: TimeSeriesPlotTestData.map((point) => ({ x: point.x, y: point.y + 5 })),
//         borderColor: "red",
//         backgroundColor: "red",
//         }
//     ],
// }

// export const TimeSeriesPlotTestOptions = {
//   tMin: new Date("2019-12-01"),
//   tMax: new Date("2020-12-31"),
//   yMin: 20,
//   yMax: 50,
//   time: new Date("2020-06-01"),
//   title: "Test Time Series Plot",
//   plugins: {
//     legend: {
//       display: false,
//     },
//     tooltip: {
//         enabled: true,
//         callbacks: {
//             title: function(context) {
//                 const date = context[0].parsed.x;
//                 return new Date(date).toLocaleDateString();
//             },
//             label: function(context) {
//                 const label = context.dataset.label || '';
//                 const value = context.parsed.y !== null ? context.parsed.y : '';
//                 return `${label}: ${value}`;
//             }
//         }
//     }
//   }
// };

export interface ContourPlotLayout {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
}

/**
 * Called between `ctx.beginPath()` and `ctx.closePath() / ctx.clip()`.
 * Draw the polygon that defines the clip region for contour fills.
 * If omitted, a simple rectangle over the plot area is used.
 */
export type BuildClipPathFn = (
  ctx: CanvasRenderingContext2D,
  layout: ContourPlotLayout,
) => void;

/**
 * Called after the clipped contour draws are restored.
 * Use this to paint any additional canvas content (fills, lines, annotations)
 * that should sit on top of the contours.
 */
export type CanvasDrawFn = (
  ctx: CanvasRenderingContext2D,
  layout: ContourPlotLayout,
) => void;

interface ColorbarProps {
  colors: d3.ScaleDiverging<string>;
  dataMin: number;
  dataMax: number;
  width: number;
  marginLeft: number;
  marginRight: number;
  label?: string;
}

export interface ContourPlotProps {
  x: number[];
  y: number[];
  z: number[][] | null;
  colorbarLabel?: string;
  overlayZ?: number[][] | null;
  overlayThreshold?: number;
  aspectRatio?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  className?: string;
  xLabel?: string;
  yLabel?: string;
  xTickValues?: number[];
  yTickValues?: number[];
  buildClipPath?: BuildClipPathFn;
  /** Draw additional canvas content on top of contours (fills, lines, annotations). */
  onCanvasDraw?: CanvasDrawFn;
}

function Colorbar({
  colors,
  dataMin,
  dataMax,
  width,
  marginLeft,
  marginRight,
  label,
}: ColorbarProps) {
  const barCanvasRef = useRef<HTMLCanvasElement>(null);
  const barSvgRef = useRef<SVGSVGElement>(null);
  const barHeight = 16;
  const svgHeight = label ? 44 : 30;

  useEffect(() => {
    const canvas = barCanvasRef.current;
    if (!canvas || width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, barHeight);
    const barWidth = width - marginLeft - marginRight;
    for (let i = 0; i < barWidth; i++) {
      const t = i / (barWidth - 1);
      ctx.fillStyle = colors(dataMin + t * (dataMax - dataMin));
      ctx.fillRect(marginLeft + i, 0, 1, barHeight);
    }
  }, [width, colors, dataMin, dataMax, marginLeft, marginRight]);

  useEffect(() => {
    if (!barSvgRef.current) return;
    const svg = d3.select(barSvgRef.current);
    svg.selectAll("*").remove();
    const scale = d3
      .scaleLinear()
      .domain([dataMin, dataMax])
      .range([marginLeft, width - marginRight]);
    svg
      .append("g")
      .call(d3.axisBottom(scale).ticks(5))
      .style("font-size", "12px");
    if (label) {
      svg
        .append("text")
        .attr("x", (marginLeft + width - marginRight) / 2)
        .attr("y", svgHeight - 4)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .style("font-size", "13px")
        .text(label);
    }
  }, [width, dataMin, dataMax, marginLeft, marginRight, label]);

  return (
    <div style={{ position: "relative", width, height: barHeight + svgHeight }}>
      <canvas
        ref={barCanvasRef}
        width={width}
        height={barHeight}
        style={{ display: "block" }}
      />
      <svg
        ref={barSvgRef}
        width={width}
        height={svgHeight}
        style={{ display: "block" }}
      />
    </div>
  );
}

export function ContourPlot({
  x,
  y,
  z,
  colorbarLabel,
  overlayZ,
  overlayThreshold,
  aspectRatio = 400 / 640,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 55,
  className,
  xLabel,
  yLabel,
  xTickValues,
  yTickValues,
  buildClipPath,
  onCanvasDraw,
}: ContourPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(640);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const width = containerWidth;
  const height = Math.round(containerWidth * aspectRatio);

  const hasData = z && x.length > 0 && y.length > 0 && z.length > 0;

  const { paddedXLength, paddedYLength, contour, colors, dataMin, dataMax } =
    useMemo(() => {
      const pxLen = x.length + 2;
      const pyLen = y.length + 2;
      if (!hasData) {
        return {
          paddedXLength: pxLen,
          paddedYLength: pyLen,
          data: [] as number[],
          contour: [] as ReturnType<ReturnType<typeof d3.contours>>,
          colors: d3.scaleDiverging([-1, 0, 1], (t) =>
            d3.interpolateRdBu(1 - t),
          ),
          dataMin: -1,
          dataMax: 1,
        };
      }
      const paddedZ = [
        [z[0][0], ...z[0], z[0][z[0].length - 1]],
        ...z.map((row) => [row[0], ...row, row[row.length - 1]]),
        [
          z[z.length - 1][0],
          ...z[z.length - 1],
          z[z.length - 1][z[z.length - 1].length - 1],
        ],
      ];
      const flat = Array.from(
        { length: pxLen * pyLen },
        (_, i) => paddedZ[Math.floor(i / pxLen)][i % pxLen],
      );
      const c = d3.contours().size([pxLen, pyLen]).smooth(true).thresholds(30)(
        flat,
      );
      const col = d3.scaleDiverging(
        [Math.min(...flat), 0, Math.max(...flat)],
        (t) => d3.interpolateRdBu(1 - t),
      );
      return {
        paddedXLength: pxLen,
        paddedYLength: pyLen,
        data: flat,
        contour: c,
        colors: col,
        dataMin: Math.min(...flat),
        dataMax: Math.max(...flat),
      };
    }, [z]);

  const overlayContour = useMemo(() => {
    if (!overlayZ || overlayThreshold === undefined || overlayZ.length === 0)
      return [];
    const pxLen = overlayZ[0].length + 2;
    const pyLen = overlayZ.length + 2;
    const paddedZ = [
      [overlayZ[0][0], ...overlayZ[0], overlayZ[0][overlayZ[0].length - 1]],
      ...overlayZ.map((row) => [row[0], ...row, row[row.length - 1]]),
      [
        overlayZ[overlayZ.length - 1][0],
        ...overlayZ[overlayZ.length - 1],
        overlayZ[overlayZ.length - 1][overlayZ[overlayZ.length - 1].length - 1],
      ],
    ];
    const flat = Array.from(
      { length: pxLen * pyLen },
      (_, i) => paddedZ[Math.floor(i / pxLen)][i % pxLen],
    );
    return d3.contours().size([pxLen, pyLen]).thresholds([overlayThreshold])(
      flat,
    );
  }, [overlayZ, overlayThreshold]);

  const overlayPaddedXLength = overlayZ ? overlayZ[0].length + 2 : 0;
  const overlayPaddedYLength = overlayZ ? overlayZ.length + 2 : 0;

  const xExtent = d3.extent(x) as [number, number];
  const yExtent = d3.extent(y) as [number, number];

  const xScale = d3
    .scaleLinear()
    .domain(xExtent)
    .range([marginLeft, width - marginRight]);
  const yScale = d3
    .scaleLinear()
    .domain(yExtent)
    .range([height - marginBottom, marginTop]);

  const gridToDataX = d3
    .scaleLinear()
    .domain([1, paddedXLength - 2])
    .range([xExtent[0], xExtent[1]]);
  const gridToDataY = d3
    .scaleLinear()
    .domain([1, paddedYLength - 2])
    .range([yExtent[0], yExtent[1]]);

  const layout: ContourPlotLayout = {
    xScale,
    yScale,
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };

  // Draw contours onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Clip to plot area (custom polygon or default rect)
    ctx.save();
    ctx.beginPath();
    if (buildClipPath) {
      buildClipPath(ctx, layout);
    } else {
      ctx.rect(
        marginLeft,
        marginTop,
        width - marginLeft - marginRight,
        height - marginTop - marginBottom,
      );
    }
    ctx.closePath();
    ctx.clip();

    // Draw contour fills
    if (hasData) {
      const path2d = d3.geoPath(
        d3.geoTransform({
          point: function (gx, gy) {
            const px = xScale(gridToDataX(gx));
            const py = yScale(gridToDataY(gy));
            this.stream.point(px, py);
          },
        }),
        ctx,
      );
      for (const c of contour) {
        ctx.beginPath();
        path2d(c);
        ctx.fillStyle = colors(c.value);
        ctx.fill();
      }
    }

    ctx.restore();

    // Draw overlay contour as a line (e.g. RH = 1)
    if (overlayContour.length > 0) {
      const overlayGridToDataX = d3
        .scaleLinear()
        .domain([1, overlayPaddedXLength - 2])
        .range([xExtent[0], xExtent[1]]);
      const overlayGridToDataY = d3
        .scaleLinear()
        .domain([1, overlayPaddedYLength - 2])
        .range([yExtent[0], yExtent[1]]);
      const overlayPath = d3.geoPath(
        d3.geoTransform({
          point: function (gx, gy) {
            this.stream.point(
              xScale(overlayGridToDataX(gx)),
              yScale(overlayGridToDataY(gy)),
            );
          },
        }),
        ctx,
      );
      ctx.save();
      ctx.beginPath();
      if (buildClipPath) {
        buildClipPath(ctx, layout);
      } else {
        ctx.rect(
          marginLeft,
          marginTop,
          width - marginLeft - marginRight,
          height - marginTop - marginBottom,
        );
      }
      ctx.closePath();
      ctx.clip();
      for (const c of overlayContour) {
        ctx.beginPath();
        overlayPath(c);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Optional canvas overlay drawn on top of contours (outside clip)
    if (onCanvasDraw) {
      onCanvasDraw(ctx, layout);
    }
  }, [
    width,
    height,
    contour,
    colors,
    overlayContour,
    buildClipPath,
    onCanvasDraw,
  ]);

  // Draw axes + labels onto SVG overlay
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xAxis = d3.axisBottom(xScale);
    if (xTickValues) xAxis.tickValues(xTickValues);

    const yAxis = d3.axisLeft(yScale);
    if (yTickValues) yAxis.tickValues(yTickValues);

    svg
      .append("g")
      .attr("transform", `translate(0,${(height - marginBottom).toString()})`)
      .call(xAxis)
      .style("font-size", "13px");

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft.toString()},0)`)
      .call(yAxis)
      .style("font-size", "13px");

    if (xLabel) {
      svg
        .append("text")
        .attr("x", (marginLeft + width - marginRight) / 2)
        .attr("y", height - 8)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(xLabel);
    }

    if (yLabel) {
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -((marginTop + height - marginBottom) / 2))
        .attr("y", 16)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(yLabel);
    }
  }, [width, height, xLabel, yLabel, xTickValues, yTickValues]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block w-full h-auto"
        />
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="absolute pointer-events-none top-0 left-0"
        />
      </div>
      <Colorbar
        colors={colors}
        dataMin={dataMin}
        dataMax={dataMax}
        width={width}
        marginLeft={marginLeft}
        marginRight={marginRight}
        label={colorbarLabel}
      />
    </div>
  );
}
