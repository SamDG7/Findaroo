using Findaroo.Server.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string notification_id { get; set; }
        public String sender_id {  get; set; }
        public String receiver_id { get; set; }
        public NotificationEnum type { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime date_created { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public bool seen {  get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int count { get; set; }

        public Notification(string sender_id, string receiver_id, NotificationEnum type)
        {
            this.sender_id = sender_id;
            this.receiver_id = receiver_id;
            this.type = type;
        }
    }
}
