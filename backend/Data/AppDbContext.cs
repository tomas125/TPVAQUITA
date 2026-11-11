using Microsoft.EntityFrameworkCore;
using Vaquita.Api.Models;

namespace Vaquita.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<LoginToken> LoginTokens => Set<LoginToken>();
        public DbSet<Grupo> Grupos => Set<Grupo>();
        public DbSet<GrupoUsuario> GruposUsuarios => Set<GrupoUsuario>();
        public DbSet<Rubro> Rubros => Set<Rubro>();
        public DbSet<Gasto> Gastos => Set<Gasto>();
        public DbSet<Pago> Pagos => Set<Pago>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}