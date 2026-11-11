namespace Vaquita.Api.Models
{
    public class LoginToken
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public string Token { get; set; } = string.Empty;
        public DateTime Expira { get; set; }
        public bool Usado { get; set; }
    }
}