using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vaquita.Api.Dtos;
using Vaquita.Api.Extensions;
using Vaquita.Api.Services;

namespace Vaquita.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/grupos/{grupoId:int}")]
    [Tags("Saldos y pagos")]
    public class SaldosController : ControllerBase
    {
        private readonly ISaldoService servicio;
        private readonly IGrupoService grupos;

        public SaldosController(ISaldoService servicio, IGrupoService grupos)
        {
            this.servicio = servicio;
            this.grupos = grupos;
        }

        private async Task<bool> SoyIntegrante(int grupoId) =>
            await grupos.EsIntegrante(grupoId, User.ObtenerUsuarioId());

        [HttpGet("saldos")]
        public async Task<ActionResult<ResumenSaldosDto>> GetSaldos(int grupoId)
        {
            if (!await SoyIntegrante(grupoId)) return Forbid();
            var resumen = await servicio.ObtenerSaldos(grupoId);
            if (resumen is null) return NotFound();
            return resumen;
        }

        [HttpGet("pagos")]
        public async Task<ActionResult<List<PagoDto>>> GetPagos(int grupoId)
        {
            if (!await SoyIntegrante(grupoId)) return Forbid();
            var pagos = await servicio.ObtenerPagos(grupoId);
            if (pagos is null) return NotFound();
            return pagos;
        }

        [HttpPost("pagos")]
        public async Task<ActionResult<PagoDto>> PostPago(int grupoId, PagoCreacionDto dto)
        {
            if (!await SoyIntegrante(grupoId)) return Forbid();
            var pago = await servicio.RegistrarPago(grupoId, dto);
            if (pago is null) return NotFound();
            return Ok(pago);
        }

        [HttpPost("cerrar")]
        public async Task<ActionResult> Cerrar(int grupoId)
        {
            if (!await SoyIntegrante(grupoId)) return Forbid();
            var cerrado = await servicio.CerrarGrupo(grupoId);
            if (!cerrado) return NotFound();
            return NoContent();
        }
    }
}