using Findaroo.Server.Authentication;
using Findaroo.Server.Model.RequestModel.Connection;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using System.Net;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConnectionController : ControllerBase
    {
        PostgresContext _psql;
        IAuthenticationService _authenticationService;

        public ConnectionController(PostgresContext psql, IAuthenticationService authenticationService)
        {
            _psql = psql;
            _authenticationService = authenticationService;
        }

        [HttpGet]
        public IEnumerable<Connection> getMyConnections()
        {
            String user_id = null;
            try
            {
                if (!Request.Headers.TryGetValue("idToken", out StringValues idToken)) throw new Exception();
                user_id = _authenticationService.Authenticate(idToken).Result;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return null;
            }
            return _psql.connection
                .FromSql($"SELECT * from connection where user_1_id = {user_id} or user_2_id = {user_id}")
                .ToList();
        }

        [HttpDelete]
        public void deleteConnection([FromBody] String other_user_id)
        {
            String user_id = null;
            try
            {
                if (!Request.Headers.TryGetValue("idToken", out StringValues idToken)) throw new Exception();
                user_id = _authenticationService.Authenticate(idToken).Result;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            Connection conn = _psql.connection.Single(
                    c => (c.user_1_id == other_user_id && c.user_2_id == user_id)
                    || (c.user_1_id == user_id && c.user_2_id == other_user_id));
            _psql.connection.Remove(conn);
            _psql.SaveChanges();
        }
    }
}
