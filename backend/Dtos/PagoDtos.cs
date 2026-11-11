using System.ComponentModel.DataAnnotations;

namespace Vaquita.Api.Dtos
{
    public class PagoCreacionDto
    {
        public int DeudorId { get; set; }     // quién paga
        public int AcreedorId { get; set; }   // a quién le paga

        [Range(0.01, double.MaxValue, ErrorMessage = "El importe debe ser positivo")]
        public decimal Importe { get; set; }
    }

    public class PagoDto
    {
        public int Id { get; set; }
        public int DeudorId { get; set; }
        public string Deudor { get; set; } = string.Empty;
        public int AcreedorId { get; set; }
        public string Acreedor { get; set; } = string.Empty;
        public decimal Importe { get; set; }
        public DateTime Fecha { get; set; }
    }
}