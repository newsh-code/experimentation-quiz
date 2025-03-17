import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip';
import { cn } from '../../lib/utils';
import { CategoryKey, ScoreLevelInfo } from '../../types';

interface ScoreCardProps {
  category: CategoryKey;
  score: number;
  description: string;
  tooltip: string;
  icon: React.ReactNode;
  scoreLevelInfo: ScoreLevelInfo;
  className?: string;
}

export function ScoreCard({
  category,
  score,
  description,
  tooltip,
  icon,
  scoreLevelInfo,
  className
}: ScoreCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score: number, alpha: number = 0.1) => {
    if (score < 40) return `rgba(239, 68, 68, ${alpha})`; // red
    if (score < 70) return `rgba(234, 179, 8, ${alpha})`; // yellow
    return `rgba(34, 197, 94, ${alpha})`; // green
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn(
            "relative overflow-hidden transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-1",
            "group",
            className
          )}>
            {/* Animated background fill */}
            <div 
              className="absolute inset-0 transition-all duration-1000 ease-out"
              style={{ 
                background: `linear-gradient(to right, 
                  ${getScoreColor(score, 0.15)} ${score}%, 
                  transparent ${score}%
                )`,
                opacity: isVisible ? 1 : 0,
                transform: `scaleX(${isVisible ? 1 : 0})`,
                transformOrigin: 'left'
              }}
            />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                <span 
                  className="text-primary-500 dark:text-primary-400 transition-colors duration-200"
                  style={{ color: getScoreColor(score, 1) }}
                >
                  {icon}
                </span>
                {category}
              </CardTitle>
              <Badge 
                variant={scoreLevelInfo.color === 'yellow' ? 'warning' : scoreLevelInfo.color === 'red' ? 'destructive' : 'default'}
                className={cn(
                  "transition-all duration-300",
                  "font-semibold",
                  scoreLevelInfo.color === 'green' && "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100",
                  scoreLevelInfo.color === 'yellow' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100",
                  scoreLevelInfo.color === 'red' && "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100"
                )}
              >
                {score}%
              </Badge>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center"
          sideOffset={8}
          className={cn(
            "max-w-[240px]",
            "px-3 py-2",
            "bg-gray-900 dark:bg-gray-800",
            "border border-gray-800 dark:border-gray-700",
            "shadow-xl",
            "rounded-lg",
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "z-50"
          )}
        >
          <p className="text-sm font-medium text-white dark:text-gray-100 text-center">
            {tooltip}
          </p>
          <div className={cn(
            "absolute w-2 h-2 rotate-45",
            "bg-gray-900 dark:bg-gray-800",
            "border-gray-800 dark:border-gray-700",
            "data-[side=bottom]:border-t data-[side=bottom]:border-l",
            "data-[side=top]:border-b data-[side=top]:border-r",
            "data-[side=bottom]:-top-1 data-[side=top]:-bottom-1",
            "left-1/2 -translate-x-1/2"
          )} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 