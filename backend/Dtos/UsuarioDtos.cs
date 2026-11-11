using System.ComponentModel.DataAnnotations;

namespace Vaquita.Api.Dtos
{
    // Lo que manda el cliente para registrarse
    public class UsuarioCreacionDto
    {
        [Required, MaxLength(100)] public string Apellido { get; set; } = string.Empty;
        [Required, MaxLength(100)] public string Nombre { get; set; } = string.Empty;
        [Required, MaxLength(50)]  public string Apodo { get; set; } = string.Empty;
        [Required, EmailAddress]   public string Email { get; set; } = string.Empty;
    }

    // Lo que devuelve la API
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string Apellido { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Apodo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // GET api/usuarios/me: el usuario logueado + el último grupo que abrió
    public class UsuarioActualDto : UsuarioDto
    {
        public int? UltimoGrupoId { get; set; }
    }
}