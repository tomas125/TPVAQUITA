using Vaquita.Api.Dtos;

namespace Vaquita.Api.Services
{
    public interface IGrupoService
    {
        Task<GrupoDto> Crear(GrupoCreacionDto dto, int adminId);
        Task<List<GrupoDto>> ObtenerDeUsuario(int usuarioId, bool soloActivos);
        Task<GrupoDto?> ObtenerPorId(int id);
        Task<GrupoDto?> Unirse(int grupoId, int usuarioId);
        Task<bool> EsIntegrante(int grupoId, int usuarioId);
        Task GuardarUltimoGrupo(int usuarioId, int grupoId);
        Task Invitar(int grupoId, InvitacionDto dto);
    }
}