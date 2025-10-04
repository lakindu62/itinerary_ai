'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1 relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 z-10
                  ${
                    isCompleted
                      ? 'bg-card border border-border text-card-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              <p
                className={`
                  text-xs text-center
                  ${
                    isCompleted || isCurrent
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }
                `}
              >
                {label}
              </p>
              {index < totalSteps - 1 && (
                <div
                  className={`
                    absolute top-5 left-1/2 w-full h-1 -translate-x-1/2
                    ${
                      isCompleted || (isCurrent && index < currentStep - 1)
                        ? 'bg-primary'
                        : 'bg-muted'
                    }
                  `}
                  style={{
                    width: 'calc(100% - 2.5rem)',
                    left: 'calc(94% + 1.25rem)'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
