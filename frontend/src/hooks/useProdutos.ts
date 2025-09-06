'use client';

import { useState, useCallback } from 'react';
import { produtosService } from '@/services/produtos.service';
import {
  ProdutoDTO,
  CreateProdutoDTO,
  UpdateProdutoDTO,
  ProdutoFilters,
} from '@/types/produto';
import { PaginationParams } from '@/types/paginatedResponse';

interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  search: boolean;
}

interface ErrorState {
  message: string;
  code?: string;
}

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'nome',
    sortOrder: 'asc',
  });
  const [filters, setFilters] = useState<ProdutoFilters>({});
  const [loading, setLoading] = useState<LoadingState>({
    list: false,
    create: false,
    update: false,
    delete: false,
    search: false,
  });
  const [error, setError] = useState<ErrorState | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setLoadingState = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  const fetchProdutos = useCallback(async (
    newPagination?: PaginationParams,
    newFilters?: ProdutoFilters
  ) => {
    try {
      setLoadingState('list', true);
      clearError();

      const paginationToUse = newPagination || pagination;
      const filtersToUse = newFilters || filters;

      const response = await produtosService.getProdutos(paginationToUse, filtersToUse);
      
      setProdutos(response.items || []);
      setTotalCount(response.totalCount || 0);
      setPagination(paginationToUse);
      setFilters(filtersToUse);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produtos';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoadingState('list', false);
    }
  }, [pagination, filters, setLoadingState, clearError]);

  const createProduto = useCallback(async (produto: CreateProdutoDTO) => {
    try {
      setLoadingState('create', true);
      clearError();

      const newProduto = await produtosService.createProduto(produto);
      
      setProdutos(prev => [newProduto, ...prev]);
      setTotalCount(prev => prev + 1);

      return newProduto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoadingState('create', false);
    }
  }, [setLoadingState, clearError]);

  const updateProduto = useCallback(async (id: string, produto: UpdateProdutoDTO) => {
    try {
      setLoadingState('update', true);
      clearError();

      const updatedProduto = await produtosService.updateProduto(id, produto);
      
      setProdutos(prev => prev.map(p => p.id === id ? updatedProduto : p));

      return updatedProduto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoadingState('update', false);
    }
  }, [setLoadingState, clearError]);

  const deleteProduto = useCallback(async (id: string) => {
    try {
      setLoadingState('delete', true);
      clearError();

      await produtosService.deleteProduto(id);
      
      setProdutos(prev => prev.filter(p => p.id !== id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produto';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoadingState('delete', false);
    }
  }, [setLoadingState, clearError]);

  const fetchProdutoById = useCallback(async (id: string) => {
    try {
      clearError();
      return await produtosService.getProdutoById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produto';
      setError({ message: errorMessage });
      throw err;
    }
  }, [clearError]);

  const searchProdutos = useCallback(async (query: string) => {
    try {
      setLoadingState('search', true);
      clearError();

      const response = await produtosService.searchProdutos(query, pagination);
      
      setProdutos(response.items || []);
      setTotalCount(response.totalCount || 0);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produtos';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoadingState('search', false);
    }
  }, [pagination, setLoadingState, clearError]);

  const fetchProdutosByCategoria = useCallback(async (categoria: string) => {
    try {
      setLoadingState('list', true);
      clearError();

      const response = await produtosService.getProdutosByCategoria(categoria, pagination);
      
      setProdutos(response.items || []);
      setTotalCount(response.totalCount || 0);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produtos por categoria';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoadingState('list', false);
    }
  }, [pagination, setLoadingState, clearError]);

  const updateEstoque = useCallback(async (id: string, quantidade: number) => {
    try {
      setLoadingState('update', true);
      clearError();

      const updatedProduto = await produtosService.updateEstoque(id, quantidade);
      
      setProdutos(prev => prev.map(p => p.id === id ? updatedProduto : p));

      return updatedProduto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar estoque';
      setError({ message: errorMessage });
      throw err;
    } finally {
      setLoadingState('update', false);
    }
  }, [setLoadingState, clearError]);

  const totalPages = Math.ceil(totalCount / pagination.pageSize);
  const hasNextPage = pagination.page < totalPages;
  const hasPreviousPage = pagination.page > 1;

  return {
    produtos,
    pagination,
    filters,
    loading,
    error,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    fetchProdutos,
    createProduto,
    updateProduto,
    deleteProduto,
    fetchProdutoById,
    searchProdutos,
    fetchProdutosByCategoria,
    updateEstoque,
    clearError,
    setFilters,
    setPagination,
  };
};
