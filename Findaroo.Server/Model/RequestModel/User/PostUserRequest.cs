namespace Findaroo.Server.Model.RequestModel.User
{
    public class PostUserRequest
    {
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
        public float? min_price { get; set; }
        public float? max_price { get; set; }
        public int[]? lifestyle_answers { get; set; }
        public string? preferences { get; set; }
        public string? room_type { get; set; }
        public string user_id { get; set; }
        public string?[]? social { get; set; }
        public string[]? blocked_users { get; set; }
        public string[]? bookmarks { get; set; }
    }
}
