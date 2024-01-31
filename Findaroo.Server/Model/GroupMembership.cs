using System.ComponentModel.DataAnnotations;

namespace Findaroo.Server.Model
{
    public class GroupMembership
    {
        String group_id { get; set; }
        String member_id { get; set; }
        DateTime date_created { get; set; }
    }
}
