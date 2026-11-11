using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Vaquita.Api.Data;
using Vaquita.Api.Dtos;
using Vaquita.Api.Models;

namespace Vaquita.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext context;
        private readonly IConfiguration configuration;
        private readonly IEmailService email;

        public AuthService(AppDbContext context, IConfiguration configuration, IEmailService email)
        {
            this.context = context;
            this.configuration = configuration;
            this.email = email;
        }

        // 1) Genera un token de un solo uso y manda el link por mail
        public async Task<string?> SolicitarLink(string emailUsuario)
        {
            var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == emailUsuario);
            if (usuario is null)
                throw new ReglaDeNegocioException("No existe un usuario con ese email. Registrate primero.");

            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)); // 64 caracteres aleatorios

            context.LoginTokens.Add(new LoginToken
            {
                UsuarioId = usuario.Id,
                Token = token,
                Expira = DateTime.UtcNow.AddHours(1)
            });
            await context.SaveChangesAsync();

            var link = $"{configuration["FrontendUrl"]}/verificar?token={token}";

            await email.Enviar(usuario.Email, "Ingresá a Vaquita",
                $"<p>¡Hola {usuario.Nombre}!</p>" +
                $"<p><a href=\"{link}\">Hacé click acá para ingresar a Vaquita</a></p>" +
                $"<p>El link vence en 1 hora.</p>");

            // Sin SMTP configurado (desarrollo) se devuelve el link para mostrarlo en el front
            var sinSmtp = string.IsNullOrWhiteSpace(configuration["Smtp:Host"]) || string.IsNullOrWhiteSpace(configuration["Smtp:Password"]);
            return sinSmtp ? link : null;
        }

        // 2) Valida el token del link y devuelve el JWT
        public async Task<RespuestaAutenticacionDto> Verificar(string token)
        {
            var login = await context.LoginTokens
                .Include(t => t.Usuario)
                .FirstOrDefaultAsync(t => t.Token == token);

            if (login is null || login.Usado || login.Expira < DateTime.UtcNow)
                throw new ReglaDeNegocioException("El link es inválido o ya venció. Pedí uno nuevo.");

            login.Usado = true;   // un solo uso
            await context.SaveChangesAsync();

            return ConstruirToken(login.Usuario);
        }

        // Igual que en el código de clase: claims + clave + HmacSha256
        private RespuestaAutenticacionDto ConstruirToken(Usuario usuario)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                new Claim("apodo", usuario.Apodo)
            };

            var llave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
            var credenciales = new SigningCredentials(llave, SecurityAlgorithms.HmacSha256);
            var expiracion = DateTime.UtcNow.AddDays(60);   // queda logueado en el dispositivo

            var securityToken = new JwtSecurityToken(
                claims: claims,
                expires: expiracion,
                signingCredentials: credenciales);

            return new RespuestaAutenticacionDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(securityToken),
                Expiracion = expiracion,
                Usuario = new UsuarioDto
                {
                    Id = usuario.Id,
                    Apellido = usuario.Apellido,
                    Nombre = usuario.Nombre,
                    Apodo = usuario.Apodo,
                    Email = usuario.Email
                }
            };
        }
    }
}