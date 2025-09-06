using System.Net;

namespace ProductManagement.Domain.Exceptions
{
    public abstract class AppException(string message) : Exception(message)
    {
        public abstract HttpStatusCode StatusCode { get; }
    }

    public class NotFoundException(string message) : AppException(message)
    {
        public override HttpStatusCode StatusCode => HttpStatusCode.NotFound;
    }

    public class BadRequestException(string message) : AppException(message)
    {
        public override HttpStatusCode StatusCode => HttpStatusCode.BadRequest;
    }
}
