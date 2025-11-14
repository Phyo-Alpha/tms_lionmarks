import { MetricCard } from "@/client/components/ui/metric-card";
import { AreaChart } from "@/client/components/ui/area-chart";
import { Button } from "@/client/components/ui/button";
import { DollarSign, Users, UserCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Page, PageBody, PageHeader } from "@/client/components/layout/page";

const mockChartData = [
  { date: "Jun 1", value: 320 },
  { date: "Jun 3", value: 450 },
  { date: "Jun 5", value: 380 },
  { date: "Jun 7", value: 520 },
  { date: "Jun 9", value: 480 },
  { date: "Jun 12", value: 620 },
  { date: "Jun 15", value: 750 },
  { date: "Jun 18", value: 680 },
  { date: "Jun 21", value: 820 },
  { date: "Jun 24", value: 890 },
  { date: "Jun 27", value: 950 },
];

const quickLinks = [
  {
    title: "View Students",
    href: "/admin/students",
  },
  {
    title: "Manage learners",
    href: "/admin/learners",
  },
  {
    title: "Manage courses",
    href: "/admin/courses",
  },
  {
    title: "Course enrolments",
    href: "/admin/registrations",
  },
];

export default function AdminPage() {
  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-gray-900 bg-white">
              <span className="text-sm font-semibold">A</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
          </div>
        </div>
      </PageHeader>

      <PageBody>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value="$1,250.00"
            trend={{ value: "+12.5%", isPositive: true, label: "Trending up this month" }}
            subtitle="Visitors for the last 6 months"
            icon={<DollarSign className="size-6" />}
          />
          <MetricCard
            title="New Customers"
            value="1,234"
            trend={{ value: "-20%", isPositive: false, label: "Down 20% this period" }}
            subtitle="Acquisition needs attention"
            icon={<Users className="size-6" />}
          />
          <MetricCard
            title="Active Accounts"
            value="45,678"
            trend={{ value: "+12.5%", isPositive: true, label: "Strong user retention" }}
            subtitle="Engagement exceed targets"
            icon={<UserCheck className="size-6" />}
          />
          <MetricCard
            title="Growth Rate"
            value="4.5%"
            trend={{ value: "+4", isPositive: true, label: "Steady performance" }}
            subtitle="Meets growth projections"
            icon={<TrendingUp className="size-6" />}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Total Visitors</h2>
              <p className="text-sm text-gray-500">Total for the last 3 months</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Last 3 months
              </Button>
              <Button variant="outline" size="sm">
                Last 30 days
              </Button>
              <Button variant="outline" size="sm">
                Last 7 days
              </Button>
            </div>
          </div>
          <AreaChart data={mockChartData} height={250} color="#8b5cf6" />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="flex gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="outline">{link.title}</Button>
              </Link>
            ))}
          </div>
        </div>
      </PageBody>
    </Page>
  );
}
