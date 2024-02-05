using System.ComponentModel.DataAnnotations;

namespace Findaroo.Server.Model.TableModel
{
    public class GroupMembership
    {
        string group_id { get; set; }
        string member_id { get; set; }
        DateTime date_created { get; set; }
    }
}
