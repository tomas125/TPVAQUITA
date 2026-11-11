using Microsoft.EntityFrameworkCore;
using Vaquita.Api.Data;
using Vaquita.Api.Dtos;
using Vaquita.Api.Models;

namespace Vaquita.Api.Services
{
    public class SaldoService : ISaldoService
    {
        private readonly AppDbContext context;

        public SaldoService(AppDbContext context)
        {
            this.context = context;
        }

        // ===== Cuadro 1 y Cuadro 2 =====
        public async Task<ResumenSaldosDto?> ObtenerSaldos(int grupoId)
        {
            var grupo = await ObtenerGrupoConIntegrantes(grupoId);
            if (grupo is null) return null;

            return await Calcular(grupo);
        }

        // ===== Registrar un pago (total o parcial) =====
        public async Task<PagoDto?> RegistrarPago(int grupoId, PagoCreacionDto dto)
        {
            var grupo = await ObtenerGrupoConIntegrantes(grupoId);
            if (grupo is null) return null;

            if (!grupo.Activo)
                throw new ReglaDeNegocioException("El grupo está cerrado");

            if (dto.DeudorId == dto.AcreedorId)
                throw new ReglaDeNegocioException("Un usuario no puede pagarse a sí mismo");

            if (!grupo.Integrantes.Any(i => i.UsuarioId == dto.DeudorId) ||
                !grupo.Integrantes.Any(i => i.UsuarioId == dto.AcreedorId))
                throw new ReglaDeNegocioException("Ambos usuarios deben ser integrantes del grupo");

            // Regla: no puede pagar más de lo que debe ni más de lo que el otro tiene a favor
            var resumen = await Calcular(grupo);
            var saldoDeudor = resumen.Cuadro1.First(s => s.UsuarioId == dto.DeudorId).Saldo;
            var saldoAcreedor = resumen.Cuadro1.First(s => s.UsuarioId == dto.AcreedorId).Saldo;

            if (saldoDeudor >= 0)
                throw new ReglaDeNegocioException("El usuario que paga no tiene deuda");
            if (saldoAcreedor <= 0)
                throw new ReglaDeNegocioException("El usuario que recibe no tiene saldo a favor");

            var maximo = Math.Min(-saldoDeudor, saldoAcreedor);
            if (dto.Importe > maximo + CalculadoraSaldos.Tolerancia)
                throw new ReglaDeNegocioException($"El importe máximo para este pago es {maximo:N2}");

            var pago = new Pago
            {
                GrupoId = grupoId,
                DeudorId = dto.DeudorId,
                AcreedorId = dto.AcreedorId,
                Importe = dto.Importe
            };

            context.Pagos.Add(pago);
            await context.SaveChangesAsync();

            var creado = await context.Pagos
                .Include(p => p.Deudor)
                .Include(p => p.Acreedor)
                .AsNoTracking()
                .FirstAsync(p => p.Id == pago.Id);

            return ADto(creado);
        }

        // ===== Historial de pagos =====
        public async Task<List<PagoDto>?> ObtenerPagos(int grupoId)
        {
            if (!await context.Grupos.AnyAsync(g => g.Id == grupoId)) return null;

            var pagos = await context.Pagos
                .Where(p => p.GrupoId == grupoId)
                .Include(p => p.Deudor)
                .Include(p => p.Acreedor)
                .OrderByDescending(p => p.Fecha)
                .AsNoTracking()
                .ToListAsync();

            return pagos.Select(ADto).ToList();
        }

        // ===== Cerrar grupo (todos los saldos en cero) =====
        public async Task<bool> CerrarGrupo(int grupoId)
        {
            var grupo = await context.Grupos
                .Include(g => g.Integrantes).ThenInclude(i => i.Usuario)
                .FirstOrDefaultAsync(g => g.Id == grupoId);

            if (grupo is null) return false;

            if (!grupo.Activo)
                throw new ReglaDeNegocioException("El grupo ya está cerrado");

            var resumen = await Calcular(grupo);
            if (resumen.Cuadro1.Any(s => Math.Abs(s.Saldo) > CalculadoraSaldos.Tolerancia))
                throw new ReglaDeNegocioException("No se puede cerrar el grupo: todavía hay saldos pendientes");

            grupo.Activo = false;
            await context.SaveChangesAsync();
            return true;
        }

        // ===== Auxiliares =====
        private async Task<Grupo?> ObtenerGrupoConIntegrantes(int grupoId) =>
            await context.Grupos
                .Include(g => g.Integrantes).ThenInclude(i => i.Usuario)
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == grupoId);

        private async Task<ResumenSaldosDto> Calcular(Grupo grupo)
        {
            var integrantes = grupo.Integrantes
                .OrderBy(i => i.FechaIngreso)   // respeta el orden de ingreso al grupo
                .Select(i => new IntegranteSaldo(i.UsuarioId, i.Usuario.Apodo))
                .ToList();

            var gastos = await context.Gastos
                .Where(g => g.GrupoId == grupo.Id)
                .Select(g => new MovimientoGasto(g.PagadorId, g.Importe))
                .ToListAsync();

            var pagos = await context.Pagos
                .Where(p => p.GrupoId == grupo.Id)
                .Select(p => new MovimientoPago(p.DeudorId, p.AcreedorId, p.Importe))
                .ToListAsync();

            return CalculadoraSaldos.Calcular(integrantes, gastos, pagos);
        }

        private static PagoDto ADto(Pago p) => new()
        {
            Id = p.Id,
            DeudorId = p.DeudorId,
            Deudor = p.Deudor.Apodo,
            AcreedorId = p.AcreedorId,
            Acreedor = p.Acreedor.Apodo,
            Importe = p.Importe,
            Fecha = p.Fecha
        };
    }
}