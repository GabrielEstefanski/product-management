'use client';

import React from 'react';
import { Package, DollarSign, Package2 } from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '../base/Modal';
import { Input } from '../base/Input';
import { Dropdown, DropdownOption } from '../base/Dropdown';
import { MaskedInput } from '../base/MaskedInput';
import { SecondaryButton, PrimaryButton } from '../base/Button';
import { CreateProdutoDTO } from '@/types/produto';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingProduto: any;
  formData: CreateProdutoDTO;
  categoriaOptions: DropdownOption[];
  loading: boolean;
  onFormChange: (field: keyof CreateProdutoDTO, value: string | number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingProduto,
  formData,
  categoriaOptions,
  loading,
  onFormChange,
}) => {
  const handlePriceChange = (rawValue: string) => {
    const priceInCents = parseInt(rawValue) || 0;
    const priceInReais = priceInCents / 100;
    
    onFormChange('preco', priceInReais);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduto ? 'Editar Produto' : 'Adicionar Produto'}
      size="lg"
    >
      <ModalBody>
        <div className="space-y-6">
          <div>
            <Input
              label="Nome do Produto"
              placeholder="Digite o nome do produto..."
              value={formData.nome}
              onChange={(e) => onFormChange('nome', e.target.value)}
              leftIcon={<Package className="w-4 h-4" />}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Dropdown
                label="Categoria"
                options={categoriaOptions}
                value={formData.categoria}
                onChange={(value) => onFormChange('categoria', value)}
                placeholder="Selecione uma categoria"
              />
            </div>
            <div>
              <MaskedInput
                label="Preço"
                value={String(Math.round(formData.preco * 100))}
                onChange={handlePriceChange}
                placeholder="R$ 0,00"
                leftIcon={<DollarSign className="w-4 h-4" />}
              />
            </div>
          </div>
          <div>
            <Input
              label="Quantidade em Estoque"
              type="number"
              placeholder="Digite a quantidade..."
              value={formData.quantidadeEstoque.toString()}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                onFormChange('quantidadeEstoque', value);
              }}
              leftIcon={<Package2 className="w-4 h-4" />}
              min="0"
              max="1000000"
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <SecondaryButton
          onClick={onClose}
          size="md"
        >
          Cancelar
        </SecondaryButton>
        <PrimaryButton
          onClick={onSubmit}
          loading={loading}
          size="md"
        >
          {editingProduto ? 'Atualizar Produto' : 'Criar Produto'}
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
};
