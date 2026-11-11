using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vaquita.Api.Dtos;
using Vaquita.Api.Extensions;
using Vaquita.Api.Services;

namespace Vaquita.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/grupos/{grupoId:int}/gastos")]
    [Tags("Gastos")]
    public class GastosController : ControllerBase
    {
        private readonly IGastoService servicio;
        private readonly IGrupoService grupos;

        public GastosController(IGastoService servicio, IGrupoService grupos)
        {
            this.servicio = servicio;
            this.grupos = grupos;
        }

        [HttpGet]
        public async Task<ActionResult<List<GastoDto>>> Get(int grupoId)
        {
            if (!await grupos.EsIntegrante(grupoId, User.ObtenerUsuarioId())) return Forbid();
            var gastos = await servicio.ObtenerDeGrupo(grupoId);
            if (gastos is null) return NotFound();
            return gastos;
        }

        [HttpPost]
        public async Task<ActionResult<GastoDto>> Post(int grupoId, GastoCreacionDto dto)
        {
            var usuarioId = User.ObtenerUsuarioId();
            if (!await grupos.EsIntegrante(grupoId, usuarioId)) return Forbid();
            var gasto = await servicio.Crear(grupoId, dto, usuarioId);
            if (gasto is null) return NotFound();
            return Ok(gasto);
        }
    }
}