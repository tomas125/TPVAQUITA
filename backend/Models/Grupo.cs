namespace Vaquita.Api.Models
{
    public class Grupo
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public int AdminId { get; set; }
        public Usuario Admin { get; set; } = null!;

        public ICollection<GrupoUsuario> Integrantes { get; set; } = new List<GrupoUsuario>();
        public ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();
        public ICollection<Pago> Pagos { get; set; } = new List<Pago>();
    }
}