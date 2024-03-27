using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    public class Conversation
    {
        [Key]
        public string conversation_id { get; set; }
        public string[] user_ids { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime date_created { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime date_modified { get; set; }
        
        public Conversation() { }
    }
}
