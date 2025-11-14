"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";

export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

/**
 * @description
 * A reusable form dialog wrapper that provides consistent styling and behavior
 * for create/edit operations across the application.
 *
 * @example
 * ```tsx
 * <FormDialog
 *   open={isCreateOpen}
 *   onOpenChange={setIsCreateOpen}
 *   title="Create learner"
 *   description="Provide basic profile details"
 *   trigger={<Button>Create learner</Button>}
 * >
 *   <LearnerForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
 * </FormDialog>
 * ```
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  className,
  maxHeight = "90vh",
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("overflow-y-auto", className)} style={{ maxHeight }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export interface FormDialogTriggerButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Helper component for common trigger button patterns
 */
export function FormDialogTriggerButton({
  children,
  variant = "default",
  size = "default",
}: FormDialogTriggerButtonProps) {
  return (
    <Button variant={variant} size={size}>
      {children}
    </Button>
  );
}
