using Findaroo.Server.Model.ResponseModel.Room;
using Findaroo.Server.Model.DTO;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Findaroo.Server.Authentication;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        PostgresContext _psql;
        IAuthenticationService _authenticationService;

        public RoomController(PostgresContext psql, IAuthenticationService authenticationService)
        {
            _psql = psql;
            _authenticationService = authenticationService;
        }

        [HttpGet]
        public GetMyRoomsResponse getMyRooms(string user_id) 
        {
            List<String> room_ids = _psql.roommate
                .Where(rm => rm.roommate_id.Equals(user_id))
                .Select(rm => rm.room_id).ToList();

            return new GetMyRoomsResponse(_psql.room
                .Where(r => room_ids.Contains(r.room_id))
                .Join(_psql.roommate,
                    room => room.room_id,
                    roommate => roommate.room_id,
                    (_room, _roommate) => new RoomWithRoommateDTO
                    {
                        room_id = _room.room_id,
                        room_name = _room.room_name,
                        roommate_id = _roommate.roommate_id,
                        date_created = _room.date_created,
                        date_joined = _roommate.date_joined
                    })
                .OrderBy(r => r.date_created)
                .ToList());
        }

        [HttpPost]
        public async void createRoom(string room_name)
        {
            Room newRoom = new Room(room_name);
            String user_id = null;

            if (Request.Cookies["idToken"] == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized; 
                return;
            } 
            else
            {
                var res = await _authenticationService.Authenticate(Request.Cookies["idToken"]);
                user_id = res;
                if (user_id == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
            }

            String room_id = _psql.room.Add(newRoom).Entity.room_id;
            Roommate roommate = new Roommate(room_id, user_id);
            _psql.roommate.Add(roommate);
            _psql.SaveChanges();
        }
    }
}
