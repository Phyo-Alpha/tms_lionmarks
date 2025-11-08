import { cn } from "@/client/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

export type StepperProps = {
  title: ReactNode;
  steps: {
    title: ReactNode;
    content: ReactNode;
  }[];
  className?: string;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};
export function Stepper({ title, steps, className, activeIndex, setActiveIndex }: StepperProps) {
  return (
    <div className={cn("flex flex-col lg:flex-row lg:gap-4", className)}>
      <div className="flex flex-col gap-8">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex lg:flex-col lg:gap-1 lg:pl-5">
          {steps.map(({ title }, index) => (
            <Button
              variant="ghost"
              className={cn(
                "flex h-fit flex-1 flex-col justify-between gap-2 p-0 hover:bg-transparent lg:h-auto lg:flex-none lg:flex-row **:transition-colors **:duration-200",
                index <= activeIndex && "hover:text-primary",
              )}
              disabled={index > activeIndex}
              key={index}
              onClick={() => index <= activeIndex && setActiveIndex(index)}
            >
              <div className="flex w-full flex-1 items-center gap-0.5 lg:h-10 lg:w-auto lg:flex-none lg:flex-col">
                <div
                  className={cn(
                    "-mr-0.5 mb-0 flex-1 border-t-4 opacity-50 lg:-mb-0.5 lg:hidden lg:flex-none lg:border-t-0 lg:border-l-2",
                    index - 1 < activeIndex && "border-success",
                    index - 1 === activeIndex && "border-primary",
                    index === 0 && "border-transparent",
                  )}
                />
                <div
                  className={cn(
                    "size-3 rounded-full lg:size-2",
                    index < activeIndex && "bg-success",
                    index === activeIndex && "bg-primary",
                    index > activeIndex && "bg-muted-foreground",
                  )}
                />
                <div
                  className={cn(
                    "mb-0 -ml-0.5 flex-1 border-t-4 opacity-50 lg:-mb-0.5 lg:ml-0 lg:border-t-0 lg:border-l-2",
                    index === activeIndex && "border-primary",
                    index < activeIndex && "border-success",
                    index === steps.length - 1 && "border-transparent lg:hidden",
                  )}
                />
              </div>
              <span className={cn("-mt-1 hidden flex-1 self-start text-start lg:block")}>
                {title}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex w-full justify-between gap-1 lg:hidden">
          {activeIndex !== 0 && (
            <Button
              variant="ghost"
              className="w-20"
              onClick={() => setActiveIndex((step) => step - 1)}
            >
              <ArrowLeft /> Back
            </Button>
          )}
          <p className="mx-auto flex items-center py-2 text-center font-bold">
            {steps[activeIndex].title}
          </p>
          {activeIndex !== 0 && <div className="w-20" />}
        </div>
      </div>
      <Card className="flex-1 px-8 py-4">{steps[activeIndex].content}</Card>
    </div>
  );
}
