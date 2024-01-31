using System.ComponentModel.DataAnnotations;

namespace Findaroo.Server.Model
{
    public class User
    {
        [Key]
        String user_id { get; set; }
        String first_name { get; set; }
        String last_name { get; set; }
        String email { get; set; }
        String phone { get; set; }
        int age { get; set; }
        String address { get; set; }
        String state { get; set; }
        String country { get; set; }
        String zip_code { get; set; }
        String occupation { get; set; }
        String company { get; set; }
        String school { get; set; }
        int rating { get; set; }
        DateTime date_created { get; set; }
        DateTime date_modified { get; set; }
        Boolean status { get; set; }

        public User() { }

        public User(string first_name, string last_name, string email)
        {
            this.first_name = first_name;
            this.last_name = last_name;
            this.email = email;
        }
    }
}
