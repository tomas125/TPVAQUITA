namespace Vaquita.Api.Services
{
    public interface IEmailService
    {
        Task Enviar(string para, string asunto, string html);
    }
}