using System.ComponentModel.DataAnnotations;

namespace Findaroo.Server.Model.TableModel
{
    public class Group
    {
        [Key]
        string group_id { get; set; }
        string group_name { get; set; }
        DateTime date_created { get; set; }
    }
}
