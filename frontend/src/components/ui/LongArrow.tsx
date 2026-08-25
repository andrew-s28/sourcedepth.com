interface LongArrowProps {
  width?: number;
  color?: string;
  className?: string;
  orientation?: 'left' | 'right';
}

export default function LongArrow({
  width = 100,
  color = 'currentColor',
  orientation = 'right',
  className = ''
}: LongArrowProps) {
  return (
    <svg
      width={width}
      height="24"
      viewBox="0 0 100 24"
      fill="none"
      xmlns="http://w3.org"
      className={className}
    >
      {orientation === 'right' ? (
        <>
        <line
        x1="0"
        y1="12"
        x2="96"
        y2="12"
        stroke={color}
        strokeWidth="2"
        />
        <path
          d="M88 4L98 12L88 20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        </>
      ) : (
        <>
        <line
          x1="4"
          y1="12"
          x2="100"
          y2="12"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M12 4L2 12L12 20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        </>
      )}
    </svg>
  );
};
