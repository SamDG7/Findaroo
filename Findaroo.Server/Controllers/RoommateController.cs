using Findaroo.Server.Model.RequestModel.Roommate;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
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

        [HttpDelete]
        public async Task RemoveRoommate([FromBody] RemoveRoommateRequest removeRoommateRequest)
        {
            String userId = null;

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
                userId = userRecord.Uid;
            }

            //Make sure the requestor is a member of the room
            Roommate? thisUser = _psql.roommate
                .Where(rm => rm.room_id.Equals(removeRoommateRequest.roomId) && rm.roommate_id.Equals(userId)).FirstOrDefault();
            if (thisUser == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            //Execute delete
            _psql.roommate
                .Where(rm => rm.room_id.Equals(removeRoommateRequest.roomId) && rm.roommate_id.Equals(removeRoommateRequest.userIdToRemove))
                .ExecuteDelete();
            _psql.SaveChanges();
        }
    }
}
