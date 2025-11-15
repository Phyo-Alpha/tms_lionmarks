"use client";

import { useMemo, useState } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Badge } from "@/client/components/ui/badge";
import { AttendanceProgress } from "@/client/components/ui/attendance-progress";
import { Page } from "@/client/components/layout/page";
import { Typography } from "@/client/components/common/typography";
import { Stack } from "@/client/components/layout/stack";
import { cn } from "@/client/lib/utils";
import { Check } from "lucide-react";

// Mock data - Replace with actual API calls
const mockStudents = [
  {
    id: "1",
    name: "John Doe",
    enrolledOn: "21/10/2025",
    sessions: [
      { id: "am", label: "AM", completed: true },
      { id: "pm", label: "PM", completed: true },
      { id: "am2", label: "AM", completed: false },
      { id: "pm2", label: "PM", completed: false },
      { id: "pm_assm", label: "PM ASSM", completed: false },
      { id: "not_yet", label: "Not Yet Test", completed: false },
    ],
    taxInvoice: "Done",
    outstandingAmount: "$0.00",
    sfc: "Done",
    courseFeePaymentStatus: "Update Payment",
    depositPaymentStatus: "Deposit Proof Uploaded",
  },
  {
    id: "2",
    name: "Jane Smith",
    enrolledOn: "06/10/2025",
    sessions: [
      { id: "am", label: "AM", completed: false },
      { id: "pm", label: "PM", completed: false },
      { id: "am2", label: "AM", completed: false },
      { id: "pm2", label: "PM", completed: false },
      { id: "pm_assm", label: "PM ASSM", completed: false },
      { id: "not_yet", label: "Not Yet Test", completed: false },
    ],
    taxInvoice: "NA",
    outstandingAmount: "$312.00",
    sfc: "NA",
    courseFeePaymentStatus: "Update Payment",
    depositPaymentStatus: "Deposit Proof Uploaded",
  },
  {
    id: "3",
    name: "Mike Johnson",
    enrolledOn: "07/10/2025",
    sessions: [
      { id: "am", label: "AM", completed: true },
      { id: "pm", label: "PM", completed: true },
      { id: "am2", label: "AM", completed: true },
      { id: "pm2", label: "PM", completed: true },
      { id: "pm_assm", label: "PM ASSM", completed: true },
      { id: "not_yet", label: "Not Yet Test", completed: true },
    ],
    taxInvoice: "Done",
    outstandingAmount: "$0.00",
    sfc: "Done",
    courseFeePaymentStatus: "Paid",
    depositPaymentStatus: "Deposit Proof Uploaded",
  },
  {
    id: "4",
    name: "Sarah Williams",
    enrolledOn: "22/09/2025",
    sessions: [
      { id: "am", label: "AM", completed: false },
      { id: "pm", label: "PM", completed: false },
      { id: "am2", label: "AM", completed: false },
      { id: "pm2", label: "PM", completed: false },
      { id: "pm_assm", label: "PM ASSM", completed: false },
      { id: "not_yet", label: "Not Yet Test", completed: false },
    ],
    taxInvoice: "Done",
    outstandingAmount: "$0.00",
    sfc: "Done",
    courseFeePaymentStatus: "Update Payment",
    depositPaymentStatus: "Deposit Proof Uploaded",
  },
  {
    id: "5",
    name: "David Brown",
    enrolledOn: "22/09/2025",
    sessions: [
      { id: "am", label: "AM", completed: false },
      { id: "pm", label: "PM", completed: false },
      { id: "am2", label: "AM", completed: false },
      { id: "pm2", label: "PM", completed: false },
      { id: "pm_assm", label: "PM ASSM", completed: false },
      { id: "not_yet", label: "Not Yet Test", completed: false },
    ],
    taxInvoice: "NA",
    outstandingAmount: "$312.00",
    sfc: "NA",
    courseFeePaymentStatus: "Update Payment",
    depositPaymentStatus: "Deposit Proof Uploaded",
  },
  {
    id: "6",
    name: "Emily Davis",
    enrolledOn: "05/09/2025",
    sessions: [
      { id: "am", label: "AM", completed: true },
      { id: "pm", label: "PM", completed: true },
      { id: "am2", label: "AM", completed: true },
      { id: "pm2", label: "PM", completed: true },
      { id: "pm_assm", label: "PM ASSM", completed: true },
      { id: "not_yet", label: "Not Yet Test", completed: true },
    ],
    taxInvoice: "Done",
    outstandingAmount: "$0.00",
    sfc: "Done",
    courseFeePaymentStatus: "Paid",
    depositPaymentStatus: "Deposit Proof Uploaded",
  },
];

const FILTER_OPTIONS = [
  { label: "VIEW ALL", value: "all" },
  { label: "UPCOMING CLASSES", value: "upcoming" },
  { label: "PRIORITY SIGN UP", value: "priority" },
] as const;

export default function StudentsPage() {
  const [showAttendanceView, setShowAttendanceView] = useState(false);
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString
        .withDefault("")
        .withOptions({ history: "replace", clearOnDefault: true }),
      filter: parseAsString.withDefault("all").withOptions({ history: "replace" }),
    },
    { shallow: false },
  );

  const filteredStudents = useMemo(() => {
    let result = mockStudents;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((student) => student.name.toLowerCase().includes(searchLower));
    }

    if (filters.filter === "upcoming") {
      // Filter logic for upcoming classes
      result = result.filter((student) => student.sessions.some((s) => !s.completed));
    }

    if (filters.filter === "priority") {
      // Filter logic for priority sign up
      result = result.filter((student) => student.courseFeePaymentStatus === "Update Payment");
    }

    return result;
  }, [filters]);

  return (
    <Page>
      <Stack>
        <div className="flex items-center justify-between">
          <Typography.H1>SFC</Typography.H1>
          <div className="flex gap-2">
            <Button variant="outline">Resources</Button>
            <Button variant="outline">SFC Pay</Button>
            <Button variant="outline">Classes</Button>
            <Button>Admin</Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Student Name: <span className="font-semibold">Class Name</span>
        </p>

        {/* Filter Buttons */}
        <div className="flex gap-3">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={filters.filter === option.value ? "default" : "outline"}
              onClick={() => setFilters({ filter: option.value })}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between">
          <Input
            className="max-w-md"
            placeholder="Search by student name..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
          <Button variant="outline" onClick={() => setShowAttendanceView(!showAttendanceView)}>
            {showAttendanceView ? "View Full Details" : "View Attendance Progress"}
          </Button>
        </div>

        {/* Student List */}
        <div className="space-y-4">
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="font-semibold text-gray-700">{index + 1}.</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">Enrolled on: {student.enrolledOn}</p>
                    </div>
                  </div>

                  {showAttendanceView ? (
                    <div className="space-y-3">
                      <AttendanceProgress sessions={student.sessions} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Tax Inv.</p>
                        <div className="mt-1 flex items-center gap-1">
                          <Badge
                            variant={student.taxInvoice === "Done" ? "default" : "secondary"}
                            className={cn(
                              "text-xs",
                              student.taxInvoice === "Done" && "bg-green-100 text-green-700",
                            )}
                          >
                            {student.taxInvoice}
                          </Badge>
                          {student.taxInvoice === "Done" && (
                            <Check className="size-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Outstanding Amount</p>
                        <p
                          className={cn(
                            "mt-1 font-semibold",
                            student.outstandingAmount === "$0.00"
                              ? "text-green-600"
                              : "text-red-600",
                          )}
                        >
                          {student.outstandingAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">SFC</p>
                        <Badge
                          variant={student.sfc === "Done" ? "default" : "secondary"}
                          className={cn(
                            "mt-1 text-xs",
                            student.sfc === "Done" && "bg-green-100 text-green-700",
                          )}
                        >
                          {student.sfc}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-500">Course Fee Payment Status</p>
                        <Button
                          variant={
                            student.courseFeePaymentStatus === "Paid" ? "default" : "outline"
                          }
                          size="sm"
                          className={cn(
                            "mt-1 h-7 text-xs",
                            student.courseFeePaymentStatus === "Paid" &&
                              "bg-green-600 hover:bg-green-700",
                          )}
                        >
                          {student.courseFeePaymentStatus}
                        </Button>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Deposit Payment Status</p>
                        <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                          {student.depositPaymentStatus}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Stack>
    </Page>
  );
}
