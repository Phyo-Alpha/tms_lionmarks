import { ComponentPropsWithoutRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/client/lib/utils";
import { Links } from "./link";
import { Typography } from "./typography";

interface StatsCardProps extends ComponentPropsWithoutRef<typeof Card> {
  label: string;
  value: string | number;
  link?: string;
  labelProps?: ComponentPropsWithoutRef<typeof CardHeader>;
  valueProps?: ComponentPropsWithoutRef<typeof CardContent>;
}
function StatsCard({
  label,
  value,
  link,
  labelProps = {},
  valueProps = {},
  className,
  ...props
}: StatsCardProps) {
  const { className: labelClassName, ...restLabelProps } = labelProps;
  const { className: valueClassName, ...restValueProps } = valueProps;
  return (
    <Card className={cn(className, "min-w-90 min-h-36")} {...props}>
      <CardHeader
        {...restLabelProps}
        className={cn(labelClassName, "flex flex-row items-center justify-between")}
      >
        <CardTitle>{label}</CardTitle>
        {link && <Links.Chevron href={link} />}
      </CardHeader>
      <CardContent {...restValueProps} className={cn(valueClassName)}>
        <Typography.PLarge>{value}</Typography.PLarge>
      </CardContent>
    </Card>
  );
}
StatsCard.displayName = "StatsCard";
export { StatsCard, type StatsCardProps };
