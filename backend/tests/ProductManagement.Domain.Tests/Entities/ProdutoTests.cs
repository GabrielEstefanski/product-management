using ProductManagement.Domain.Entities;
using ProductManagement.Domain.Exceptions;

namespace ProductManagement.Domain.Tests.Entities
{
    public class ProdutoTests
    {
        [Fact]
        public void CriarProduto_Valido_DeveInicializarCorretamente()
        {
            var nome = "Produto Teste";
            var categoria = "Categoria Teste";
            var preco = 100m;
            var quantidade = 10;

            var produto = new Produto(nome, categoria, preco, quantidade);

            Assert.NotEqual(Guid.Empty, produto.Id);
            Assert.Equal(nome, produto.Nome);
            Assert.Equal(categoria, produto.Categoria);
            Assert.Equal(preco, produto.Preco);
            Assert.Equal(quantidade, produto.QuantidadeEstoque);
            Assert.True(produto.Disponivel);
        }

        [Theory]
        [InlineData("", "Categoria", 10, 5)]
        [InlineData(null, "Categoria", 10, 5)]
        public void CriarProduto_NomeInvalido_DeveLancarArgumentException(string nome, string categoria, decimal preco, int quantidade)
        {
            var ex = Assert.Throws<DomainException>(() => new Produto(nome, categoria, preco, quantidade));
            Assert.Equal("Nome obrigatório", ex.Message);
        }

        [Theory]
        [InlineData("Produto", "", 10, 5)]
        [InlineData("Produto", null, 10, 5)]
        public void CriarProduto_CategoriaInvalida_DeveLancarArgumentException(string nome, string categoria, decimal preco, int quantidade)
        {
            var ex = Assert.Throws<DomainException>(() => new Produto(nome, categoria, preco, quantidade));
            Assert.Equal("Categoria obrigatória", ex.Message);
        }

        [Theory]
        [InlineData("Produto", "Categoria", -1, 5)]
        public void CriarProduto_PrecoNegativo_DeveLancarArgumentException(string nome, string categoria, decimal preco, int quantidade)
        {
            var ex = Assert.Throws<DomainException>(() => new Produto(nome, categoria, preco, quantidade));
            Assert.Equal("Preço deve ser >= 0", ex.Message);
        }

        [Theory]
        [InlineData("Produto", "Categoria", 10, -1)]
        public void CriarProduto_QuantidadeNegativa_DeveLancarArgumentException(string nome, string categoria, decimal preco, int quantidade)
        {
            var ex = Assert.Throws<DomainException>(() => new Produto(nome, categoria, preco, quantidade));
            Assert.Equal("Quantidade em estoque >= 0", ex.Message);
        }

        [Fact]
        public void AtualizarProduto_ValoresValidos_DeveAtualizarPropriedades()
        {
            var produto = new Produto("Produto1", "Categoria1", 50, 5);

            produto.Atualizar("Produto2", "Categoria2", 100, 10);

            Assert.Equal("Produto2", produto.Nome);
            Assert.Equal("Categoria2", produto.Categoria);
            Assert.Equal(100, produto.Preco);
            Assert.Equal(10, produto.QuantidadeEstoque);
            Assert.True(produto.Disponivel);
        }

        [Fact]
        public void Disponivel_QuantidadeZero_DeveRetornarFalse()
        {
            var produto = new Produto("Produto", "Categoria", 10, 0);
            Assert.False(produto.Disponivel);
        }
    }
}
