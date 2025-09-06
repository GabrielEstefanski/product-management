using ProductManagement.Application.DTOs;

namespace ProductManagement.Application.Interfaces
{
    public interface IProdutoService
    {
        Task<PagedResult<ProdutoDTO>> GetAllAsync(
            int page = 1,
            int pageSize = 10,
            ProdutoFilters? filters = null,
            string? sortBy = null,
            string? sortOrder = null);
        Task<ProdutoDTO> GetByIdAsync(Guid id);
        Task<ProdutoDTO> CreateAsync(ProdutoDTO dto);
        Task UpdateAsync(Guid id, ProdutoDTO dto);
        Task DeleteAsync(Guid id);
    }
}
