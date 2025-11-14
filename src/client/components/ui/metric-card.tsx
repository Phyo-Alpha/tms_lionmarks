import { cn } from "@/client/lib/utils";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ title, value, trend, subtitle, icon, className }: MetricCardProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp className="size-3" />
                ) : (
                  <ArrowDown className="size-3" />
                )}
                {trend.value}
              </span>
            )}
          </div>
          {(trend?.label || subtitle) && (
            <div className="mt-2 flex items-center gap-1">
              {trend?.label && (
                <>
                  <TrendingUp className="size-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{trend.label}</p>
                </>
              )}
              {subtitle && !trend?.label && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
