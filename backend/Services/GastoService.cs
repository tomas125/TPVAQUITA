using Microsoft.EntityFrameworkCore;
using Vaquita.Api.Data;
using Vaquita.Api.Dtos;
using Vaquita.Api.Models;

namespace Vaquita.Api.Services
{
    public class GastoService : IGastoService
    {
        private readonly AppDbContext context;

        public GastoService(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<GastoDto?> Crear(int grupoId, GastoCreacionDto dto, int cargadoPorId)
        {
            var grupo = await context.Grupos
                .Include(g => g.Integrantes)
                .FirstOrDefaultAsync(g => g.Id == grupoId);

            if (grupo is null) return null;   // el Controller devuelve 404

            if (!grupo.Activo)
                throw new ReglaDeNegocioException("No se pueden cargar gastos en un grupo cerrado");

            if (!grupo.Integrantes.Any(i => i.UsuarioId == dto.PagadorId))
                throw new ReglaDeNegocioException("El pagador no es integrante del grupo");

            if (!grupo.Integrantes.Any(i => i.UsuarioId == cargadoPorId))
                throw new ReglaDeNegocioException("Solo un integrante del grupo puede cargar gastos");

            if (dto.RubroId is not null && !await context.Rubros.AnyAsync(r => r.Id == dto.RubroId))
                throw new ReglaDeNegocioException("El rubro no existe");

            var gasto = new Gasto
            {
                GrupoId = grupoId,
                PagadorId = dto.PagadorId,
                CargadoPorId = cargadoPorId,
                Importe = dto.Importe,
                Descripcion = dto.Descripcion,
                RubroId = dto.RubroId
            };

            context.Gastos.Add(gasto);
            await context.SaveChangesAsync();

            // Recargo con Pagador y Rubro para devolver el DTO completo
            var creado = await context.Gastos
                .Include(g => g.Pagador)
                .Include(g => g.Rubro)
                .AsNoTracking()
                .FirstAsync(g => g.Id == gasto.Id);

            return ADto(creado);
        }

        public async Task<List<GastoDto>?> ObtenerDeGrupo(int grupoId)
        {
            var existe = await context.Grupos.AnyAsync(g => g.Id == grupoId);
            if (!existe) return null;

            var gastos = await context.Gastos
                .Where(g => g.GrupoId == grupoId)
                .Include(g => g.Pagador)
                .Include(g => g.Rubro)
                .OrderByDescending(g => g.Fecha)
                .AsNoTracking()
                .ToListAsync();

            return gastos.Select(ADto).ToList();
        }

        public async Task<List<RubroDto>> ObtenerRubros() =>
            await context.Rubros
                .OrderBy(r => r.Nombre)
                .Select(r => new RubroDto { Id = r.Id, Nombre = r.Nombre })
                .ToListAsync();

        private static GastoDto ADto(Gasto g) => new()
        {
            Id = g.Id,
            PagadorId = g.PagadorId,
            Pagador = g.Pagador.Apodo,
            Descripcion = g.Descripcion,
            Rubro = g.Rubro?.Nombre,
            Importe = g.Importe,
            Fecha = g.Fecha
        };
    }
}