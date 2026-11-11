using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vaquita.Api.Models;

namespace Vaquita.Api.Configurations
{
    public class LoginTokenConfiguration : IEntityTypeConfiguration<LoginToken>
    {
        public void Configure(EntityTypeBuilder<LoginToken> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Token).IsRequired().HasMaxLength(100);
            builder.HasIndex(t => t.Token).IsUnique();

            builder.HasOne(t => t.Usuario)
                .WithMany()
                .HasForeignKey(t => t.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}