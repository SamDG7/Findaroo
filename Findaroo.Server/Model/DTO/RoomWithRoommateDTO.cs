namespace Findaroo.Server.Model.DTO
{
    public class RoomWithRoommateDTO
    {
        public string room_id { set; get; }
        public string room_name { set; get; }
        public List<string> roommate_id { set; get; }
        public DateTime date_created { set; get; }
        public List<DateTime> date_joined { set; get; }

        public RoomWithRoommateDTO(string room_id, string room_name, List<string> roommate_id, DateTime date_created, List<DateTime> date_joined)
        {
            this.room_id = room_id;
            this.room_name = room_name;
            this.roommate_id = roommate_id;
            this.date_created = date_created;
            this.date_joined = date_joined;
        }
    }
}
