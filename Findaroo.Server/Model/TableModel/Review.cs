using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    public class Review
    {
        [Key] public int id {get; set;}
        public int reviewer_id { get; set; }
        public int reviewed_id { get; set; }
        public bool roomed { get; set; }
        public string positive_remarks { get; set; }
        public string criticisms { get; set; }
    }
}
