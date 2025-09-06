import { PaginatedResponse } from "./paginatedResponse";

export interface ProdutoDTO {
  id: string; 
  nome: string;
  categoria: string;
  preco: number;
  quantidadeEstoque: number;
  disponivel: boolean;
  dataInclusao: string;
}

export interface CreateProdutoDTO {
  nome: string;
  categoria: string;
  preco: number;
  quantidadeEstoque: number;
}

export interface UpdateProdutoDTO {
  nome?: string;
  categoria?: string;
  preco?: number;
  quantidadeEstoque?: number;
}

export interface ProdutoFilters {
  nome?: string;
  categoria?: string;
  disponivel?: boolean;
  precoMin?: number;
  precoMax?: number;
}

export type ProdutoResponse = ProdutoDTO;
export interface ProdutosResponse {
  items: ProdutoDTO[];
  totalCount: number;
  page: number;
  pageSize: number;
}
export type CreateProdutoResponse = ProdutoDTO;
export type UpdateProdutoResponse = ProdutoDTO;
