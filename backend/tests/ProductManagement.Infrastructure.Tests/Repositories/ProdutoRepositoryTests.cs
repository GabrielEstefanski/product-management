using ProductManagement.Domain.Entities;
using ProductManagement.Infrastructure.Repositories;

namespace ProductManagement.Infrastructure.Tests.Repositories
{
    public class ProdutoRepositoryTests
    {
        private readonly RepositoryInMemory<Produto> _repository;

        public ProdutoRepositoryTests()
        {
            _repository = new RepositoryInMemory<Produto>();
        }

        [Fact]
        public async Task AddAsync_ProdutoValido_DeveAdicionar()
        {
            var produto = new Produto("Produto1", "Categoria1", 10, 5);
            await _repository.AddAsync(produto);
            var all = (await _repository.GetAllAsync()).ToList();
            Assert.Single(all);
            Assert.NotEqual(Guid.Empty, all[0].Id);
            Assert.Equal(produto.Nome, all[0].Nome);
        }

        [Fact]
        public async Task GetByIdAsync_ProdutoExistente_DeveRetornarProduto()
        {
            var produto = new Produto("Produto2", "Categoria2", 20, 10);
            await _repository.AddAsync(produto);
            var result = await _repository.GetByIdAsync(produto.Id);
            Assert.NotNull(result);
            Assert.Equal(produto.Id, result!.Id);
        }

        [Fact]
        public async Task UpdateAsync_ProdutoExistente_DeveAtualizarValores()
        {
            var produto = new Produto("Produto3", "Categoria3", 30, 15);
            await _repository.AddAsync(produto);
            produto.Atualizar("Produto3-Atualizado", "Categoria3", 35, 20);
            await _repository.UpdateAsync(produto);
            var result = await _repository.GetByIdAsync(produto.Id);
            Assert.NotNull(result);
            Assert.Equal("Produto3-Atualizado", result!.Nome);
            Assert.Equal(35, result.Preco);
            Assert.Equal(20, result.QuantidadeEstoque);
        }

        [Fact]
        public async Task DeleteAsync_ProdutoExistente_DeveRemoverProduto()
        {
            var produto = new Produto("Produto4", "Categoria4", 40, 25);
            await _repository.AddAsync(produto);
            await _repository.DeleteAsync(produto.Id);
            var result = await _repository.GetByIdAsync(produto.Id);
            Assert.Null(result);
        }

        [Fact]
        public async Task GetByIdAsync_IdInexistente_DeveRetornarNull()
        {
            var result = await _repository.GetByIdAsync(Guid.NewGuid());
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_IdInexistente_NaoDeveLancarExcecao()
        {
            var produto = new Produto("ProdutoInexistente", "Categoria", 10, 1);
            var exception = await Record.ExceptionAsync(() => _repository.UpdateAsync(produto));
            Assert.Null(exception);
        }

        [Fact]
        public async Task DeleteAsync_IdInexistente_NaoDeveLancarExcecao()
        {
            var exception = await Record.ExceptionAsync(() => _repository.DeleteAsync(Guid.NewGuid()));
            Assert.Null(exception);
        }

        [Fact]
        public async Task GetAllAsync_ListaVazia_DeveRetornarListaVazia()
        {
            var all = await _repository.GetAllAsync();
            Assert.Empty(all);
        }
    }
}
