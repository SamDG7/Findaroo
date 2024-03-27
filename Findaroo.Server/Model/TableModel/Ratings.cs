using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.Model.TableModel;

    [PrimaryKey(nameof(user_id), nameof(to_user))]
    [Table("ratings")]

    public class Ratings
    {
        public string user_id { get; set; }
    
        public string to_user { get; set; }
        public int rating { get; set; }

        public Ratings(String user_id, string to_user, int rating)
        {
            this.user_id = user_id;
            this.to_user = to_user;
            this.rating = rating;
        }
    }