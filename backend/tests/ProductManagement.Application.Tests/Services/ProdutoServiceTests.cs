using AutoMapper;
using Moq;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.Services;
using ProductManagement.Domain.Entities;
using ProductManagement.Domain.Exceptions;
using ProductManagement.Domain.Interfaces;

namespace ProductManagement.Application.Tests.Services
{
    public class ProdutoServiceTests
    {
        private readonly Mock<IProdutoRepository> _repositoryMock;
        private readonly IMapper _mapper;
        private readonly ProdutoService _service;

        public ProdutoServiceTests()
        {
            _repositoryMock = new Mock<IProdutoRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Produto, ProdutoDTO>().ReverseMap();
            });
            _mapper = config.CreateMapper();

            _service = new ProdutoService(_repositoryMock.Object, _mapper);
        }

        [Fact]
        public async Task GetAllAsync_DeveRetornarTodosProdutos()
        {
            var produtos = new List<Produto>
            {
                new("Produto1", "Cat1", 10, 5),
                new("Produto2", "Cat2", 20, 0)
            };

            _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(produtos);

            var result = await _service.GetAllAsync(page: 1, pageSize: 10);

            Assert.Equal(2, result.Items.Count());
            Assert.Contains(result.Items, p => p.Nome == "Produto1");
            Assert.Contains(result.Items, p => p.Nome == "Produto2");
            Assert.Equal(1, result.Page);
            Assert.Equal(10, result.PageSize);
            Assert.Equal(2, result.TotalCount);
        }

        [Fact]
        public async Task GetByIdAsync_ProdutoExistente_DeveRetornarProduto()
        {
            var produto = new Produto("Produto1", "Cat1", 10, 5);
            _repositoryMock.Setup(r => r.GetByIdAsync(produto.Id)).ReturnsAsync(produto);

            var result = await _service.GetByIdAsync(produto.Id);

            Assert.Equal(produto.Nome, result.Nome);
        }

        [Fact]
        public async Task GetByIdAsync_ProdutoNaoExistente_DeveLancarNotFoundException()
        {
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Produto)null!);

            await Assert.ThrowsAsync<NotFoundException>(() => _service.GetByIdAsync(Guid.NewGuid()));
        }

        [Fact]
        public async Task CreateAsync_DeveAdicionarProdutoERetornarDTO()
        {
            var dto = new ProdutoDTO { Nome = "Produto1", Categoria = "Cat1", Preco = 10, QuantidadeEstoque = 5 };

            Produto? produtoAdicionado = null;
            _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Produto>()))
                .Callback<Produto>(p => produtoAdicionado = p)
                .Returns(Task.CompletedTask);

            var result = await _service.CreateAsync(dto);

            Assert.NotNull(produtoAdicionado);
            Assert.Equal(dto.Nome, result.Nome);
            Assert.Equal(produtoAdicionado!.Id, result.Id);
        }

        [Fact]
        public async Task UpdateAsync_ProdutoExistente_DeveAtualizarProduto()
        {
            var produto = new Produto("Produto1", "Cat1", 10, 5);
            _repositoryMock.Setup(r => r.GetByIdAsync(produto.Id)).ReturnsAsync(produto);
            _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Produto>())).Returns(Task.CompletedTask);

            var dto = new ProdutoDTO { Nome = "ProdutoAtualizado", Categoria = "Cat1", Preco = 15, QuantidadeEstoque = 10 };

            await _service.UpdateAsync(produto.Id, dto);

            Assert.Equal("ProdutoAtualizado", produto.Nome);
            Assert.Equal(15, produto.Preco);
            Assert.Equal(10, produto.QuantidadeEstoque);
        }

        [Fact]
        public async Task UpdateAsync_ProdutoNaoExistente_DeveLancarNotFoundException()
        {
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Produto)null!);
            var dto = new ProdutoDTO { Nome = "Produto", Categoria = "Cat", Preco = 10, QuantidadeEstoque = 5 };

            await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateAsync(Guid.NewGuid(), dto));
        }

        [Fact]
        public async Task DeleteAsync_ProdutoExistente_DeveChamarDelete()
        {
            var produto = new Produto("Produto1", "Cat1", 10, 5);
            _repositoryMock.Setup(r => r.GetByIdAsync(produto.Id)).ReturnsAsync(produto);
            _repositoryMock.Setup(r => r.DeleteAsync(produto.Id)).Returns(Task.CompletedTask);

            await _service.DeleteAsync(produto.Id);

            _repositoryMock.Verify(r => r.DeleteAsync(produto.Id), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ProdutoNaoExistente_DeveLancarNotFoundException()
        {
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Produto)null!);

            await Assert.ThrowsAsync<NotFoundException>(() => _service.DeleteAsync(Guid.NewGuid()));
        }
    }
}
