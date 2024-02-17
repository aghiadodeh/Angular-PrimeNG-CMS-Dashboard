export interface ListResponse<T> {
    data: T[];
    total: number;
    metadata?: any;
}