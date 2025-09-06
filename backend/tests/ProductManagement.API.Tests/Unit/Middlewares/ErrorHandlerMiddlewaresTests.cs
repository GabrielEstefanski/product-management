using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using ProductManagement.API.Middlewares;
using ProductManagement.Domain.Exceptions;

namespace ProductManagement.API.Tests.Middlewares
{
    public class ErrorHandlerMiddlewareTests
    {
        [Fact]
        public async Task Invoke_AppException_RetornaStatusCodeEDescricao()
        {
            var exception = new NotFoundException("Produto não encontrado");
            var loggerMock = new Mock<ILogger<ErrorHandlerMiddleware>>();

            var context = new DefaultHttpContext
            {
                Response = { Body = new MemoryStream() }
            };

            var middleware = new ErrorHandlerMiddleware(async ctx => throw exception, loggerMock.Object);

            await middleware.Invoke(context);

            Assert.Equal((int)HttpStatusCode.NotFound, context.Response.StatusCode);
            context.Response.Body.Seek(0, System.IO.SeekOrigin.Begin);
            var body = await new System.IO.StreamReader(context.Response.Body).ReadToEndAsync();
            var json = JsonSerializer.Deserialize<JsonElement>(body);
            Assert.Equal("Produto não encontrado", json.GetProperty("error").GetString());
        }

        [Fact]
        public async Task Invoke_ExceptionGenerica_RetornaInternalServerError()
        {
            var exception = new Exception("Algo deu errado");
            var loggerMock = new Mock<ILogger<ErrorHandlerMiddleware>>();

            var context = new DefaultHttpContext
            {
                Response = { Body = new MemoryStream() }
            };
            var middleware = new ErrorHandlerMiddleware(async ctx => throw exception, loggerMock.Object);

            await middleware.Invoke(context);

            Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);
            context.Response.Body.Seek(0, System.IO.SeekOrigin.Begin);
            var body = await new System.IO.StreamReader(context.Response.Body).ReadToEndAsync();
            var json = JsonSerializer.Deserialize<JsonElement>(body);
            Assert.Equal("Ocorreu um erro interno.", json.GetProperty("error").GetString());
        }
    }
}
