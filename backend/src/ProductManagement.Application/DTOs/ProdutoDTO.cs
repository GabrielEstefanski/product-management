namespace ProductManagement.Application.DTOs
{
    public class ProdutoDTO
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = null!;
        public string Categoria { get; set; } = null!;
        public decimal Preco { get; set; }
        public DateTime DataInclusao { get; set; }
        public int QuantidadeEstoque { get; set; }
        public bool Disponivel => QuantidadeEstoque > 0;
    }

    public class ProdutoFilters
    {
        public string? Search { get; set; }
        public decimal? PrecoMin { get; set; }
        public decimal? PrecoMax { get; set; }
    }
}
