import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PaginationProps } from "@/types/ui";

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  const handlePrev = () => {
    if (page > 1) onChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onChange(page + 1);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <IconButton
        variant="text"
        onClick={handlePrev}
        disabled={page === 1}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </IconButton>

      {pages.map((p) => (
        <IconButton
          key={p}
          variant={p === page ? "filled" : "text"}
          color="gray"
          onClick={() => onChange(p)}
        >
          {p}
        </IconButton>
      ))}

      <IconButton
        variant="text"
        onClick={handleNext}
        disabled={page === totalPages}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </IconButton>
    </div>
  );
};

export default Pagination;