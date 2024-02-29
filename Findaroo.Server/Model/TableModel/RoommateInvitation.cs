using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    [PrimaryKey(nameof(sender_id), nameof(receiver_id), nameof(room_id))]
    [Table("roommate_invitation")]
    public class RoommateInvitation
    {
        public string sender_id {  get; set; }
        public string receiver_id { get; set; }
        public string room_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime date_created { get; set; }

        public RoommateInvitation(string sender_id, string receiver_id, string room_id)
        {
            this.room_id = room_id;
            this.sender_id = sender_id;
            this.receiver_id = receiver_id;
        }
    }
}
