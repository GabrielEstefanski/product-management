using System.Net;

namespace ProductManagement.Domain.Exceptions
{
    public class DomainException(string message) : AppException(message)
    {
        public override HttpStatusCode StatusCode => HttpStatusCode.BadRequest;
    }
}
