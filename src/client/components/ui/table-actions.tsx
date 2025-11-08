import { Button } from "@/client/components/ui/button";
import { Eye, Trash2, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import React from "react";

interface TableActionsProps {
  id: string | number;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onToggleStatus?: () => void;
  isActive?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  showToggleStatus?: boolean;
  editLink?: string;
  viewLink?: string;
}

export const TableActions: React.FC<TableActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  isActive,
  showEdit = true,
  showDelete = false,
  showView = false,
  showToggleStatus = false,
  editLink,
  viewLink,
}) => (
  <div className="flex items-center space-x-4">
    {/* Edit Button */}
    {showEdit && (
      <div>
        {editLink ? (
          <Link
            href={editLink}
            className="text-highlight underline hover:no-underline"
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click
              if (onEdit) onEdit();
            }}
          >
            Edit
          </Link>
        ) : (
          <button
            className="text-highlight cursor-pointer border-none bg-transparent underline hover:no-underline"
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click
              if (onEdit) onEdit();
            }}
          >
            Edit
          </button>
        )}
      </div>
    )}
    {/* View Button */}
    {showView && (
      <div>
        {viewLink ? (
          <Link
            href={viewLink}
            className="text-highlight underline hover:no-underline"
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click
              if (onView) onView();
            }}
          >
            View
          </Link>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            title="View"
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click
              if (onView) onView();
            }}
          >
            <Eye className="size-4" />
          </Button>
        )}
      </div>
    )}

    {/* Activate/Deactivate Button */}
    {showToggleStatus && (
      <Button
        variant="ghost"
        size="icon"
        title={isActive ? "Deactivate" : "Activate"}
        onClick={(event) => {
          event.stopPropagation(); // Prevent row click
          if (onToggleStatus) onToggleStatus();
        }}
      >
        {isActive ? <UserCheck className="size-4" /> : <UserX className="size-4" />}
      </Button>
    )}

    {/* Delete Button */}
    {showDelete && (
      <Button
        variant="ghost"
        size="icon"
        title="Delete"
        onClick={(event) => {
          event.stopPropagation(); // Prevent row click
          if (onDelete) onDelete();
        }}
      >
        <Trash2 className="text-primary size-4" />
      </Button>
    )}
  </div>
);
