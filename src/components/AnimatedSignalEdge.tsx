import { type EdgeProps, getStraightPath } from "reactflow";

interface AnimatedSignalEdgeProps extends EdgeProps {
  data?: {
    isRouteEdge: boolean;
    isTransmitted: boolean;
    isAnimating: boolean;
    hopIndex: number;
    totalHops: number;
    transmissionId: number;
  };
}

const HOP_DURATION = 800; // ms per hop

export default function AnimatedSignalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  data,
}: AnimatedSignalEdgeProps) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  const isRouteEdge = data?.isRouteEdge ?? false;
  const isTransmitted = data?.isTransmitted ?? false;
  const isAnimating = data?.isAnimating ?? false;
  const hopIndex = data?.hopIndex ?? 0;
  const transmissionId = data?.transmissionId ?? 0;

  // Compute the length of the edge for animation
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const edgeLength = Math.sqrt(dx * dx + dy * dy);

  // Animation delay: each hop starts after the previous one's comet has arrived
  const delayMs = hopIndex * HOP_DURATION;
  const durationMs = HOP_DURATION;

  // Base edge style
  const baseStroke = style?.stroke ?? "#1e3a8a";
  const baseOpacity = style?.opacity ?? 0.5;
  const baseStrokeWidth = style?.strokeWidth ?? 1;

  // Final "transmitted" glow stroke (shown once animation completes)
  const transmittedStroke = "#00F0FF";
  const transmittedWidth = 4;

  const animKeyPrefix = `comet-${id}-tx${transmissionId}`;

  return (
    <g>
      {/* Base edge line */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={isTransmitted ? transmittedStroke : baseStroke}
        strokeWidth={isTransmitted ? transmittedWidth : baseStrokeWidth}
        opacity={isTransmitted ? 0.9 : baseOpacity}
        style={{
          transition:
            "stroke 0.4s ease, stroke-width 0.4s ease, opacity 0.4s ease",
          filter: isTransmitted ? "drop-shadow(0 0 4px #00F0FF)" : "none",
        }}
      />

      {/* Comet dot — only shown while actively animating this route */}
      {isAnimating && isRouteEdge && edgeLength > 0 && (
        <g>
          <defs>
            {/* Gradient for comet tail effect along the direction of travel */}
            <linearGradient
              id={`${animKeyPrefix}-grad`}
              x1={sourceX}
              y1={sourceY}
              x2={targetX}
              y2={targetY}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
              <stop offset="70%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            {/* Clip path so we only show the comet along this edge */}
            <clipPath id={`${animKeyPrefix}-clip`}>
              <rect
                x={Math.min(sourceX, targetX) - 20}
                y={Math.min(sourceY, targetY) - 20}
                width={Math.abs(dx) + 40}
                height={Math.abs(dy) + 40}
              />
            </clipPath>
          </defs>

          {/* Comet head: animated circle along the path */}
          <circle r="4" fill="#ffffff" opacity="0.95">
            <animateMotion
              key={`${animKeyPrefix}-head`}
              dur={`${durationMs}ms`}
              begin={`${delayMs}ms`}
              fill="freeze"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
              keyTimes="0;1"
            >
              <mpath href={`#${id}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.9;1"
              dur={`${durationMs}ms`}
              begin={`${delayMs}ms`}
              fill="freeze"
            />
          </circle>

          {/* Comet glow halo */}
          <circle r="7" fill="#00F0FF" opacity="0">
            <animateMotion
              key={`${animKeyPrefix}-glow`}
              dur={`${durationMs}ms`}
              begin={`${delayMs}ms`}
              fill="freeze"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
              keyTimes="0;1"
            >
              <mpath href={`#${id}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;0.35;0.35;0"
              keyTimes="0;0.1;0.9;1"
              dur={`${durationMs}ms`}
              begin={`${delayMs}ms`}
              fill="freeze"
            />
          </circle>
        </g>
      )}
    </g>
  );
}
