"use client";

import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";
import type { CourseEntity } from "@/client/services/courses";
import { CourseCard } from "./course-card";

type CourseListProps = {
  courses: CourseEntity[];
  isLoading?: boolean;
  onEdit?: (course: CourseEntity) => void;
  onDelete?: (course: CourseEntity) => void;
  onCreateClick?: () => void;
  className?: string;
};

export function CourseList({
  courses,
  isLoading,
  onEdit,
  onDelete,
  onCreateClick,
  className,
}: CourseListProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 rounded-lg border bg-muted animate-pulse"
            aria-label="Loading course"
          />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 gap-4", className)}>
        <p className="text-muted-foreground text-sm">No courses yet</p>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          Create a course to begin scheduling trainee programmes.
        </p>
        {onCreateClick && (
          <Button onClick={onCreateClick} className="mt-2">
            Create course
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
