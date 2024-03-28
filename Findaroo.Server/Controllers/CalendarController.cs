using Findaroo.Server.Mapper;
using Findaroo.Server.Model.RequestModel.CalendarEvent;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        PostgresContext _psql;

        public CalendarController(PostgresContext psql)
        {
            _psql = psql;
        }
    }
}
