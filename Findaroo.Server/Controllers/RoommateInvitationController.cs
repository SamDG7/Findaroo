using Findaroo.Server.Enums;
using Findaroo.Server.Model.RequestModel.RoommateInvitation;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Findaroo.Server.Utilities;
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
        NotificationManager _notificationManager;

        public RoommateInvitationController(PostgresContext psql)
        {
            _psql = psql;
            _notificationManager = new NotificationManager(_psql);
        }

        [HttpGet("received")]
        public async Task<List<RoommateInvitation>> getMyReceivedInvitations()
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

        [HttpGet("sent")]
        public async Task<List<RoommateInvitation>> getMySentInvitations()
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

            return _psql.roommate_invitation.Where(ri => ri.sender_id == userId).ToList();
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

            // Check if sender is in the room.
            if (_psql.roommate
                .Where(rm => rm.roommate_id.Equals(userId) && rm.room_id.Equals(sendRoommateInvitationRequest.room_id))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            //Check if invitation is already made.
            if (_psql.roommate_invitation
                .Where(rm => rm.sender_id.Equals(userId) 
                    && rm.receiver_id.Equals(sendRoommateInvitationRequest.receiver_id)
                    && rm.room_id.Equals(sendRoommateInvitationRequest.room_id))
                .FirstOrDefault() != null) 
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            //Check if receiver is already in the room.
            if (_psql.roommate
                .Where(rm => rm.roommate_id.Equals(sendRoommateInvitationRequest.receiver_id) 
                    && rm.room_id.Equals(sendRoommateInvitationRequest.room_id))
                .FirstOrDefault() != null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            RoommateInvitation newRoommateInvitation = new RoommateInvitation(userId, 
                sendRoommateInvitationRequest.receiver_id, 
                sendRoommateInvitationRequest.room_id,
                sendRoommateInvitationRequest.roommate_agreement);

            _notificationManager.recordNotification(sendRoommateInvitationRequest.receiver_id, userId, NotificationEnum.RoommateInvitation);

            _psql.roommate_invitation.Add(newRoommateInvitation);
            _psql.SaveChanges();
        }

        [HttpPut("update")]
        public async Task updateRoommateInvitation([FromBody] UpdateRoommateInvitationRequest updateRoommateInvitationRequest)
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

            if (userId != updateRoommateInvitationRequest.sender_id && userId != updateRoommateInvitationRequest.receiver_id)
            {
                Response.StatusCode = (int)(HttpStatusCode.Unauthorized);
                return;
            }

            try
            {
                _psql.roommate_invitation.Update(new RoommateInvitation(
                    updateRoommateInvitationRequest.sender_id,
                    updateRoommateInvitationRequest.receiver_id,
                    updateRoommateInvitationRequest.room_id,
                    updateRoommateInvitationRequest.roommate_agreement
                ));
                _psql.SaveChanges();
            } 
            catch (Exception ex)
            {
                Response.StatusCode = (int)(HttpStatusCode.BadRequest);
                return;
            }
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
                if (userRecord == null ||
                    (!userRecord.Uid.Equals(acceptRoommateInvitationRequest.receiver_id) && !userRecord.Uid.Equals(acceptRoommateInvitationRequest.sender_id)))
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
                userId = userRecord.Uid;
            }

            if (_psql.roommate_invitation
                .Where(rm => rm.receiver_id.Equals(acceptRoommateInvitationRequest.receiver_id) 
                    && rm.sender_id.Equals(acceptRoommateInvitationRequest.sender_id)
                    && rm.room_id.Equals(acceptRoommateInvitationRequest.room_id))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }


            _psql.roommate_invitation
                .Where(rm => rm.sender_id.Equals(acceptRoommateInvitationRequest.sender_id)
                    && rm.receiver_id.Equals(acceptRoommateInvitationRequest.receiver_id)
                    && rm.room_id.Equals(acceptRoommateInvitationRequest.room_id)).ExecuteDelete();
            Roommate newRoommate = new Roommate(acceptRoommateInvitationRequest.room_id, acceptRoommateInvitationRequest.receiver_id);

            if (userId.Equals(acceptRoommateInvitationRequest.receiver_id))
            {
                _notificationManager.recordNotification(acceptRoommateInvitationRequest.sender_id,
                    userId, 
                    NotificationEnum.RoommateInvitationAcceptedByReceiver);
            } else
            {
                _notificationManager.recordNotification(acceptRoommateInvitationRequest.receiver_id, 
                    userId, NotificationEnum.RoommateInvitationAcceptedBySender);
            }
            

            _psql.roommate.Add(newRoommate);
            _psql.SaveChanges();
        }

        [HttpDelete]
        public async Task declineRoommateInvitation(DeleteRoommateInvitationRequest deleteRoommateInvitationRequest)
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
                if (userRecord == null ||
                    (!userRecord.Uid.Equals(deleteRoommateInvitationRequest.receiver_id) && !userRecord.Uid.Equals(deleteRoommateInvitationRequest.sender_id)))
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
                userId = userRecord.Uid;
            }

            if (_psql.roommate_invitation
                .Where(rm => rm.receiver_id.Equals(deleteRoommateInvitationRequest.receiver_id)
                    && rm.sender_id.Equals(deleteRoommateInvitationRequest.sender_id)
                    && rm.room_id.Equals(deleteRoommateInvitationRequest.room_id))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            _psql.roommate_invitation
                .Where(rm => rm.receiver_id.Equals(deleteRoommateInvitationRequest.receiver_id) 
                    && rm.sender_id.Equals(deleteRoommateInvitationRequest.sender_id)
                    && rm.room_id.Equals(deleteRoommateInvitationRequest.room_id)).ExecuteDelete();
            _psql.SaveChanges();
        }
    }
}
