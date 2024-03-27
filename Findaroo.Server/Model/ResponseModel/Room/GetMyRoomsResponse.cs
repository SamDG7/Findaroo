using Findaroo.Server.Model.DTO;

namespace Findaroo.Server.Model.ResponseModel.Room
{
    public class GetMyRoomsResponse
    {
        public List<RoomWithRoommateDTO> rooms { get; set; }

        public GetMyRoomsResponse(List<RoomWithRoommateDTO> rooms)
        {
            this.rooms = rooms;
        }
    }
}
