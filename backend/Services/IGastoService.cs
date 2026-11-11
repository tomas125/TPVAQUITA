using Vaquita.Api.Dtos;

namespace Vaquita.Api.Services
{
    public interface IGastoService
    {
        Task<GastoDto?> Crear(int grupoId, GastoCreacionDto dto, int cargadoPorId);
        Task<List<GastoDto>?> ObtenerDeGrupo(int grupoId);
        Task<List<RubroDto>> ObtenerRubros();
    }
}