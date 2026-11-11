using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vaquita.Api.Models;

namespace Vaquita.Api.Configurations
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Apellido).IsRequired().HasMaxLength(100);
            builder.Property(u => u.Nombre).IsRequired().HasMaxLength(100);
            builder.Property(u => u.Apodo).IsRequired().HasMaxLength(50);
            builder.Property(u => u.Email).IsRequired().HasMaxLength(150);
            builder.HasIndex(u => u.Email).IsUnique();
        }
    }
}