using Microsoft.EntityFrameworkCore;
using Vaquita.Api.Data;
using Vaquita.Api.Dtos;
using Vaquita.Api.Models;

namespace Vaquita.Api.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly AppDbContext context;

        public UsuarioService(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<UsuarioDto> Registrar(UsuarioCreacionDto dto)
        {
            // Regla de negocio: el email no se puede repetir
            var existe = await context.Usuarios.AnyAsync(u => u.Email == dto.Email);
            if (existe)
                throw new ReglaDeNegocioException("Ya existe un usuario con el email " + dto.Email);

            var usuario = new Usuario
            {
                Apellido = dto.Apellido,
                Nombre = dto.Nombre,
                Apodo = dto.Apodo,
                Email = dto.Email
            };

            context.Usuarios.Add(usuario);
            await context.SaveChangesAsync();

            return ADto(usuario);
        }

        public async Task<UsuarioActualDto?> ObtenerActual(int usuarioId)
        {
            var usuario = await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Id == usuarioId);
            if (usuario is null) return null;

            return new UsuarioActualDto
            {
                Id = usuario.Id,
                Apellido = usuario.Apellido,
                Nombre = usuario.Nombre,
                Apodo = usuario.Apodo,
                Email = usuario.Email,
                UltimoGrupoId = usuario.UltimoGrupoId
            };
        }

        private static UsuarioDto ADto(Usuario u) =>
            new() { Id = u.Id, Apellido = u.Apellido, Nombre = u.Nombre, Apodo = u.Apodo, Email = u.Email };
    }
}