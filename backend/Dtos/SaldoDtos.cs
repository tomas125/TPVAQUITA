namespace Vaquita.Api.Dtos
{
    // Una fila del Cuadro 1
    public record SaldoPersonaDto(int UsuarioId, string Nombre, decimal TotalGastos, decimal Saldo);

    // Una fila del Cuadro 2: "Mario > Pedro 25.950$"
    public record DeudaDto(int DeudorId, string Deudor, int AcreedorId, string Acreedor, decimal Importe);

    public class ResumenSaldosDto
    {
        public List<SaldoPersonaDto> Cuadro1 { get; set; } = new();
        public decimal Total { get; set; }
        public decimal CuotaPorPersona { get; set; }
        public List<DeudaDto> Cuadro2 { get; set; } = new();
    }
}