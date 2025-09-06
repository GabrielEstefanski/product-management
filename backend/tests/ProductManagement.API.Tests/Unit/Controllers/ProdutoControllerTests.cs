using Microsoft.AspNetCore.Mvc;
using Moq;
using ProductManagement.API.Controllers;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.Interfaces;
using ProductManagement.Domain.Exceptions;

namespace ProductManagement.API.Tests.Unit.Controllers
{
    public class ProdutosControllerTests
    {
        private readonly Mock<IProdutoService> _serviceMock;
        private readonly ProdutosController _controller;

        public ProdutosControllerTests()
        {
            _serviceMock = new Mock<IProdutoService>();
            _controller = new ProdutosController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetAll_DeveRetornarOkComProdutos()
        {
            var produtos = new List<ProdutoDTO>
            {
                new() { Id = Guid.NewGuid(), Nome = "Produto1", Categoria = "Cat1", Preco = 10, QuantidadeEstoque = 5 },
                new() { Id = Guid.NewGuid(), Nome = "Produto2", Categoria = "Cat2", Preco = 20, QuantidadeEstoque = 0 }
            };

            var pagedResult = new PagedResult<ProdutoDTO>
            {
                Items = produtos,
                Page = 1,
                PageSize = 10,
                TotalCount = produtos.Count
            };

            _serviceMock.Setup(s => s.GetAllAsync(
                1,
                10,
                It.IsAny<ProdutoFilters>(),
                null,
                null))
            .ReturnsAsync(pagedResult);

            var result = await _controller.GetAll();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPagedResult = Assert.IsType<PagedResult<ProdutoDTO>>(okResult.Value);

            Assert.Equal(2, returnedPagedResult.Items.Count());
            Assert.Equal(1, returnedPagedResult.Page);
            Assert.Equal(10, returnedPagedResult.PageSize);
        }


        [Fact]
        public async Task GetById_ProdutoExistente_DeveRetornarOk()
        {
            var id = Guid.NewGuid();
            var produto = new ProdutoDTO { Id = id, Nome = "Produto1", Categoria = "Cat1", Preco = 10, QuantidadeEstoque = 5 };
            _serviceMock.Setup(s => s.GetByIdAsync(id)).ReturnsAsync(produto);

            var result = await _controller.GetById(id);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProduto = Assert.IsType<ProdutoDTO>(okResult.Value);
            Assert.Equal(id, returnedProduto.Id);
        }

        [Fact]
        public async Task GetById_ProdutoNaoExistente_DeveLancarNotFoundException()
        {
            var id = Guid.NewGuid();
            _serviceMock.Setup(s => s.GetByIdAsync(id)).ThrowsAsync(new NotFoundException("Produto não encontrado"));

            await Assert.ThrowsAsync<NotFoundException>(() => _controller.GetById(id));
        }

        [Fact]
        public async Task Create_DeveRetornarCreatedAtAction()
        {
            var dto = new ProdutoDTO { Nome = "Produto1", Categoria = "Cat1", Preco = 10, QuantidadeEstoque = 5 };
            var createdDto = new ProdutoDTO { Id = Guid.NewGuid(), Nome = dto.Nome, Categoria = dto.Categoria, Preco = dto.Preco, QuantidadeEstoque = dto.QuantidadeEstoque };

            _serviceMock.Setup(s => s.CreateAsync(dto)).ReturnsAsync(createdDto);

            var result = await _controller.Create(dto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedProduto = Assert.IsType<ProdutoDTO>(createdResult.Value);
            Assert.Equal(createdDto.Id, returnedProduto.Id);
        }

        [Fact]
        public async Task Update_ProdutoExistente_DeveRetornarNoContent()
        {
            var id = Guid.NewGuid();
            var dto = new ProdutoDTO { Nome = "Produto1", Categoria = "Cat1", Preco = 10, QuantidadeEstoque = 5 };

            _serviceMock.Setup(s => s.UpdateAsync(id, dto)).Returns(Task.CompletedTask);

            var result = await _controller.Update(id, dto);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ProdutoExistente_DeveRetornarNoContent()
        {
            var id = Guid.NewGuid();
            _serviceMock.Setup(s => s.DeleteAsync(id)).Returns(Task.CompletedTask);

            var result = await _controller.Delete(id);

            Assert.IsType<NoContentResult>(result);
        }
    }
}
