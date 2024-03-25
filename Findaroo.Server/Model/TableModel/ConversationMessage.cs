using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    [PrimaryKey(nameof(message_id))]
    public class ConversationMessage
    {
        public string message_id { get; set; }
        public string user_id { get; set; }
        public string message_text { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime date_created { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime date_modified { get; set; }
        
        public ConversationMessage() { }
    }
}
