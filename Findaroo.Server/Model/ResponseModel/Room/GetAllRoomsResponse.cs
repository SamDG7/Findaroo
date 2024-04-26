using Findaroo.Server.Model.DTO;

namespace Findaroo.Server.Model.ResponseModel.Room
{
    public class GetAllRoomsResponse
    {
        public List<RoomWithRoommateAllInfo> rooms { get; set; }

        public GetAllRoomsResponse(List<RoomWithRoommateAllInfo> rooms)
        {
            this.rooms = rooms;
        }
    }
}
