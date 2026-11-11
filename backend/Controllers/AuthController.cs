using Microsoft.AspNetCore.Mvc;
using Vaquita.Api.Dtos;
using Vaquita.Api.Services;

namespace Vaquita.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    [Tags("Autenticación")]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioService usuarios;
        private readonly IAuthService auth;

        public AuthController(IUsuarioService usuarios, IAuthService auth)
        {
            this.usuarios = usuarios;
            this.auth = auth;
        }

        /// <summary>Alta de usuario: lo crea y le manda el link para ingresar.</summary>
        [HttpPost("registro")]
        public async Task<ActionResult> Registro(UsuarioCreacionDto dto)
        {
            await usuarios.Registrar(dto);
            var link = await auth.SolicitarLink(dto.Email);
            return Ok(new { mensaje = "Te enviamos un mail con el link para ingresar", link });
        }

        /// <summary>Pide un link de ingreso por mail.</summary>
        [HttpPost("login")]
        public async Task<ActionResult> Login(SolicitarLinkDto dto)
        {
            var link = await auth.SolicitarLink(dto.Email);
            return Ok(new { mensaje = "Te enviamos un mail con el link para ingresar", link });
        }

        /// <summary>Valida el token del link y devuelve el JWT.</summary>
        [HttpPost("verificar")]
        public async Task<ActionResult<RespuestaAutenticacionDto>> Verificar(VerificarTokenDto dto) =>
            await auth.Verificar(dto.Token);
    }
}