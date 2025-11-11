"use client";

import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";
import type { CourseEntity } from "@/client/services/courses";
import dayjs from "dayjs";
import { ArrowRight, Calendar, Clock, GraduationCap, Users } from "lucide-react";

type CourseCardProps = {
  course: CourseEntity;
  onEdit?: (course: CourseEntity) => void;
  onDelete?: (course: CourseEntity) => void;
  className?: string;
};

export function CourseCard({ course, onEdit, onDelete, className }: CourseCardProps) {
  const startDate = course.startDate ? dayjs(course.startDate).format("DD MMM YYYY") : null;
  const endDate = course.endDate ? dayjs(course.endDate).format("DD MMM YYYY") : null;
  const scheduleText = startDate
    ? endDate
      ? `${startDate} – ${endDate}`
      : startDate
    : "Schedule pending";

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 bg-card text-card-foreground rounded-sm border shadow-sm",
        className,
      )}
    >
      {/* Header with gradient background */}
      <div className="relative min-h-54 bg-gradient-to-br from-sbf-dark-blue to-sbf-teal-blue flex items-center justify-center">
        <GraduationCap className="h-16 w-16 text-white/20" />
        <div className="absolute top-3 right-3">
          <Badge
            variant={course.isPublished ? "default" : "secondary"}
            className="text-xs bg-white/90 text-foreground"
          >
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 pb-2 px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-muted-foreground font-mono mb-1 block">
              {course.code}
            </span>
            <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2">
              {course.title}
            </h3>
          </div>
        </div>

        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.durationHours} hrs</span>
          </div>
          {course.capacity && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{course.capacity} learners</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{scheduleText}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 pb-4 px-6 mt-auto border-t">
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(course);
              }}
              className="h-8 text-xs"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course);
              }}
            >
              Delete
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full group-hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(course);
          }}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
