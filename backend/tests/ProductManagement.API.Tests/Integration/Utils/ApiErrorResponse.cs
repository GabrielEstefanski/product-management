namespace ProductManagement.API.Tests.Integration.Utils
{
    public class ApiErrorResponse
    {
        public string Message { get; set; } = "";
        public int StatusCode { get; set; }
        public string Error { get; set; } = "";
        public string ErrorCode { get; set; } = "";
        public object? Details { get; set; }
    }
}
