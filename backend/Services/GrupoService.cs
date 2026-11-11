using Microsoft.EntityFrameworkCore;
using Vaquita.Api.Data;
using Vaquita.Api.Dtos;
using Vaquita.Api.Models;

namespace Vaquita.Api.Services
{
    public class GrupoService : IGrupoService
    {
        private readonly AppDbContext context;
        private readonly IEmailService email;
        private readonly IConfiguration configuration;

        public GrupoService(AppDbContext context, IEmailService email, IConfiguration configuration)
        {
            this.context = context;
            this.email = email;
            this.configuration = configuration;
        }

       public async Task<GrupoDto> Crear(GrupoCreacionDto dto, int adminId)
       {
            var grupo = new Grupo { Descripcion = dto.Descripcion, AdminId = adminId };
            grupo.Integrantes.Add(new GrupoUsuario { UsuarioId = adminId });

            context.Grupos.Add(grupo);
            await context.SaveChangesAsync();

            return (await ObtenerPorId(grupo.Id))!;
        }

        public async Task<List<GrupoDto>> ObtenerDeUsuario(int usuarioId, bool soloActivos)
        {
            var query = context.Grupos
                .Where(g => g.Integrantes.Any(i => i.UsuarioId == usuarioId));

            if (soloActivos)
                query = query.Where(g => g.Activo);

            var grupos = await query
                .Include(g => g.Integrantes).ThenInclude(i => i.Usuario)
                .AsNoTracking()
                .ToListAsync();

            return grupos.Select(ADto).ToList();
        }

        public async Task<GrupoDto?> ObtenerPorId(int id)
        {
            var grupo = await context.Grupos
                .Include(g => g.Integrantes).ThenInclude(i => i.Usuario)
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == id);

            return grupo is null ? null : ADto(grupo);
        }

        public async Task<GrupoDto?> Unirse(int grupoId, int usuarioId)
        {
            var grupo = await context.Grupos
                .Include(g => g.Integrantes)
                .FirstOrDefaultAsync(g => g.Id == grupoId);

            if (grupo is null) return null;

            if (!grupo.Activo)
                throw new ReglaDeNegocioException("El grupo está cerrado");

            var existeUsuario = await context.Usuarios.AnyAsync(u => u.Id == usuarioId);
            if (!existeUsuario)
                throw new ReglaDeNegocioException("El usuario no está registrado");

            // Si ya es integrante, no hace nada (por si escanea el QR dos veces)
            if (!grupo.Integrantes.Any(i => i.UsuarioId == usuarioId))
            {
                grupo.Integrantes.Add(new GrupoUsuario { UsuarioId = usuarioId });
                await context.SaveChangesAsync();
            }

            return await ObtenerPorId(grupoId);
        }

        public async Task<bool> EsIntegrante(int grupoId, int usuarioId) => await context.GruposUsuarios.AnyAsync(gu => gu.GrupoId == grupoId && gu.UsuarioId == usuarioId);

        public async Task GuardarUltimoGrupo(int usuarioId, int grupoId)
        {
            // ExecuteUpdate: un solo UPDATE, sin cargar el usuario
            await context.Usuarios
                .Where(u => u.Id == usuarioId)
                .ExecuteUpdateAsync(s => s.SetProperty(u => u.UltimoGrupoId, grupoId));
        }

        // El permiso de admin lo valida el Controller; acá van las reglas de negocio
        public async Task Invitar(int grupoId, InvitacionDto dto)
        {
            var grupo = await context.Grupos.AsNoTracking().FirstOrDefaultAsync(g => g.Id == grupoId);
            if (grupo is null) throw new ReglaDeNegocioException("El grupo no existe");

            if (!grupo.Activo)
                throw new ReglaDeNegocioException("El grupo está cerrado");

            var invitado = await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (invitado is null)
                throw new ReglaDeNegocioException("No existe un usuario registrado con ese email");

            var link = $"{configuration["FrontendUrl"]}/unirse/{grupoId}";

            await email.Enviar(invitado.Email, $"Te invitaron al grupo {grupo.Descripcion}",
                $"<p>¡Hola {invitado.Nombre}!</p>" +
                $"<p>Te invitaron a unirte al grupo <b>{grupo.Descripcion}</b> en Vaquita.</p>" +
                $"<p><a href=\"{link}\">Hacé click acá para unirte</a></p>");
        }

        private static GrupoDto ADto(Grupo g) => new()
        {
            Id = g.Id,
            Descripcion = g.Descripcion,
            Activo = g.Activo,
            AdminId = g.AdminId,
            Integrantes = g.Integrantes
                .OrderBy(i => i.FechaIngreso)
                .Select(i => new UsuarioDto
                {
                    Id = i.Usuario.Id,
                    Apellido = i.Usuario.Apellido,
                    Nombre = i.Usuario.Nombre,
                    Apodo = i.Usuario.Apodo,
                    Email = i.Usuario.Email
                }).ToList()
        };
    }
}