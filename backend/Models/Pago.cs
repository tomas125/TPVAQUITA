namespace Vaquita.Api.Models
{
    public class Pago
    {
        public int Id { get; set; }

        public int GrupoId { get; set; }
        public Grupo Grupo { get; set; } = null!;

        public int DeudorId { get; set; }
        public Usuario Deudor { get; set; } = null!;

        public int AcreedorId { get; set; }
        public Usuario Acreedor { get; set; } = null!;

        public decimal Importe { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}