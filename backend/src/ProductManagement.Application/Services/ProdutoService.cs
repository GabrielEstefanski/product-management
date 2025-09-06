using ProductManagement.Application.DTOs;
using ProductManagement.Application.Interfaces;
using ProductManagement.Domain.Entities;
using ProductManagement.Domain.Exceptions;
using ProductManagement.Domain.Interfaces;
using AutoMapper;

namespace ProductManagement.Application.Services
{
    public class ProdutoService(IProdutoRepository repository, IMapper mapper) : IProdutoService
    {
        private readonly IProdutoRepository _repository = repository;
        private readonly IMapper _mapper = mapper;

        public async Task<PagedResult<ProdutoDTO>> GetAllAsync(
            int page = 1,
            int pageSize = 10,
            ProdutoFilters? filters = null,
            string? sortBy = null,
            string? sortOrder = null)
        {
            var query = (await _repository.GetAllAsync()).AsQueryable();

            query = ApplyFilters(query, filters);
            query = ApplySorting(query, sortBy, sortOrder ?? "desc");

            var totalCount = query.Count();
            var items = ApplyPagination(query, page, pageSize);

            return new PagedResult<ProdutoDTO>
            {
                Items = _mapper.Map<IEnumerable<ProdutoDTO>>(items),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<ProdutoDTO> GetByIdAsync(Guid id)
        {
            var produto = await _repository.GetByIdAsync(id)
                ?? throw new NotFoundException("Produto não encontrado");
            return _mapper.Map<ProdutoDTO>(produto);
        }

        public async Task<ProdutoDTO> CreateAsync(ProdutoDTO dto)
        {
            var produto = _mapper.Map<Produto>(dto);
            await _repository.AddAsync(produto);
            return _mapper.Map<ProdutoDTO>(produto);
        }

        public async Task UpdateAsync(Guid id, ProdutoDTO dto)
        {
            var produto = await _repository.GetByIdAsync(id)
                ?? throw new NotFoundException("Produto não encontrado");

            _mapper.Map(dto, produto);
            await _repository.UpdateAsync(produto);
        }

        public async Task DeleteAsync(Guid id)
        {
            _ = await _repository.GetByIdAsync(id)
                ?? throw new NotFoundException("Produto não encontrado");

            await _repository.DeleteAsync(id);
        }

        private static IQueryable<Produto> ApplyFilters(IQueryable<Produto> query, ProdutoFilters? filters)
        {
            if (filters == null) return query;

            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var search = filters.Search.Trim().ToLower();
                query = query.Where(p =>
                    p.Nome.ToLower().Contains(search) ||
                    p.Categoria.ToLower().Contains(search) ||
                    p.Preco.ToString().ToLower().Contains(search) ||
                    p.QuantidadeEstoque.ToString().ToLower().Contains(search) ||
                    p.DataInclusao.ToString("yyyy-MM-dd").ToLower().Contains(search) ||
                    (p.Disponivel ? "disponivel" : "indisponivel").StartsWith(search)
                );
            }

            if (filters.PrecoMin.HasValue)
                query = query.Where(p => p.Preco >= filters.PrecoMin.Value);

            if (filters.PrecoMax.HasValue)
                query = query.Where(p => p.Preco <= filters.PrecoMax.Value);

            return query;
        }

        private static IQueryable<Produto> ApplySorting(IQueryable<Produto> query, string? sortBy, string sortOrder)
        {
            if (string.IsNullOrEmpty(sortBy)) return query;

            var isDescending = sortOrder?.ToLower() == "desc";

            query = sortBy.ToLower() switch
            {
                "nome" => isDescending ? query.OrderByDescending(p => p.Nome) : query.OrderBy(p => p.Nome),
                "preco" => isDescending ? query.OrderByDescending(p => p.Preco) : query.OrderBy(p => p.Preco),
                "categoria" => isDescending ? query.OrderByDescending(p => p.Categoria) : query.OrderBy(p => p.Categoria),
                "quantidadeestoque" => isDescending ? query.OrderByDescending(p => p.QuantidadeEstoque) : query.OrderBy(p => p.QuantidadeEstoque),
                "datainclusao" => isDescending ? query.OrderByDescending(p => p.DataInclusao) : query.OrderBy(p => p.DataInclusao),
                "disponivel" => isDescending ? query.OrderByDescending(p => p.Disponivel) : query.OrderBy(p => p.Disponivel),
                _ => query
            };

            return query;
        }


        private static List<Produto> ApplyPagination(IQueryable<Produto> query, int page, int pageSize)
        {
            return [.. query.Skip((page - 1) * pageSize).Take(pageSize)];
        }
    }
}
