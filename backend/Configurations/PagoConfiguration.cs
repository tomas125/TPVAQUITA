using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vaquita.Api.Models;

namespace Vaquita.Api.Configurations
{
    public class PagoConfiguration : IEntityTypeConfiguration<Pago>
    {
        public void Configure(EntityTypeBuilder<Pago> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Importe).HasPrecision(18, 2);

            builder.HasOne(p => p.Grupo)
                .WithMany(g => g.Pagos)
                .HasForeignKey(p => p.GrupoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.Deudor)
                .WithMany()
                .HasForeignKey(p => p.DeudorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Acreedor)
                .WithMany()
                .HasForeignKey(p => p.AcreedorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}