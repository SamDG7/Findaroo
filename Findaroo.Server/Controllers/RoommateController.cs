using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoommateController : ControllerBase
    {
        PostgresContext _psql;

        public RoommateController(PostgresContext psql)
        {
            _psql = psql;
        }
    }
}
