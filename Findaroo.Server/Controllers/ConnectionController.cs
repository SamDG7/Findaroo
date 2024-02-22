using Findaroo.Server.Model.RequestModel.Connection;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConnectionController : ControllerBase
    {
        PostgresContext _psql;
        public ConnectionController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public List<Connection> getMyConnections(String user_id)
        {
            return _psql.connection
                .FromSql($"SELECT * from connection where user_1_id = {user_id} or user_2_id = {user_id}")
                .ToList();
        }

        [HttpDelete]
        public void deleteConnection([FromBody] DeleteConnectionRequest deleteConnectionRequest)
        {
            Connection conn = _psql.connection.Single(
                    c => (c.user_1_id == deleteConnectionRequest.user_1_id && c.user_2_id == deleteConnectionRequest.user_2_id)
                    || (c.user_1_id == deleteConnectionRequest.user_2_id && c.user_2_id == deleteConnectionRequest.user_1_id));
            _psql.connection.Remove(conn);
            _psql.SaveChanges();
        }
    }
}
