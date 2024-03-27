using Findaroo.Server.Model.ResponseModel.Room;
using Findaroo.Server.Model.DTO;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Findaroo.Server.Authentication;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Findaroo.Server.Model.RequestModel.Room;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        PostgresContext _psql;

        public RoomController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public async Task<GetMyRoomsResponse> getMyRooms() 
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
            List<String> room_ids = _psql.roommate
                .Where(rm => rm.roommate_id.Equals(user_id))
                .Select(rm => rm.room_id).ToList();

            var queryResult = _psql.room
                .Where(r => room_ids.Contains(r.room_id))
                .Join(_psql.roommate,
                    room => room.room_id,
                    roommate => roommate.room_id,
                    (_room, _roommate) => new
                    {
                        room_id = _room.room_id,
                        room_name = _room.room_name,
                        roommate_id = _roommate.roommate_id,
                        date_created = _room.date_created,
                        date_joined = _roommate.date_joined
                    })
                .OrderBy(r => r.date_created)
                .GroupBy(r => r.room_id)
                .ToList();

            List<RoomWithRoommateDTO> rooms = new List<RoomWithRoommateDTO>();
            queryResult.ForEach(q =>
            {
                rooms.Add(new RoomWithRoommateDTO(
                    q.Select(q => q.room_id).FirstOrDefault(),
                    q.Select(q => q.room_name).FirstOrDefault(),
                    q.Select(q => q.roommate_id).ToList(),
                    q.Select(q => q.date_created).FirstOrDefault(),
                    q.Select(q => q.date_joined).ToList()));
            });

            return new GetMyRoomsResponse(rooms);
        }

        [HttpPost]
        public async Task createRoom([FromBody] CreateRoomRequest createRoomRequest)
        {
            Room newRoom = new Room(createRoomRequest.room_name);
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

            String roomId = _psql.room.Add(newRoom).Entity.room_id;
            Roommate roommate = new Roommate(roomId, userId);
            _psql.roommate.Add(roommate);
            _psql.SaveChanges();
        }
    }
}
