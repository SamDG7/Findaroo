using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Mvc;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly PostgresContext _psql;

        public ReviewController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpPost]
        public ActionResult<string> PostReview([FromBody] RoommateReview review)
        {
            if (review == null)
            {
                return BadRequest("Review data is null");
            }

            try
            {
                // var newReview = new RoommateReview
                // {
                //     reviewer_id = review.ReviewerId,
                //     reviewed_id = review.ReviewedId,
                //     roomed = review.Roomed,
                //     positive_remarks = review.PositiveRemarks,
                //     criticisms = review.Criticisms
                // };

                _psql.roommate_reviews.Add(review);
                _psql.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                // Log exception details here to understand more about the failure
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }


    public class RoommateReview
    {
        public int reviewer_id { get; set; }
        public int reviewed_id { get; set; }
        public bool roomed { get; set; }
        public string positive_remarks { get; set; }
        public string criticisms { get; set; }
    }
}
