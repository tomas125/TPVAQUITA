using Vaquita.Api.Dtos;

namespace Vaquita.Api.Services
{
    public interface IAuthService
    {
        Task SolicitarLink(string email);
        Task<RespuestaAutenticacionDto> Verificar(string token);
    }
}