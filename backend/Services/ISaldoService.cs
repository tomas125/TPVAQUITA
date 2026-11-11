using Vaquita.Api.Dtos;

namespace Vaquita.Api.Services
{
    public interface ISaldoService
    {
        Task<ResumenSaldosDto?> ObtenerSaldos(int grupoId);
        Task<PagoDto?> RegistrarPago(int grupoId, PagoCreacionDto dto);
        Task<List<PagoDto>?> ObtenerPagos(int grupoId);
        Task<bool> CerrarGrupo(int grupoId);
    }
}