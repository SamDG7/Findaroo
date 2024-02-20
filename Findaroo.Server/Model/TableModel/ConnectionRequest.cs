using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    [PrimaryKey(nameof(sender_id), nameof(receiver_id))]
    [Table("connection_request")]
    public class ConnectionRequest
    {
        public String sender_id { get; set; }
        public String receiver_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? date_created { get; set; }
        public ConnectionRequest() { }
        public ConnectionRequest(String sender_id, String receiver_id)
        {
            this.sender_id = sender_id;
            this.receiver_id = receiver_id;
            this.date_created = null;
        }
    }
}
