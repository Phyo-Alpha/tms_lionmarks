import { Check } from "lucide-react";
import { cn } from "@/client/lib/utils";

interface AttendanceSession {
  id: string;
  label: string;
  completed: boolean;
}

interface AttendanceProgressProps {
  sessions: AttendanceSession[];
  className?: string;
}

export function AttendanceProgress({ sessions, className }: AttendanceProgressProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {sessions.map((session) => (
        <div key={session.id} className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full border-2",
              session.completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 bg-white text-gray-400",
            )}
          >
            {session.completed && <Check className="size-5" />}
          </div>
          <span className="text-[10px] text-gray-600">{session.label}</span>
        </div>
      ))}
    </div>
  );
}
