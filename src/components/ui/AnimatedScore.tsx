import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Progress } from './Progress';

interface AnimatedScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  className?: string;
}

export function AnimatedScore({ 
  score, 
  size = 'lg',
  showGlow = true,
  className 
}: AnimatedScoreProps) {
  const [currentScore, setCurrentScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 frames
    const increment = score / steps;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      current += increment;
      frame++;

      if (frame === steps) {
        current = score;
        setIsAnimating(false);
        clearInterval(timer);
      }

      setCurrentScore(Math.min(Math.round(current), score));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const sizeClasses = {
    sm: 'w-24 h-24 text-xl',
    md: 'w-32 h-32 text-2xl',
    lg: 'w-44 h-44 text-3xl'
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div className={cn(
        'relative flex flex-col items-center justify-center',
        sizeClasses[size],
        'rounded-full border-8 border-gray-100 dark:border-gray-800',
        'bg-white dark:bg-gray-900'
      )}>
        <div className="text-center z-10">
          <div className={cn(
            "font-bold transition-colors duration-300",
            currentScore < 40 && "text-red-500",
            currentScore >= 40 && currentScore < 70 && "text-yellow-500",
            currentScore >= 70 && "text-green-500"
          )}>
            {currentScore}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Overall Score
          </div>
        </div>
      </div>

      {/* Progress ring */}
      <div className="absolute inset-0 -z-10">
        <Progress 
          value={currentScore} 
          className={cn(
            "h-full w-full rounded-full transition-all duration-300",
            "[&>div]:h-full [&>div]:rounded-full",
            getScoreColor(currentScore)
          )}
        />
      </div>

      {/* Glow effects */}
      {showGlow && (
        <>
          <div className={cn(
            "absolute inset-0 rounded-full",
            isAnimating ? 'animate-pulse' : 'animate-glow',
            currentScore < 40 && "bg-red-500/10",
            currentScore >= 40 && currentScore < 70 && "bg-yellow-500/10",
            currentScore >= 70 && "bg-green-500/10",
            "blur-2xl"
          )} />
          <div className={cn(
            "absolute inset-0 rounded-full",
            !isAnimating && "after:absolute after:inset-0 after:rounded-full after:animate-pulse-slow",
            currentScore < 40 && "after:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
            currentScore >= 40 && currentScore < 70 && "after:shadow-[0_0_30px_rgba(234,179,8,0.5)]",
            currentScore >= 70 && "after:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          )} />
        </>
      )}
    </div>
  );
} 