// src/types/ui.ts
import { ReactNode } from "react";
import { ChipProps } from "@material-tailwind/react";

// ProfileInfoCard
export interface ProfileInfoCardProps {
  title: string;
  description?: string;
  details?: Record<string, string>;
  action?: ReactNode;
}

// StatisticsCard
export interface StatisticsCardProps {
  color?: string;
  title: string;
  value: string | number;
  icon: ReactNode;
  footer: ReactNode;
} 

// GenericTable
export type Column<T> = {
  width?: Width<string | number> | undefined;
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
};

export interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string | number;
}

// Pagination
export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}