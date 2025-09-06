'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { PrimaryButton } from '../base/Button';

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ onAddProduct }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Produtos
          </h2>
          <p className="text-sm text-gray-500">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <PrimaryButton
          onClick={onAddProduct}
          leftIcon={<Plus className="w-4 h-4" />}
          size="md"
        >
          Adicionar Produto
        </PrimaryButton>
      </div>
    </div>
  );
};
