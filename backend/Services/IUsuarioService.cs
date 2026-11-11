using Vaquita.Api.Dtos;

namespace Vaquita.Api.Services
{
    public interface IUsuarioService
    {
        Task<UsuarioDto> Registrar(UsuarioCreacionDto dto);
        Task<UsuarioActualDto?> ObtenerActual(int usuarioId);
    }
}