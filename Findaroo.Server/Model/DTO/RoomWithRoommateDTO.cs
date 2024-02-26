namespace Findaroo.Server.Model.DTO
{
    public class RoomWithRoommateDTO
    {
        public string room_id { set; get; }
        public string room_name { set; get; }
        public string roommate_id { set; get; }
        public DateTime date_created { set; get; }
        public DateTime date_joined { set; get; }
    }
}
