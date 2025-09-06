using ProductManagement.Domain.Exceptions;

namespace ProductManagement.Domain.Entities
{
    public class Produto
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Nome { get; private set; }
        public string Categoria { get; private set; }
        public decimal Preco { get; private set; }
        public int QuantidadeEstoque { get; private set; }
        public DateTime DataInclusao { get; private set; } = DateTime.UtcNow;
        public bool Disponivel => QuantidadeEstoque > 0;

        public Produto(string nome, string categoria, decimal preco, int quantidadeEstoque)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new DomainException("Nome obrigatório");
            if (string.IsNullOrWhiteSpace(categoria))
                throw new DomainException("Categoria obrigatória");
            if (preco < 0)
                throw new DomainException("Preço deve ser >= 0");
            if (quantidadeEstoque < 0)
                throw new DomainException("Quantidade em estoque >= 0");

            Nome = nome;
            Categoria = categoria;
            Preco = preco;
            QuantidadeEstoque = quantidadeEstoque;
        }

        public void Atualizar(string nome, string categoria, decimal preco, int quantidadeEstoque)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new DomainException("Nome obrigatório");
            if (string.IsNullOrWhiteSpace(categoria))
                throw new DomainException("Categoria obrigatória");
            if (preco < 0)
                throw new DomainException("Preço deve ser >= 0");
            if (quantidadeEstoque < 0)
                throw new DomainException("Quantidade em estoque >= 0");

            Nome = nome;
            Categoria = categoria;
            Preco = preco;
            QuantidadeEstoque = quantidadeEstoque;
        }
    }
}
