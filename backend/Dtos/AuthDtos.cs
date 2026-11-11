using System.ComponentModel.DataAnnotations;

namespace Vaquita.Api.Dtos
{
    public class SolicitarLinkDto
    {
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    }

    public class VerificarTokenDto
    {
        [Required] public string Token { get; set; } = string.Empty;
    }

    public class RespuestaAutenticacionDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiracion { get; set; }
        public UsuarioDto Usuario { get; set; } = new();
    }
}