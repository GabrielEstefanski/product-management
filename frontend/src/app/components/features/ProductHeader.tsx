'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { PrimaryButton } from '../base/Button';

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ onAddProduct }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
            Produtos
          </h2>
          <p className="text-sm text-gray-500">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <PrimaryButton
            onClick={onAddProduct}
            leftIcon={<Plus className="w-4 h-4" />}
            size="md"
            className="w-full sm:w-auto sm:min-w-fit"
          >
            Adicionar Produto
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
