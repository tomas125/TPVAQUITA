using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vaquita.Api.Models;

namespace Vaquita.Api.Configurations
{
    public class GrupoConfiguration : IEntityTypeConfiguration<Grupo>
    {
        public void Configure(EntityTypeBuilder<Grupo> builder)
        {
            builder.HasKey(g => g.Id);
            builder.Property(g => g.Descripcion).IsRequired().HasMaxLength(100);

            builder.HasOne(g => g.Admin)
                .WithMany()
                .HasForeignKey(g => g.AdminId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}