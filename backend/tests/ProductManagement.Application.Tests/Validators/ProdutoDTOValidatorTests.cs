using FluentValidation.TestHelper;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.Validators;

namespace ProductManagement.Application.Tests.Validators
{
    public class ProdutoDTOValidatorTests
    {
        private readonly ProdutoDTOValidator _validator;

        public ProdutoDTOValidatorTests()
        {
            _validator = new ProdutoDTOValidator();
        }

        [Fact]
        public void Deve_Falhar_Quando_NomeVazioOuNulo()
        {
            var dto1 = new ProdutoDTO { Nome = "", Categoria = "Cat", Preco = 10, QuantidadeEstoque = 5 };
            var dto2 = new ProdutoDTO { Nome = null!, Categoria = "Cat", Preco = 10, QuantidadeEstoque = 5 };

            var result1 = _validator.TestValidate(dto1);
            var result2 = _validator.TestValidate(dto2);

            result1.ShouldHaveValidationErrorFor(p => p.Nome)
                   .WithErrorMessage("Nome é obrigatório");
            result2.ShouldHaveValidationErrorFor(p => p.Nome)
                   .WithErrorMessage("Nome é obrigatório");
        }

        [Fact]
        public void Deve_Falhar_Quando_CategoriaVaziaOuNula()
        {
            var dto1 = new ProdutoDTO { Nome = "Produto", Categoria = "", Preco = 10, QuantidadeEstoque = 5 };
            var dto2 = new ProdutoDTO { Nome = "Produto", Categoria = null!, Preco = 10, QuantidadeEstoque = 5 };

            var result1 = _validator.TestValidate(dto1);
            var result2 = _validator.TestValidate(dto2);

            result1.ShouldHaveValidationErrorFor(p => p.Categoria)
                   .WithErrorMessage("Categoria é obrigatória");
            result2.ShouldHaveValidationErrorFor(p => p.Categoria)
                   .WithErrorMessage("Categoria é obrigatória");
        }

        [Fact]
        public void Deve_Falhar_Quando_PrecoNegativo()
        {
            var dto = new ProdutoDTO { Nome = "Produto", Categoria = "Cat", Preco = -1, QuantidadeEstoque = 5 };
            var result = _validator.TestValidate(dto);

            result.ShouldHaveValidationErrorFor(p => p.Preco)
                  .WithErrorMessage("Preço deve ser >= 0");
        }

        [Fact]
        public void Deve_Falhar_Quando_QuantidadeNegativa()
        {
            var dto = new ProdutoDTO { Nome = "Produto", Categoria = "Cat", Preco = 10, QuantidadeEstoque = -1 };
            var result = _validator.TestValidate(dto);

            result.ShouldHaveValidationErrorFor(p => p.QuantidadeEstoque)
                  .WithErrorMessage("Quantidade em estoque deve ser >= 0");
        }

        [Fact]
        public void Deve_Passar_Quando_DTOValido()
        {
            var dto = new ProdutoDTO { Nome = "Produto", Categoria = "Cat", Preco = 10, QuantidadeEstoque = 5 };
            var result = _validator.TestValidate(dto);

            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}
