'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import { useToast } from '@/hooks/useToast';
import { ProdutoDTO, CreateProdutoDTO } from '@/types/produto';
import { DropdownOption } from './components/base/Dropdown';
import { ProductHeader } from './components/features/ProductHeader';
import { ProductTable } from './components/features/ProductTable';
import { ProductModal } from './components/features/ProductModal';
import { ConfirmModal } from './components/shared/ConfirmModal';

const categoriaOptions: DropdownOption[] = [
  { value: 'eletronicos', label: 'Eletrônicos' },
  { value: 'roupas', label: 'Roupas' },
  { value: 'livros', label: 'Livros' },
  { value: 'casa', label: 'Casa e Jardim' },
  { value: 'esportes', label: 'Esportes' },
  { value: 'automoveis', label: 'Automóveis' },
];

const disponibilidadeOptions: DropdownOption[] = [
  { value: 'true', label: 'Disponível' },
  { value: 'false', label: 'Indisponível' },
];

export default function Home() {
  const {
    produtos,
    pagination,
    filters,
    loading,
    error,
    totalCount,
    totalPages,
    fetchProdutos,
    searchProdutos,
    createProduto,
    updateProduto,
    deleteProduto,
    setPagination,
  } = useProdutos();

  const { showSuccess, showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedDisponibilidade, setSelectedDisponibilidade] = useState('');

  const [precoMin, setPrecoMin] = useState<number>(0);
  const [precoMax, setPrecoMax] = useState<number>(0);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editingProduto, setEditingProduto] = useState<ProdutoDTO | null>(null);
  const [formData, setFormData] = useState<CreateProdutoDTO>({
    nome: '',
    categoria: '',
    preco: 0,
    quantidadeEstoque: 0,
  });

  useEffect(() => {
    fetchProdutos().catch(() => {
      showError('Erro ao carregar produtos');
    });
  }, []);

  useEffect(() => {
    if (error) {
      showError(error.message);
    }
  }, [error]);

  const applyFilters = useCallback(() => {
    const newFilters = {
      nome: searchQuery || undefined,
      categoria: selectedCategoria || undefined,
      disponivel: selectedDisponibilidade ? selectedDisponibilidade === 'true' : undefined,
      precoMin: precoMin > 0 ? precoMin : undefined,
      precoMax: precoMax > 0 ? precoMax : undefined,
    };

    const newPagination = {
      ...pagination,
      page: 1, 
      sortBy: pagination.sortBy || undefined,
      sortOrder: pagination.sortOrder || undefined,
    };

    fetchProdutos(newPagination, newFilters).catch(() => {
      showError('Erro ao aplicar filtros');
    });
  }, [searchQuery, selectedCategoria, selectedDisponibilidade, precoMin, precoMax, pagination, fetchProdutos, showError]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      applyFilters();
    } else {
      searchProdutos(query).catch(() => {
        showError('Erro ao pesquisar produtos');
      });
    }
  }, [applyFilters, searchProdutos, showError]);

  const handlePageChange = useCallback((page: number) => {
    const newPagination = { ...pagination, page };
    setPagination(newPagination);
    fetchProdutos(newPagination, filters).catch(() => {
      showError('Erro ao carregar página');
    });
  }, [pagination, filters, fetchProdutos, showError]);

  const handleFilterChange = useCallback((type: string, value: string) => {
    switch (type) {
      case 'category':
        setSelectedCategoria(value);
        break;
      case 'status':
        setSelectedDisponibilidade(value);
        break;
    }
  }, []);

  const handlePrecoMinChange = useCallback((value: number) => {
    setPrecoMin(value);
  }, []);

  const handlePrecoMaxChange = useCallback((value: number) => {
    setPrecoMax(value);
  }, []);

  const handleClearPriceFilters = useCallback(() => {
    setPrecoMin(0);
    setPrecoMax(0);
  }, []);

  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    const newPagination = { 
      ...pagination, 
      page: 1,
      sortBy, 
      sortOrder 
    };
    setPagination(newPagination);
    fetchProdutos(newPagination, filters).catch(() => {
      showError('Erro ao ordenar produtos');
    });
  }, [pagination, filters, fetchProdutos, showError]);

  const openCreateModal = useCallback(() => {
    setEditingProduto(null);
    setFormData({
      nome: '',
      categoria: '',
      preco: 0,
      quantidadeEstoque: 0,
    });
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((produto: ProdutoDTO) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      quantidadeEstoque: produto.quantidadeEstoque,
    });
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingProduto(null);
    setFormData({
      nome: '',
      categoria: '',
      preco: 0,
      quantidadeEstoque: 0,
    });
  }, []);

  const handleFormSubmit = async () => {
    try {
      if (editingProduto) {
        await updateProduto(editingProduto.id, formData);
        showSuccess('Produto atualizado com sucesso!');
      } else {
        await createProduto(formData);
        showSuccess('Produto criado com sucesso!');
      }
      closeModal();
      fetchProdutos();
    } catch (error) {}
  };

  const handleFormChange = (field: keyof CreateProdutoDTO, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteProduct = (id: string) => {
    setDeletingProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingProductId) return;
    
    try {
      await deleteProduto(deletingProductId);
      showSuccess('Produto excluído com sucesso!');
      fetchProdutos();
    } catch (error) {} finally {
      setShowDeleteModal(false);
      setDeletingProductId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingProductId(null);
  };



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <ProductHeader onAddProduct={openCreateModal} />

      <ProductTable
        produtos={produtos}
        loading={loading.list}
        totalCount={totalCount}
        pagination={pagination}
        totalPages={totalPages}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onEditProduct={openEditModal}
        onDeleteProduct={handleDeleteProduct}
        filterOptions={{
          categoryOptions: categoriaOptions,
          statusOptions: disponibilidadeOptions,
        }}
        filterValues={{
          category: selectedCategoria,
          status: selectedDisponibilidade,
        }}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        sortBy={pagination.sortBy}
        sortOrder={pagination.sortOrder}
        onSortChange={handleSortChange}
        precoMin={precoMin}
        precoMax={precoMax}
        onPrecoMinChange={handlePrecoMinChange}
        onPrecoMaxChange={handlePrecoMaxChange}
        onClearPriceFilters={handleClearPriceFilters}
      />

      <ProductModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        editingProduto={editingProduto}
        formData={formData}
        categoriaOptions={categoriaOptions}
        loading={loading.create || loading.update}
        onFormChange={handleFormChange}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir Produto"
        cancelText="Cancelar"
        loading={loading.delete}
      />
    </div>
  );
}
