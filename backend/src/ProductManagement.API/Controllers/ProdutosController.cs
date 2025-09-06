using Microsoft.AspNetCore.Mvc;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.Interfaces;

namespace ProductManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController(IProdutoService service) : ControllerBase
    {
        private readonly IProdutoService _service = service;

        [HttpGet]
        public async Task<ActionResult<PagedResult<ProdutoDTO>>> GetAll(
           [FromQuery] int page = 1,
           [FromQuery] int pageSize = 10,
           [FromQuery] string? search = null,
           [FromQuery] decimal? precoMin = null,
           [FromQuery] decimal? precoMax = null,
           [FromQuery] string? sortBy = null,
           [FromQuery] string? sortOrder = null)
        {
            var filters = new ProdutoFilters
            {
                Search = search,
                PrecoMin = precoMin,
                PrecoMax = precoMax
            };

            var result = await _service.GetAllAsync(page, pageSize, filters, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProdutoDTO>> GetById(Guid id)
        {
            var produto = await _service.GetByIdAsync(id);
            return Ok(produto);
        }

        [HttpPost]
        public async Task<ActionResult<ProdutoDTO>> Create([FromBody] ProdutoDTO dto)
        {
            var produto = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = produto.Id }, produto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProdutoDTO dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
