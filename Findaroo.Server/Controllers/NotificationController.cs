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
    public class NotificationController : ControllerBase
    {
        PostgresContext _psql;

        public NotificationController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public async Task<List<Notification>> getMyNotifications(int offset)
        {
            String user_id = null;

            if (Request.Cookies["idToken"] == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }
            else
            {
                var userRecord = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(Request.Cookies["idTOken"]);
                if (userRecord == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return null;
                }
                user_id = userRecord.Uid;
            }

            return _psql.notification
                .Where(n => n.receiver_id.Equals(user_id))
                .Skip(offset)
                .Take(10)
                .ToList();
        } 
    }
}
