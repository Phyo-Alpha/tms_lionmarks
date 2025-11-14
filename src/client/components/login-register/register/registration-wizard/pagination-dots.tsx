"use client";

type PaginationDotsProps = {
  total: number;
  active: number; // 0-indexed
};

export const PaginationDots = ({ total, active }: PaginationDotsProps) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            i === active
              ? "size-2.5 rounded-full bg-primary"
              : "size-2.5 rounded-full bg-gray-300"
          }
        />
      ))}
    </div>
  );
};
