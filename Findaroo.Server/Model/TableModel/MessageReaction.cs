using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    [PrimaryKey(nameof(message_id), nameof(user_id))]
    [Table("message_reaction")]
    public class MessageReaction
    {
        public string message_id {  get; set; }
        public string user_id { get; set; }
        public string react_emoji { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime date_created { get; set; }

        public MessageReaction(string message_id, string user_id, string react_emoji)
        {
            this.message_id = message_id;
            this.user_id = user_id;
            this.react_emoji = react_emoji;
        }
    }
}
