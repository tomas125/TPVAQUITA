using Vaquita.Api.Dtos;

namespace Vaquita.Api.Services
{
    // Datos mínimos que necesita el cálculo (no dependen de EF Core)
    public record IntegranteSaldo(int UsuarioId, string Nombre);
    public record MovimientoGasto(int PagadorId, decimal Importe);
    public record MovimientoPago(int DeudorId, int AcreedorId, decimal Importe);

    public static class CalculadoraSaldos
    {
        // Diferencias menores a 1 centavo se consideran cero (por redondeo)
        public const decimal Tolerancia = 0.01m;

        public static ResumenSaldosDto Calcular(
            IReadOnlyList<IntegranteSaldo> integrantes,
            IEnumerable<MovimientoGasto> gastos,
            IEnumerable<MovimientoPago> pagos)
        {
            var listaGastos = gastos.ToList();
            var listaPagos = pagos.ToList();

            decimal total = listaGastos.Sum(g => g.Importe);
            decimal cuota = integrantes.Count == 0 ? 0 : Math.Round(total / integrantes.Count, 2);

            // Cuadro 1: saldo = gastado - cuota + pagos que hizo - pagos que recibió
            var cuadro1 = integrantes.Select(i =>
            {
                decimal gastado  = listaGastos.Where(g => g.PagadorId == i.UsuarioId).Sum(g => g.Importe);
                decimal pagoHizo = listaPagos.Where(p => p.DeudorId == i.UsuarioId).Sum(p => p.Importe);
                decimal recibio  = listaPagos.Where(p => p.AcreedorId == i.UsuarioId).Sum(p => p.Importe);

                decimal saldo = Math.Round(gastado - cuota + pagoHizo - recibio, 2);
                return new SaldoPersonaDto(i.UsuarioId, i.Nombre, gastado, saldo);
            }).ToList();

            return new ResumenSaldosDto
            {
                Cuadro1 = cuadro1,
                Total = total,
                CuotaPorPersona = cuota,
                Cuadro2 = CalcularDeudas(cuadro1)
            };
        }

        // Cuadro 2: algoritmo greedy, respetando el orden de ingreso al grupo
        private static List<DeudaDto> CalcularDeudas(List<SaldoPersonaDto> saldos)
        {
            var acreedores = saldos.Where(s => s.Saldo > Tolerancia)
                                   .Select(s => new Pendiente(s.UsuarioId, s.Nombre, s.Saldo)).ToList();
            var deudores   = saldos.Where(s => s.Saldo < -Tolerancia)
                                   .Select(s => new Pendiente(s.UsuarioId, s.Nombre, -s.Saldo)).ToList();

            var deudas = new List<DeudaDto>();
            int i = 0, j = 0;

            while (i < deudores.Count && j < acreedores.Count)
            {
                decimal monto = Math.Min(deudores[i].Monto, acreedores[j].Monto);

                deudas.Add(new DeudaDto(deudores[i].UsuarioId, deudores[i].Nombre,
                                        acreedores[j].UsuarioId, acreedores[j].Nombre, monto));

                deudores[i].Monto   -= monto;
                acreedores[j].Monto -= monto;

                if (deudores[i].Monto <= Tolerancia) i++;
                if (acreedores[j].Monto <= Tolerancia) j++;
            }

            return deudas;
        }

        private class Pendiente
        {
            public int UsuarioId { get; }
            public string Nombre { get; }
            public decimal Monto { get; set; }

            public Pendiente(int usuarioId, string nombre, decimal monto)
            {
                UsuarioId = usuarioId;
                Nombre = nombre;
                Monto = monto;
            }
        }
    }
}