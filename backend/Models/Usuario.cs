namespace Vaquita.Api.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Apellido { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Apodo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime FechaAlta { get; set; } = DateTime.UtcNow;

        // Sin FK a propósito: evita un ciclo Usuario <-> Grupo en SQL Server
        public int? UltimoGrupoId { get; set; }

        public ICollection<GrupoUsuario> Grupos { get; set; } = new List<GrupoUsuario>();
    }
}