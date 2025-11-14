"use client";

import { useState, useMemo } from "react";
import { Loading } from "@/client/components/ui/loading";
import { Input } from "@/client/components/ui/input";
import { type CourseEntity } from "@/client/services/courses";
import { useRegistrationForm } from "../registration-form";
import { Search, ArrowRight, Clock, Calendar } from "lucide-react";
import { cn } from "@/client/lib/utils";

type Step3CourseSelectionProps = {
  courses: CourseEntity[];
  isLoading: boolean;
};

export function Step3CourseSelection({ courses, isLoading }: Step3CourseSelectionProps) {
  const form = useRegistrationForm();
  const courseId = form.watch("courseId");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;

    const query = searchQuery.toLowerCase();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  const handleCourseSelect = (id: string) => {
    form.setValue("courseId", id, { shouldValidate: true });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Workshop</h1>
        <p className="text-gray-600">Select the course you want to register for</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search courses by title, code, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          inputSize="default"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={courseId === course.id}
              onSelect={() => handleCourseSelect(course.id)}
            />
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm">
          <strong>Note:</strong>
          <br />
          We will contact you regarding a $30 refundable deposit.
          <br />
          This deposit will be returned upon course completion.
        </p>
      </div>
    </div>
  );
}

type CourseCardProps = {
  course: CourseEntity;
  isSelected: boolean;
  onSelect: () => void;
};

function CourseCard({ course, isSelected, onSelect }: CourseCardProps) {
  const formatDuration = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `~${minutes} min${minutes !== 1 ? "s" : ""}`;
    }
    if (hours === 1) return "~1 hour";
    return `~${hours} hours`;
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative bg-white rounded-lg border-2 transition-all duration-200 text-left overflow-hidden hover:shadow-lg group",
        isSelected
          ? "border-blue-600 shadow-md ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300",
      )}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Workshop
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {course.durationHours > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.durationHours)}</span>
                </div>
              )}
              {course.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(course.startDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div
            className={cn(
              "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-400 group-hover:bg-gray-200",
            )}
          >
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        {course.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {course.code}
          </span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full" />
        </div>
      )}
    </button>
  );
}
