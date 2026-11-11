namespace Vaquita.Api.Models
{
    public class Gasto
    {
        public int Id { get; set; }

        public int GrupoId { get; set; }
        public Grupo Grupo { get; set; } = null!;

        // Quién pagó (puede ser otro integrante)
        public int PagadorId { get; set; }
        public Usuario Pagador { get; set; } = null!;

        // Quién lo cargó en la app
        public int CargadoPorId { get; set; }
        public Usuario CargadoPor { get; set; } = null!;

        public decimal Importe { get; set; }
        public string Descripcion { get; set; } = string.Empty;

        public int? RubroId { get; set; }
        public Rubro? Rubro { get; set; }

        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}