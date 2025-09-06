'use client';

import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Package2 } from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '../base/Modal';
import { Input } from '../base/Input';
import { Dropdown, DropdownOption } from '../base/Dropdown';
import { MaskedInput } from '../base/MaskedInput';
import { SecondaryButton, PrimaryButton } from '../base/Button';
import { CreateProdutoDTO } from '@/types/produto';

interface ValidationErrors {
  [key: string]: string | undefined;
}

interface ValidationRule {
  required?: boolean;
  maxLength?: number;
  minValue?: number;
  validator?: (value: any) => string | undefined;
}

interface ValidationConfig {
  [key: string]: ValidationRule;
}

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

const validationConfig: ValidationConfig = {
  nome: {
    required: true,
    maxLength: 100,
    validator: (value: string) => {
      if (!value || value.trim() === '') return 'Nome é obrigatório';
      if (value.length > 100) return 'Nome deve ter no máximo 100 caracteres';
      return undefined;
    }
  },
  categoria: {
    required: true,
    maxLength: 50,
    validator: (value: string) => {
      if (!value || value.trim() === '') return 'Categoria é obrigatória';
      if (value.length > 50) return 'Categoria deve ter no máximo 50 caracteres';
      return undefined;
    }
  },
  preco: {
    minValue: 0,
    validator: (value: number) => {
      if (value < 0) return 'Preço deve ser >= 0';
      return undefined;
    }
  },
  quantidadeEstoque: {
    minValue: 0,
    validator: (value: number) => {
      if (value < 0) return 'Quantidade em estoque deve ser >= 0';
      return undefined;
    }
  }
};

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
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: keyof CreateProdutoDTO, value: any): string | undefined => {
    const rule = validationConfig[field];
    if (!rule) return undefined;
    
    if (rule.validator) {
      return rule.validator(value);
    }
    
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field} é obrigatório`;
    }
    
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `${field} deve ter no máximo ${rule.maxLength} caracteres`;
    }
    
    if (rule.minValue !== undefined && typeof value === 'number' && value < rule.minValue) {
      return `${field} deve ser >= ${rule.minValue}`;
    }
    
    return undefined;
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field as keyof CreateProdutoDTO, formData[field as keyof CreateProdutoDTO]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const handlePriceChange = (rawValue: string) => {
    const priceInCents = parseInt(rawValue) || 0;
    const priceInReais = priceInCents / 100;
    
    onFormChange('preco', priceInReais);
    
    const error = validateField('preco', priceInReais);
    setErrors(prev => ({ ...prev, preco: error }));
  };

  const handleFormChange = (field: keyof CreateProdutoDTO, value: string | number) => {
    onFormChange(field, value);
    
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = () => {
    if (validateAllFields()) {
      onSubmit();
    }
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
              onChange={(e) => handleFormChange('nome', e.target.value)}
              leftIcon={<Package className="w-4 h-4" />}
              error={errors.nome}
              variant={errors.nome ? 'error' : 'default'}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Dropdown
                label="Categoria"
                options={categoriaOptions}
                value={formData.categoria}
                onChange={(value) => handleFormChange('categoria', value)}
                placeholder="Selecione uma categoria"
                error={errors.categoria}
              />
            </div>
            <div>
              <MaskedInput
                label="Preço"
                value={String(Math.round(formData.preco * 100))}
                onChange={handlePriceChange}
                placeholder="R$ 0,00"
                leftIcon={<DollarSign className="w-4 h-4" />}
                error={errors.preco}
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
                handleFormChange('quantidadeEstoque', value);
              }}
              leftIcon={<Package2 className="w-4 h-4" />}
              min="0"
              max="1000000"
              error={errors.quantidadeEstoque}
              variant={errors.quantidadeEstoque ? 'error' : 'default'}
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
          onClick={handleSubmit}
          loading={loading}
          size="md"
        >
          {editingProduto ? 'Atualizar Produto' : 'Criar Produto'}
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
};
