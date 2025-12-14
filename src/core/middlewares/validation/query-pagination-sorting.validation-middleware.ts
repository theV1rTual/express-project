import { SortDirection } from '../../types/sort-direction';
import { PaginationAndSorting } from '../../types/pagination-and-sorting';
import { query } from 'express-validator';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Descending;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>,
  defaultSortBy: T = Object.values(sortFieldsEnum)[0] ?? (DEFAULT_SORT_BY as T),
) {
  const allowedSortFields = Object.values(sortFieldsEnum);

  return [
    query('searchNameTerm').optional().isString().trim().isLength({ max: 100 }),
    query('pageNumber')
      .default(DEFAULT_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),

    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),

    query('sortBy')
      .default(defaultSortBy)
      .isIn(allowedSortFields)
      .withMessage(
        `Invalid sort field.Allowed values: ${allowedSortFields.join(', ')}`,
      ),

    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
      ),
  ];
}
