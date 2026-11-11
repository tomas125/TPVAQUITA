using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vaquita.Api.Dtos;
using Vaquita.Api.Extensions;
using Vaquita.Api.Services;

namespace Vaquita.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/grupos")]
    [Tags("Grupos")]
    public class GruposController : ControllerBase
    {
        private readonly IGrupoService servicio;

        public GruposController(IGrupoService servicio)
        {
            this.servicio = servicio;
        }

        [HttpPost]
        public async Task<ActionResult<GrupoDto>> Crear(GrupoCreacionDto dto)
        {
            var grupo = await servicio.Crear(dto, User.ObtenerUsuarioId());
            return CreatedAtAction(nameof(ObtenerPorId), new { id = grupo.Id }, grupo);
        }

        // Grupos del usuario logueado (para el desplegable)
        [HttpGet]
        public async Task<ActionResult<List<GrupoDto>>> MisGrupos(bool soloActivos = true) =>
            await servicio.ObtenerDeUsuario(User.ObtenerUsuarioId(), soloActivos);

        [HttpGet("{id:int}")]
        public async Task<ActionResult<GrupoDto>> ObtenerPorId(int id)
        {
            var grupo = await servicio.ObtenerPorId(id);
            if (grupo is null) return NotFound();
            var usuarioId = User.ObtenerUsuarioId();
            if (!await servicio.EsIntegrante(id, usuarioId)) return Forbid();   // 403

            await servicio.GuardarUltimoGrupo(usuarioId, id);   // el front arranca en este grupo
            return grupo;
        }

        // Solo el admin invita; el invitado debe estar registrado
        [HttpPost("{id:int}/invitar")]
        public async Task<ActionResult> Invitar(int id, InvitacionDto dto)
        {
            var grupo = await servicio.ObtenerPorId(id);
            if (grupo is null) return NotFound();
            if (grupo.AdminId != User.ObtenerUsuarioId()) return Forbid();   // 403

            await servicio.Invitar(id, dto);
            return NoContent();
        }

        // Destino del QR y del mail: se une el usuario logueado
        [HttpPost("{id:int}/unirse")]
        public async Task<ActionResult<GrupoDto>> Unirse(int id)
        {
            var grupo = await servicio.Unirse(id, User.ObtenerUsuarioId());
            if (grupo is null) return NotFound();
            return grupo;
        }
    }
}