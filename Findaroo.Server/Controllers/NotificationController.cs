using Findaroo.Server.Enums;
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
        public async Task<List<Notification>> getMyNonMessageNotifications(int offset)
        {
            String user_id = null;

            if (Request.Cookies["idToken"] == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }
            else
            {
                var userRecord = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(Request.Cookies["idToken"]);
                if (userRecord == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return null;
                }
                user_id = userRecord.Uid;
            }

            return _psql.notification
                .Where(n => n.receiver_id.Equals(user_id) && n.type != NotificationEnum.Message)
                .OrderByDescending(n => n.date_created)
                .Skip(offset)
                .Take(10)
                .ToList();
        }

        [HttpGet("Message")]
        public async Task<List<Notification>> getMyMessageNotification(int offset)
        {
            
            String user_id = null;

            if (Request.Cookies["idToken"] == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }
            else
            {
                var userRecord = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(Request.Cookies["idToken"]);
                if (userRecord == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return null;
                }
                user_id = userRecord.Uid;
            }

            return _psql.notification
                .Where(n => n.receiver_id.Equals(user_id) && n.type == NotificationEnum.Message)
                .OrderByDescending(n => n.date_created)
                .Skip(offset)
                .Take(10)
                .ToList();
        }

        [HttpPost]
        public async void recordNonMessageNotificationsAsSeen()
        {
            String user_id = null;

            if (Request.Cookies["idToken"] == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }
            else
            {
                var userRecord = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(Request.Cookies["idToken"]);
                if (userRecord == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
                user_id = userRecord.Uid;
            }

            _psql.notification
                .Where(n => n.receiver_id.Equals(user_id) && n.type != NotificationEnum.Message)
                .ToList().ForEach(n => n.seen = true);
            _psql.SaveChanges();
        }

        [HttpPost("Message")]
        public async void recordMessageNotificationAsSeen()
        {
            String user_id = null;

            if (Request.Cookies["idToken"] == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }
            else
            {
                var userRecord = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(Request.Cookies["idToken"]);
                if (userRecord == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
                user_id = userRecord.Uid;
            }

            _psql.notification
                .Where(n => n.receiver_id.Equals(user_id) && n.type == NotificationEnum.Message)
                .ToList().ForEach(n => n.seen = true);
            _psql.SaveChanges();
        }
    }
}
