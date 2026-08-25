import { useMemo, useState, type ComponentProps } from "react";

import {
  ContourPlot,
  type BuildClipPathFn,
  type CanvasDrawFn,
} from "~/components/Plots";
import { SliderWithValue } from "~/components/Slider";
import useDebounce from "~/hooks/useDebounce";
import { meshGrid } from "../utils/utils";

const defaultBackgroundFlowSpeed = 20; // m/s
const defaultMountainWavelength = 5; // km

/**
 * Wraps ContourPlot with lenticular-cloud-specific rendering: clips the
 * contour fills above the mountain surface and draws the terrain fill/line.
 */
function LenticularContourPlot({
  mountainProfile,
  ...props
}: ComponentProps<typeof ContourPlot> & {
  mountainProfile?: { x: number[]; y: number[] };
}) {
  const buildClipPath: BuildClipPathFn | undefined = mountainProfile
    ? (
        ctx,
        {
          xScale,
          yScale,
          width,
          height,
          marginLeft,
          marginRight,
          marginTop,
          marginBottom,
        }
      ) => {
        ctx.moveTo(marginLeft, marginTop);
        ctx.lineTo(width - marginRight, marginTop);
        ctx.lineTo(width - marginRight, height - marginBottom);
        for (let i = mountainProfile.x.length - 1; i >= 0; i--) {
          ctx.lineTo(
            xScale(mountainProfile.x[i]),
            yScale(mountainProfile.y[i])
          );
        }
        ctx.lineTo(marginLeft, height - marginBottom);
      }
    : undefined;

  const onCanvasDraw: CanvasDrawFn | undefined = mountainProfile
    ? (
        ctx,
        { xScale, yScale, width, height, marginLeft, marginRight, marginBottom }
      ) => {
        // Filled terrain body
        ctx.beginPath();
        ctx.moveTo(marginLeft, height - marginBottom);
        for (let i = 0; i < mountainProfile.x.length; i++) {
          ctx.lineTo(
            xScale(mountainProfile.x[i]),
            yScale(mountainProfile.y[i])
          );
        }
        ctx.lineTo(width - marginRight, height - marginBottom);
        ctx.closePath();
        ctx.fillStyle = "#8B7355";
        ctx.fill();
        // Surface line
        ctx.beginPath();
        for (let i = 0; i < mountainProfile.x.length; i++) {
          const px = xScale(mountainProfile.x[i]);
          const py = yScale(mountainProfile.y[i]);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#5a4a32";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    : undefined;

  return (
    <ContourPlot
      {...props}
      buildClipPath={buildClipPath}
      onCanvasDraw={onCanvasDraw}
    />
  );
}

export function LenticularClouds() {
  const [backgroundFlowSpeed, setBackgroundFlowSpeed] = useState(
    defaultBackgroundFlowSpeed
  ); // m/s
  const [mountainWavelength, setMountainWavelength] = useState(
    defaultMountainWavelength
  ); // km

  const debouncedBackgroundFlowSpeed = useDebounce(backgroundFlowSpeed, 100);
  const debouncedMountainWavelength = useDebounce(mountainWavelength, 100);

  const { x, z, w, rh, mountainProfile } = useMemo(
    () =>
      LenticularCloudSolution({
        backgroundFlowSpeed: debouncedBackgroundFlowSpeed,
        mountainWavelength: debouncedMountainWavelength,
      }),
    [debouncedBackgroundFlowSpeed, debouncedMountainWavelength]
  );

  const onChange = ({
    backgroundFlowSpeed,
    mountainWavelength,
  }: {
    backgroundFlowSpeed: number;
    mountainWavelength: number;
  }) => {
    setBackgroundFlowSpeed(backgroundFlowSpeed);
    setMountainWavelength(mountainWavelength);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row">
        <LenticularContourPlot
          x={x}
          y={z}
          z={w}
          mountainProfile={mountainProfile}
          colorbarLabel="Vertical velocity (km/hr)"
          overlayZ={rh}
          overlayThreshold={1}
          xLabel="Distance (km)"
          yLabel="Altitude (km)"
          xTickValues={[0, 5, 10, 15, 20, 25, 30]}
          yTickValues={[0, 1, 2, 3, 4, 5]}
          className="w-full pr-4"
        />
      </div>
      <LenticularCloudParams onChange={onChange} />
    </div>
  );
}

export function LenticularCloudSolution({
  backgroundFlowSpeed,
  mountainWavelength,
}: {
  backgroundFlowSpeed: number;
  mountainWavelength: number;
}) {
  const xMax = 30; // Fixed horizontal extent (km)
  const x = Array.from({ length: 100 }, (_, i) => (i * xMax) / 99); // Horizontal grid (km), fixed 0–30 km range
  const h_m = 0.5; // Mountain height (km) — display z=0 corresponds to mountain trough
  const zMax = 5; // Display altitude range (km)
  const z_display = Array.from({ length: 100 }, (_, i) => (i * zMax) / 99); // Display altitude (km)
  const z_physics = z_display.map((zd) => zd - h_m); // Physics coords: trough=−h_m, mean surface=0
  const { xx, yy: zz } = meshGrid({ x, y: z_physics }); // zz holds physics z-values
  const rh_bg = 0.95; // Background relative humidity
  const T_s = 300; // Background surface temperature (K)
  const lapseRate = 9.8; // Lapse rate (K/km)
  const N = Math.sqrt((9.81 / T_s) * (lapseRate / 1000)); // Buoyancy frequency (1/s)
  const lv = 2.5e6; // Latent heat of vaporization (J/kg)
  const R = 461.5; // Gas constant for water vapor (J/kg/K)

  const k = (2 * Math.PI) / mountainWavelength; // Wavenumber (1/km)
  const U = backgroundFlowSpeed / 1000; // Background flow speed (km/s)

  let w, eta;
  if (U * k > N) {
    const mu = Math.sqrt(k ** 2 - N ** 2 / U ** 2);
    w = xx.map((x_i, i) =>
      x_i.map(
        (x_ij, j) => U * k * h_m * Math.exp(-mu * zz[i][j]) * Math.cos(k * x_ij)
      )
    );
    eta = xx.map((x_i, i) =>
      x_i.map((x_ij, j) => h_m * Math.exp(-mu * zz[i][j]) * Math.sin(k * x_ij))
    );
  } else {
    const nu = Math.sqrt(N ** 2 / U ** 2 - k ** 2);
    w = xx.map((x_i, i) =>
      x_i.map((x_ij, j) => U * k * h_m * Math.cos(k * x_ij + nu * zz[i][j]))
    );
    eta = xx.map((x_i, i) =>
      x_i.map((x_ij, j) => h_m * Math.sin(k * x_ij + nu * zz[i][j]))
    );
  }
  const theta_prime = eta.map((eta_i) =>
    eta_i.map((eta_ij) => -lapseRate * eta_ij)
  ); // Potential temperature perturbation
  const alpha = lv / (R * T_s ** 2); // Clausius-Clapeyron constant (K⁻¹)

  const rh = theta_prime.map((theta_prime_i) =>
    theta_prime_i.map(
      (theta_prime_ij) => rh_bg * Math.exp(-alpha * theta_prime_ij)
    )
  ); // Relative humidity perturbation

  // Convert w from km/s to km/hr
  const w_kmhr = w.map((row) => row.map((v) => v * 3600));

  // Mountain surface in display coords: H(x) = h_m·(1 + sin(kx)), ranges 0 (trough) to 2·h_m (crest)
  const mountainY = x.map((xi) => h_m * (1 + Math.sin(k * xi)));

  return {
    x,
    z: z_display,
    w: w_kmhr,
    eta,
    rh,
    mountainProfile: { x, y: mountainY },
  };
}

export function LenticularCloudParams({
  onChange,
}: {
  onChange?: (params: {
    backgroundFlowSpeed: number;
    mountainWavelength: number;
  }) => void;
}) {
  const [backgroundFlowSpeed, setBackgroundFlowSpeed] = useState(
    defaultBackgroundFlowSpeed
  ); // m/s
  const [mountainWavelength, setMountainWavelength] = useState(
    defaultMountainWavelength
  ); // km
  return (
    <div className="flex flex-col md:flex-row gap-4 px-2 pb-2 ">
      <SliderWithValue
        label="Background Flow Speed (m/s)"
        min={1}
        max={40}
        step={1}
        defaultValue={defaultBackgroundFlowSpeed}
        onChange={(value: number) => {
          setBackgroundFlowSpeed(value);
          if (onChange)
            onChange({ backgroundFlowSpeed: value, mountainWavelength });
        }}
        className="w-full md:w-1/2"
      />
      <SliderWithValue
        label="Mountain Wavelength (km)"
        min={1}
        max={10}
        step={1}
        defaultValue={defaultMountainWavelength}
        onChange={(value: number) => {
          setMountainWavelength(value);
          if (onChange)
            onChange({ backgroundFlowSpeed, mountainWavelength: value });
        }}
        className="w-full md:w-1/2"
      />
    </div>
  );
}
