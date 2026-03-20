import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { cn } from "../../lib/utils"
import { useTheme } from "next-themes"

interface RadarChartProps {
  data: {
    category: string
    score: number
  }[]
  className?: string
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 dark:border-[#3a3a3a] bg-white dark:bg-[#2A2A2A] px-3 py-2 shadow-md">
      <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-[#888888] mb-0.5">
        {payload[0]?.payload.subject}
      </p>
      <p className="text-lg font-medium tabular-nums" style={{ color: 'var(--brand-accent)' }}>
        {payload[0]?.value}%
      </p>
    </div>
  );
}

function CustomAxisTick({ x, y, payload, isDark }: { x?: number; y?: number; payload?: any; isDark: boolean }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill={isDark ? "#b8b4ae" : "#6b7280"}
      fontSize={12}
      fontFamily="Poppins, sans-serif"
      fontWeight={500}
    >
      {payload?.value}
    </text>
  );
}

export function RadarChart({ data, className }: RadarChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartData = data.map((item) => ({
    subject: item.category,
    score: item.score,
    fullMark: 100,
  }))

  const gridStroke = isDark ? "#3a3a3a" : "#e5e7eb";
  const radarColor = isDark ? "#FFC313" : "#7a00df";

  return (
    <div className={cn("w-full h-[280px] sm:h-[360px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="62%"
          data={chartData}
        >
          <PolarGrid
            gridType="circle"
            stroke={gridStroke}
            strokeOpacity={0.8}
            strokeDasharray="4 4"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={(props) => <CustomAxisTick {...props} isDark={isDark} />}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{ outline: "none" }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke={radarColor}
            fill={radarColor}
            fillOpacity={0.12}
            strokeWidth={2}
            dot={{ fill: radarColor, r: 3, strokeWidth: 0 }}
            activeDot={{ fill: radarColor, r: 5, strokeWidth: 0 }}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
