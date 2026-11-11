using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vaquita.Api.Dtos;
using Vaquita.Api.Extensions;
using Vaquita.Api.Services;

namespace Vaquita.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/usuarios")]
    [Tags("Usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService servicio;

        public UsuariosController(IUsuarioService servicio)
        {
            this.servicio = servicio;
        }

        // Datos del usuario logueado (incluye el último grupo usado)
        [HttpGet("me")]
        public async Task<ActionResult<UsuarioActualDto>> Me()
        {
            var usuario = await servicio.ObtenerActual(User.ObtenerUsuarioId());
            if (usuario is null) return NotFound();
            return usuario;
        }
    }
}
