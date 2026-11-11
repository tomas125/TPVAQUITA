using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vaquita.Api.Models;

namespace Vaquita.Api.Configurations
{
    public class GrupoUsuarioConfiguration : IEntityTypeConfiguration<GrupoUsuario>
    {
        public void Configure(EntityTypeBuilder<GrupoUsuario> builder)
        {
            builder.HasKey(gu => new { gu.GrupoId, gu.UsuarioId });

            builder.HasOne(gu => gu.Grupo)
                .WithMany(g => g.Integrantes)
                .HasForeignKey(gu => gu.GrupoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(gu => gu.Usuario)
                .WithMany(u => u.Grupos)
                .HasForeignKey(gu => gu.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}