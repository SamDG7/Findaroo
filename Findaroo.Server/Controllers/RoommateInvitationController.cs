using Findaroo.Server.Model.RequestModel.RoommateInvitation;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoommateInvitationController : ControllerBase
    {
        PostgresContext _psql;

        public RoommateInvitationController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public async Task<List<RoommateInvitation>> getMyInvitations()
        {
            String userId = null;

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
                userId = userRecord.Uid;
            }

            return _psql.roommate_invitation.Where(ri => ri.receiver_id == userId).ToList();
        }

        [HttpPost("send")]
        public async Task sendRoommateInvitation([FromBody] SendRoommateInvitationRequest sendRoommateInvitationRequest)
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

            if (_psql.roommate
                .Where(rm => rm.roommate_id.Equals(userId) && rm.room_id.Equals(sendRoommateInvitationRequest.room_id))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            RoommateInvitation newRoommateInvitation = new RoommateInvitation(userId, 
                sendRoommateInvitationRequest.receiver_id, 
                sendRoommateInvitationRequest.room_id,
                sendRoommateInvitationRequest.roommate_agreement);
            _psql.roommate_invitation.Add(newRoommateInvitation);
            _psql.SaveChanges();
        }

        [HttpPost("accept")]
        public async Task acceptRoommateInvitation([FromBody] AcceptRoommateInvitationRequest acceptRoommateInvitationRequest)
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

            if (_psql.roommate_invitation
                .Where(rm => rm.receiver_id.Equals(userId) 
                    && rm.room_id.Equals(acceptRoommateInvitationRequest.room_id))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            _psql.roommate_invitation
                .Where(rm => rm.receiver_id.Equals(userId)
                    && rm.room_id.Equals(acceptRoommateInvitationRequest.room_id)).ExecuteDelete();
            Roommate newRoommate = new Roommate(acceptRoommateInvitationRequest.room_id, userId);
            _psql.roommate.Add(newRoommate);
            _psql.SaveChanges();
        }
    }
}
