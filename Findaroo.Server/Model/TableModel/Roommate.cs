using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.Model.TableModel
{
    [PrimaryKey(nameof(room_id), nameof(roommate_id))]
    public class Roommate
    {
        public String room_id {  get; set; }
        public String roommate_id {  get; set; }
        public DateTime date_joined { get; set; }
    }
}
