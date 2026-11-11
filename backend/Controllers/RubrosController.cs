using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vaquita.Api.Dtos;
using Vaquita.Api.Services;

namespace Vaquita.Api.Controllers
{
    [ApiController]
    [Route("api/rubros")]
    [Tags("Rubros")]
    public class RubrosController : ControllerBase
    {
        private readonly IGastoService servicio;

        public RubrosController(IGastoService servicio)
        {
            this.servicio = servicio;
        }

        [HttpGet]
        public async Task<ActionResult<List<RubroDto>>> Get() =>
            await servicio.ObtenerRubros();
    }
}