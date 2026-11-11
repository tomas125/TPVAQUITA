using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vaquita.Api.Models;

namespace Vaquita.Api.Configurations
{
    public class GastoConfiguration : IEntityTypeConfiguration<Gasto>
    {
        public void Configure(EntityTypeBuilder<Gasto> builder)
        {
            builder.HasKey(g => g.Id);
            builder.Property(g => g.Importe).HasPrecision(18, 2);
            builder.Property(g => g.Descripcion).IsRequired().HasMaxLength(150);

            builder.HasOne(g => g.Grupo)
                .WithMany(gr => gr.Gastos)
                .HasForeignKey(g => g.GrupoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(g => g.Pagador)
                .WithMany()
                .HasForeignKey(g => g.PagadorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(g => g.CargadoPor)
                .WithMany()
                .HasForeignKey(g => g.CargadoPorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(g => g.Rubro)
                .WithMany()
                .HasForeignKey(g => g.RubroId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}