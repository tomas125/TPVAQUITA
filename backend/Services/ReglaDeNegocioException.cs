namespace Vaquita.Api.Services
{
    public class ReglaDeNegocioException : Exception
    {
        public ReglaDeNegocioException(string mensaje) : base(mensaje) { }
    }
}