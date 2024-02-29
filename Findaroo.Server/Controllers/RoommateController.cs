using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

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
