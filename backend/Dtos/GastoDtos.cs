using System.ComponentModel.DataAnnotations;

namespace Vaquita.Api.Dtos
{
    public class GastoCreacionDto
    {
        public int PagadorId { get; set; }      // quién pagó (puede ser otro integrante)

        [Range(0.01, double.MaxValue, ErrorMessage = "El importe debe ser positivo")]
        public decimal Importe { get; set; }

        [Required, MaxLength(150)]
        public string Descripcion { get; set; } = string.Empty;

        public int? RubroId { get; set; }       // opcional
    }

    public class GastoDto
    {
        public int Id { get; set; }
        public int PagadorId { get; set; }
        public string Pagador { get; set; } = string.Empty;   // apodo
        public string Descripcion { get; set; } = string.Empty;
        public string? Rubro { get; set; }
        public decimal Importe { get; set; }
        public DateTime Fecha { get; set; }
    }

    public class RubroDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
    }
}