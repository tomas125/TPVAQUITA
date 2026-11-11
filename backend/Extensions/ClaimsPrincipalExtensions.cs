using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Vaquita.Api.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        // Lee el Id del usuario logueado desde el claim "sub" del JWT
        public static int ObtenerUsuarioId(this ClaimsPrincipal user)
        {
            var valor = user.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub);
            return int.Parse(valor!);
        }
    }
}