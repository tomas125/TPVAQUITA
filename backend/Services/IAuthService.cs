using Vaquita.Api.Dtos;

namespace Vaquita.Api.Services
{
    public interface IAuthService
    {
        Task<string?> SolicitarLink(string email);   // devuelve el link solo en desarrollo (sin SMTP)
        Task<RespuestaAutenticacionDto> Verificar(string token);
    }
}