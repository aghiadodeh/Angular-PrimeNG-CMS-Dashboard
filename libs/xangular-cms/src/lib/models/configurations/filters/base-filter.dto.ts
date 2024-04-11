export interface BaseFilterDto {
  page?: number;
  per_page?: number;
  pagination?: boolean;
  search?: string;
  sortDir?: "DESC" | "ASC";
  sortKey?: string;
}
