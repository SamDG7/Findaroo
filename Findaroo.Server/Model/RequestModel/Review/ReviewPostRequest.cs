namespace Findaroo.Server.Model.RequestModel.Review
{
    public class ReviewPostRequest
    //public class ReviewPostRequest : ReviewRequest
    {
        public string reviewer_id { get; set; }
        public string reviewed_id { get; set; }
        public bool roomed { get; set; }
        public string positive_remarks { get; set; }
        public string criticisms { get; set; }

        public DateTime reviewed_at {get; set;}
    }
}