using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using ProductManagement.Application.DTOs;

namespace ProductManagement.API.Tests.Integration.Controllers
{
    public class ProdutosControllerIntegrationTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client = factory.CreateClient();

        [Fact]
        public async Task Create_Get_Update_Delete_Product_Success_WithPaging()
        {
            var newProduct = new ProdutoDTO
            {
                Nome = "Produto Teste",
                Categoria = "Eletrônicos",
                Preco = 100.0m,
                QuantidadeEstoque = 10
            };

            var createResponse = await _client.PostAsJsonAsync("/api/produtos", newProduct);
            Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

            var created = await createResponse.Content.ReadFromJsonAsync<ProdutoDTO>();
            Assert.NotNull(created);
            Assert.Equal("Produto Teste", created.Nome);
            Assert.True(created.Disponivel);

            created.Nome = "Produto Atualizado";
            created.Preco = 200.0m;

            var updateResponse = await _client.PutAsJsonAsync($"/api/produtos/{created.Id}", created);
            Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

            var getResponse = await _client.GetAsync($"/api/produtos/{created.Id}");
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

            var updated = await getResponse.Content.ReadFromJsonAsync<ProdutoDTO>();
            Assert.Equal("Produto Atualizado", updated!.Nome);
            Assert.Equal(200.0m, updated.Preco);

            var allResponse = await _client.GetAsync("/api/produtos?page=1&pageSize=10");
            Assert.Equal(HttpStatusCode.OK, allResponse.StatusCode);

            var pagedResult = await allResponse.Content.ReadFromJsonAsync<PagedResult<ProdutoDTO>>();
            Assert.NotNull(pagedResult);
            Assert.Contains(pagedResult!.Items, p => p.Id == created.Id);

            var deleteResponse = await _client.DeleteAsync($"/api/produtos/{created.Id}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            var allAfterDelete = await _client.GetAsync("/api/produtos?page=1&pageSize=10");
            var pagedAfterDelete = await allAfterDelete.Content.ReadFromJsonAsync<PagedResult<ProdutoDTO>>();
            Assert.DoesNotContain(pagedAfterDelete!.Items, p => p.Id == created.Id);
        }


        [Fact]
        public async Task CreateProduct_InvalidDto_ReturnsBadRequest()
        {
            var invalidProduct = new ProdutoDTO
            {
                Nome = "",
                Categoria = "",
                Preco = -10,
                QuantidadeEstoque = -1
            };

            var response = await _client.PostAsJsonAsync("/api/produtos", invalidProduct);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
            Assert.NotNull(problem);
            Assert.Contains("Nome", problem!.Errors.Keys);
            Assert.Contains("Preco", problem.Errors.Keys);
        }
    }
}
