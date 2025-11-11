import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/client/components/ui/card";
import Link from "next/link";

const quickLinks = [
  {
    title: "Manage learners",
    description: "Create, edit, and review trainee profiles and contact details.",
    href: "/admin/learners",
  },
  {
    title: "Manage courses",
    description: "Publish courses, update schedules, and track capacity.",
    href: "/admin/courses",
  },
  {
    title: "Course enrolments",
    description: "Review registrations and learner progress for each course.",
    href: "/admin/registrations",
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 lg:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Trainee management
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin control centre</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Configure courses, onboard learners, and monitor registrations to keep your trainee programmes
          organised and compliant.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.href} className="transition hover:shadow-md">
            <CardHeader>
              <CardTitle>{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={link.href}
                className="text-primary inline-flex items-center gap-2 text-sm font-medium hover:underline"
              >
                Go to {link.title.toLowerCase()}
                <span aria-hidden className="text-lg">
                  →
                </span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
