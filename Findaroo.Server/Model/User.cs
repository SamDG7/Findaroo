namespace Findaroo.Server.Model
{
    public class User
    {
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

        public User(string first_name, string last_name, string email, string phone, int age, string address,
            string state, string country, string zip_code, string occupation, string company, string school,
            int rating, DateTime date_created, DateTime date_modified, bool status)
        {
            this.first_name = first_name;
            this.last_name = last_name;
            this.email = email;
            this.phone = phone;
            this.age = age;
            this.address = address;
            this.state = state;
            this.country = country;
            this.zip_code = zip_code;
            this.occupation = occupation;
            this.company = company;
            this.school = school;
            this.rating = rating;
            this.date_created = date_created;
            this.date_modified = date_modified;
            this.status = status;
        }

        public User() { }
    }
}
