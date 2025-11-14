"use client";

import FormSelect from "@/client/components/ui/form/form-select";
import { Loading } from "@/client/components/ui/loading";
import { type CourseEntity } from "@/client/services/courses";
import { useRegistrationForm } from "../registration-form";

type Step3CourseSelectionProps = {
  courses: CourseEntity[];
  isLoading: boolean;
};

export function Step3CourseSelection({ courses, isLoading }: Step3CourseSelectionProps) {
  const form = useRegistrationForm();
  const courseId = form.watch("courseId");

  const courseItems = courses.map((course) => ({
    value: course.id,
    label: course.title,
  }));

  const selectedCourse = courses.find((c) => c.id === courseId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Workshop</h1>
      <p className="text-gray-600 mb-8">Select the course you want to register for</p>

      <FormSelect name="courseId" label="Select a Course" items={courseItems} required />

      {selectedCourse && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Selected Course Details:</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Code:</strong> {selectedCourse.code}
            </p>
            {selectedCourse.description && (
              <p>
                <strong>Description:</strong> {selectedCourse.description}
              </p>
            )}
            {selectedCourse.durationHours && (
              <p>
                <strong>Duration:</strong> {selectedCourse.durationHours} hours
              </p>
            )}
            {selectedCourse.startDate && (
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedCourse.startDate).toLocaleDateString()}
              </p>
            )}
          </div>
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
