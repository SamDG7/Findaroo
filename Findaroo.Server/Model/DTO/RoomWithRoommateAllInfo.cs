using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;

namespace Findaroo.Server.Model.DTO
{
    public class RoomWithRoommateAllInfo
    {
        public string room_id { set; get; }
        public string room_name { set; get; }
        public List<User> roomates { set; get; }
        public DateTime date_created { set; get; }
        public List<DateTime> date_joined { set; get; }

        public RoomWithRoommateAllInfo(PostgresContext psql, string room_id, string room_name, List<String> room_mate_ids, DateTime date_created, List<DateTime> date_joined)
        {
            this.room_id = room_id;
            this.room_name = room_name;
            roomates = new List<User>();
            foreach (var room_mate_id in room_mate_ids)
            {
                var roomateUser = psql.user.Find(room_mate_id);
                roomates.Add(roomateUser);
            }
            this.date_created = date_created;
            this.date_joined = date_joined;
        }
    }
}
