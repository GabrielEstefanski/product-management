using ProductManagement.Domain.Entities;
using ProductManagement.Domain.Interfaces;

namespace ProductManagement.Infrastructure.Repositories
{
    public class ProdutoRepository : RepositoryInMemory<Produto>, IProdutoRepository {}
}
