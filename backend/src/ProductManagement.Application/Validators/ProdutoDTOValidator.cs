using FluentValidation;
using ProductManagement.Application.DTOs;

namespace ProductManagement.Application.Validators
{
    public class ProdutoDTOValidator : AbstractValidator<ProdutoDTO>
    {
        public ProdutoDTOValidator()
        {
            RuleFor(p => p.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .MaximumLength(100);

            RuleFor(p => p.Categoria)
                .NotEmpty().WithMessage("Categoria é obrigatória")
                .MaximumLength(50);

            RuleFor(p => p.Preco)
                .GreaterThanOrEqualTo(0).WithMessage("Preço deve ser >= 0");

            RuleFor(p => p.QuantidadeEstoque)
                .GreaterThanOrEqualTo(0).WithMessage("Quantidade em estoque deve ser >= 0");
        }
    }
}
