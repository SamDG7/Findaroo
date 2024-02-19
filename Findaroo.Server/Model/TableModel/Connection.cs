using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    [PrimaryKey(nameof(user_1_id), nameof(user_2_id))]
    public class Connection
    {
        public String user_1_id { get; set; }
        public String user_2_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? date_created { get; set; }
        public Connection() { }
    }
}
