import { useTheme } from "next-themes"
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { cn } from "../../lib/utils"

interface RadarChartProps {
  data: {
    category: string
    score: number
  }[]
  className?: string
}

export function RadarChart({ data, className }: RadarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const chartData = data.map((item) => ({
    subject: item.category,
    score: item.score,
    fullMark: 100,
  }))

  return (
    <div className={cn(
      "w-full h-[400px] min-h-[400px] relative transition-all duration-200",
      "sm:h-[450px] md:h-[500px] lg:h-[550px]",
      className
    )}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="75%"
          data={chartData}
          className={cn(
            "[&_.recharts-polar-grid-angle-line]:!stroke-border/40",
            "[&_.recharts-polar-grid-concentric-circle]:!stroke-border/40",
            "[&_.recharts-polar-radius-axis-line]:!stroke-border/60",
            "transition-opacity duration-200"
          )}
        >
          <PolarGrid
            gridType="circle"
            stroke={isDark ? "hsl(var(--border))" : "hsl(var(--border))"}
            strokeOpacity={0.5}
            strokeDasharray="4 4"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
              fontSize: 13,
              fontWeight: 500,
            }}
            tickLine={false}
            dy={4}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))",
              fontSize: 11,
            }}
            stroke={isDark ? "hsl(var(--border))" : "hsl(var(--border))"}
            strokeOpacity={0.6}
            tickCount={5}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload) return null
              return (
                <div className={cn(
                  "rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg",
                  "transition-all duration-200 animate-in fade-in-50 zoom-in-95",
                  "border-border/50"
                )}>
                  <div className="flex flex-col gap-1">
                    <span className="text-[0.75rem] uppercase tracking-wider text-muted-foreground font-medium">
                      {payload[0]?.payload.subject}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {payload[0]?.value}%
                    </span>
                  </div>
                </div>
              )
            }}
            wrapperStyle={{ outline: "none" }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.15}
            strokeWidth={2}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
} 