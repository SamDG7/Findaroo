using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    public class Room
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public String room_id { get; set; }
        public String room_name { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime date_created { get; set; }
    }
}
