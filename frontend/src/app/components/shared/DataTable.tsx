'use client';

import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '../base/Input';
import { Dropdown, DropdownOption } from '../base/Dropdown';
import { Button, SecondaryButton } from '../base/Button';

export interface Column<T> {
  key: keyof T;
  title: string;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: PaginationProps;
  emptyMessage?: string;
  className?: string;
  filterOptions?: {
    categoryOptions?: DropdownOption[];
    statusOptions?: DropdownOption[];
  };
  filterValues?: {
    category?: string;
    status?: string;
  };
  onFilterChange?: (type: string, value: string) => void;
  onApplyFilters?: () => void;
  totalCount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  customHeader?: React.ReactNode;
}

const TableSkeleton: React.FC<{ columns: number; rows: number }> = ({ columns, rows }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-100 h-10 rounded-t mb-2"></div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex border-b border-gray-100 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 px-4"
            >
              <div className="bg-gray-100 h-3 rounded"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
      <div className="text-xs text-gray-600">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>
      
      <div className="flex items-center space-x-2">
        <SecondaryButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="sm"
        >
          Anterior
        </SecondaryButton>
        
        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            variant={page === currentPage ? 'primary' : 'secondary'}
            size="sm"
            className={page === '...' ? 'cursor-default' : ''}
          >
            {page}
          </Button>
        ))}
        
        <SecondaryButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="sm"
        >
          Próximo
        </SecondaryButton>
      </div>
    </div>
  );
};

const SortableHeader: React.FC<{
  title: string;
  columnKey: string;
  sortable?: boolean;
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  width?: string;
}> = ({ 
  title, 
  columnKey, 
  sortable = false, 
  currentSortBy, 
  currentSortOrder, 
  onSortChange,
  width 
}) => {
  const isActive = currentSortBy === columnKey;
  
  const handleSort = () => {
    if (!sortable || !onSortChange) return;
    
    const newOrder = isActive && currentSortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(columnKey, newOrder);
  };

  return (
    <th
      scope="col"
      className={`px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wide ${
        width ? width : ''
      } ${sortable ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
      onClick={handleSort}
    >
      <div className="flex items-center justify-between">
        <span>{title}</span>
        {sortable && (
          <div className="flex flex-col ml-1">
            <ChevronUp 
              className={`w-3 h-3 ${
                isActive && currentSortOrder === 'asc' 
                  ? 'text-gray-700' 
                  : 'text-gray-400'
              }`} 
            />
            <ChevronDown 
              className={`w-3 h-3 -mt-1 ${
                isActive && currentSortOrder === 'desc' 
                  ? 'text-gray-700' 
                  : 'text-gray-400'
              }`} 
            />
          </div>
        )}
      </div>
    </th>
  );
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchPlaceholder = "Pesquisar...",
  onSearch,
  pagination,
  emptyMessage = "Nenhum dado encontrado",
  className = "",
  sortBy,
  sortOrder,
  onSortChange,
  customHeader,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm ${className}`}>
        <div className="p-3 border-b border-gray-100">
          <div className="bg-gray-100 h-8 rounded w-64 animate-pulse"></div>
        </div>
        <TableSkeleton columns={columns.length} rows={5} />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex-1 max-w-md">
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          {customHeader && (
            <div className="flex items-center space-x-3">
              {customHeader}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <SortableHeader
                  key={index}
                  title={column.title}
                  columnKey={String(column.key)}
                  sortable={column.sortable}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSortChange={onSortChange}
                  width={column.width}
                />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {!data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-75"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-700"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
