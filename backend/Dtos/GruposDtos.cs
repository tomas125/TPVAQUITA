using System.ComponentModel.DataAnnotations;

namespace Vaquita.Api.Dtos
{
    public class GrupoCreacionDto
    {
        [Required, MaxLength(100)] public string Descripcion { get; set; } = string.Empty;
       
    }

 

    public class InvitacionDto
    {
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    }

    public class GrupoDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public int AdminId { get; set; }
        public List<UsuarioDto> Integrantes { get; set; } = new();
    }
}