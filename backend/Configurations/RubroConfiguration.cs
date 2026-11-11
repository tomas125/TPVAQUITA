using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vaquita.Api.Models;

namespace Vaquita.Api.Configurations
{
    public class RubroConfiguration : IEntityTypeConfiguration<Rubro>
    {
        public void Configure(EntityTypeBuilder<Rubro> builder)
        {
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Nombre).IsRequired().HasMaxLength(50);

            builder.HasData(
                new Rubro { Id = 1, Nombre = "Combustible" },
                new Rubro { Id = 2, Nombre = "Comida" },
                new Rubro { Id = 3, Nombre = "Alojamiento" },
                new Rubro { Id = 4, Nombre = "Transporte" },
                new Rubro { Id = 5, Nombre = "Materiales" },
                new Rubro { Id = 6, Nombre = "Otros" }
            );
        }
    }
}