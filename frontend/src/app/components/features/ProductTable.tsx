'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '../shared/DataTable';
import { ProdutoDTO } from '@/types/produto';
import { DropdownOption } from '../base/Dropdown';
import { GhostButton } from '../base/Button';
import { PriceRangeFilter } from '../base/PriceRangeFilter';
import { formatDateBR } from '@/lib/date-utils';

interface ProductTableProps {
  produtos: ProdutoDTO[];
  loading: boolean;
  totalCount: number;
  pagination: any;
  totalPages: number;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onEditProduct: (produto: ProdutoDTO) => void;
  onDeleteProduct: (id: string) => void;
  filterOptions: {
    categoryOptions: DropdownOption[];
    statusOptions: DropdownOption[];
  };
  filterValues: {
    category?: string;
    status?: string;
  };
  onFilterChange: (type: string, value: string) => void;
  onApplyFilters: () => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  precoMin?: number;
  precoMax?: number;
  onPrecoMinChange: (value: number) => void;
  onPrecoMaxChange: (value: number) => void;
  onClearPriceFilters: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  produtos,
  loading,
  totalCount,
  pagination,
  totalPages,
  onSearch,
  onPageChange,
  onEditProduct,
  onDeleteProduct,
  filterOptions,
  filterValues,
  onFilterChange,
  onApplyFilters,
  sortBy,
  sortOrder,
  onSortChange,
  precoMin = 0,
  precoMax = 0,
  onPrecoMinChange,
  onPrecoMaxChange,
  onClearPriceFilters,
}) => {
  const columns: Column<ProdutoDTO>[] = [
    {
      key: 'nome',
      title: 'Nome',
      width: 'w-48',
      sortable: true,
    },
    {
      key: 'categoria',
      title: 'Categoria',
      width: 'w-32',
      sortable: true,
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {value}
        </span>
      ),
    },
    {
      key: 'preco',
      title: 'Preço',
      width: 'w-24',
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          R$ {Number(value).toFixed(2).replace('.', ',')}
        </span>
      ),
    },
    {
      key: 'quantidadeEstoque',
      title: 'Estoque',
      width: 'w-20',
      sortable: true,
      render: (value) => (
        <span className={'font-medium'}>
          {value}
        </span>
      ),
    },
    {
      key: 'disponivel',
      title: 'Status',
      width: 'w-24',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Disponível' : 'Indisponível'}
        </span>
      ),
    },
    {
      key: 'dataInclusao',
      title: 'Data de Inclusão',
      width: 'w-32',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {formatDateBR(value as string)}
        </span>
      ),
    },
    {
      key: 'id',
      title: 'Ações',
      width: 'w-32',
      sortable: false,
      render: (_value, row) => (
        <div className="flex items-center space-x-2">
          <GhostButton
            onClick={() => onEditProduct(row)}
            leftIcon={<Edit className="w-4 h-4" />}
            size="sm"
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Editar produto"
          >
            Editar
          </GhostButton>
          <GhostButton
            onClick={() => onDeleteProduct(row.id)}
            leftIcon={<Trash2 className="w-4 h-4" />}
            size="sm"
            className="p-1 text-red-600 hover:text-red-800"
            title="Excluir produto"
          >
            Excluir
          </GhostButton>
        </div>
      ),
    },
  ];

  const customHeader = (
    <PriceRangeFilter
      precoMin={precoMin}
      precoMax={precoMax}
      onPrecoMinChange={onPrecoMinChange}
      onPrecoMaxChange={onPrecoMaxChange}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearPriceFilters}
      loading={loading}
    />
  );

  return (
    <DataTable<ProdutoDTO>
      data={produtos}
      columns={columns}
      loading={loading}
      searchPlaceholder="Buscar produtos..."
      onSearch={onSearch}
      pagination={{
        currentPage: pagination.page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: pagination.pageSize,
        onPageChange: onPageChange,
      }}
      emptyMessage="Nenhum produto encontrado"
      className=""
      filterOptions={filterOptions}
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      onApplyFilters={onApplyFilters}
      totalCount={totalCount}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={onSortChange}
      customHeader={customHeader}
    />
  );
};
