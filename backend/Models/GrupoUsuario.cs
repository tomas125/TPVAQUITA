namespace Vaquita.Api.Models
{
    public class GrupoUsuario
    {
        public int GrupoId { get; set; }
        public Grupo Grupo { get; set; } = null!;

        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public DateTime FechaIngreso { get; set; } = DateTime.UtcNow;
    }
}