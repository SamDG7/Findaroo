using Findaroo.Server.Model.RequestModel.User;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    public class User
    {
        [Key]
        public string user_id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string email { get; set; }
        public string? phone { get; set; }
        public int age { get; set; }
        public string address { get; set; }
        public string? state { get; set; }
        public string country { get; set; }
        public string? zip_code { get; set; }
        public string occupation { get; set; }
        public string? company { get; set; }
        public string? school { get; set; }
        public int? min_price { get; set; }
        public int? max_price { get; set; }
        public string? preferences { get; set; }
        public int rating { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime date_created { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime date_modified { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public bool status { get; set; }
        public int[]? lifestyle_answers { get; set; }
        public string? room_type { get; set; }
        public string?[]? social { get; set; }
        public string[]? blocked_users { get; set; }
        public string[]? bookmarks { get; set; }

        public User() { }

        public User(string first_name, string last_name, string email)
        {
            this.first_name = first_name;
            this.last_name = last_name;
            this.email = email;
        }

        public User(PostUserRequest pur)
        {
            this.first_name = pur.first_name;
            this.last_name = pur.last_name;
            this.email = pur.email;
            this.phone = pur.phone;
            this.age = pur.age;
            this.address = pur.address;
            this.state = pur.state;
            this.country = pur.country;
            this.zip_code = pur.zip_code;
            this.occupation = pur.occupation;
            this.company = pur.company;
            this.school = pur.school;
            this.rating = 0;
            this.min_price = pur.min_price;
            this.max_price = pur.max_price;
            this.lifestyle_answers = pur.lifestyle_answers;
            this.preferences = pur.preferences;
            this.room_type = pur.room_type;
            this.user_id = pur.user_id;
            this.social = pur.social;
            this.blocked_users = pur.blocked_users;
            this.bookmarks = pur.bookmarks;
        }
    }
}
