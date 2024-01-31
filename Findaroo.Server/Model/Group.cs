using System.ComponentModel.DataAnnotations;

namespace Findaroo.Server.Model
{
    public class Group
    {
        [Key]
        String group_id { get; set; }
        String group_name { get; set; }
        DateTime date_created { get; set; }
    }
}
