import { httpClient } from '@/lib/http-client';
import { ErrorHandler } from '@/lib/error-handler';
import { PaginationParams } from '@/types/paginatedResponse';
import {
  CreateProdutoDTO,
  UpdateProdutoDTO,
  ProdutoFilters,
  ProdutosResponse,
  ProdutoResponse,
  CreateProdutoResponse,
  UpdateProdutoResponse,
} from '@/types/produto';


const API_ROUTES = {
  PRODUTOS: '/api/produtos',
} as const;


export class ProdutosService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_ROUTES.PRODUTOS;
  }

  /**
   * Wrapper para tratar erros automaticamente
   */
  private async handleRequest<T>(request: () => Promise<T>): Promise<T> {
    try {
      return await request();
    } catch (error) {
      const friendlyMessage = ErrorHandler.processError(error);
      throw new Error(friendlyMessage);
    }
  }

  async getProdutos(
    pagination: PaginationParams,
    filters?: ProdutoFilters
  ): Promise<ProdutosResponse> {
    return this.handleRequest(async () => {
      const params = new URLSearchParams();

      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);
      
      
      if (filters?.nome) params.append('nome', filters.nome);
      if (filters?.categoria) params.append('categoria', filters.categoria);
      if (filters?.disponivel !== undefined) params.append('disponivel', filters.disponivel.toString());
      if (filters?.precoMin) params.append('precoMin', filters.precoMin.toString());
      if (filters?.precoMax) params.append('precoMax', filters.precoMax.toString());

      const response = await httpClient.get<ProdutosResponse>(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    });
  }

  
  async getProdutoById(id: string): Promise<ProdutoResponse> {
    return this.handleRequest(async () => {
      const response = await httpClient.get<ProdutoResponse>(`${this.baseUrl}/${id}`);
      return response.data;
    });
  }

  
  async createProduto(produto: CreateProdutoDTO): Promise<CreateProdutoResponse> {
    return this.handleRequest(async () => {
      const response = await httpClient.post<CreateProdutoResponse>(this.baseUrl, produto);
      return response.data;
    });
  }

  
  async updateProduto(id: string, produto: UpdateProdutoDTO): Promise<UpdateProdutoResponse> {
    return this.handleRequest(async () => {
      const response = await httpClient.put<UpdateProdutoResponse>(`${this.baseUrl}/${id}`, produto);
      return response.data;
    });
  }

  
  async deleteProduto(id: string): Promise<void> {
    return this.handleRequest(async () => {
      await httpClient.delete(`${this.baseUrl}/${id}`);
    });
  }

  
  async getProdutosByCategoria(categoria: string, pagination: PaginationParams): Promise<ProdutosResponse> {
    return this.handleRequest(async () => {
      const params = new URLSearchParams();
      params.append('categoria', categoria);
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);

      const response = await httpClient.get<ProdutosResponse>(`${this.baseUrl}/categoria/${categoria}?${params.toString()}`);
      return response.data;
    });
  }

  
  async getProdutosDisponiveis(pagination: PaginationParams): Promise<ProdutosResponse> {
    return this.handleRequest(async () => {
      const params = new URLSearchParams();
      params.append('disponivel', 'true');
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);

      const response = await httpClient.get<ProdutosResponse>(`${this.baseUrl}/disponiveis?${params.toString()}`);
      return response.data;
    });
  }

  
  async updateEstoque(id: string, quantidade: number): Promise<UpdateProdutoResponse> {
    return this.handleRequest(async () => {
      const response = await httpClient.patch<UpdateProdutoResponse>(`${this.baseUrl}/${id}/estoque`, {
        quantidadeEstoque: quantidade,
      });
      return response.data;
    });
  }

  
  async searchProdutos(query: string, pagination: PaginationParams): Promise<ProdutosResponse> {
    return this.handleRequest(async () => {
      const params = new URLSearchParams();
      params.append('search', query);
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);
    
      const response = await httpClient.get<ProdutosResponse>(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    });
  }
}


export const produtosService = new ProdutosService();


export const useProdutosService = () => {
  return produtosService;
};
