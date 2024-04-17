using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Mvc;
using Findaroo.Server.Model.RequestModel.Review;
using Findaroo.Server.Model.TableModel;
using Microsoft.EntityFrameworkCore;


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
        public ActionResult<string> PostReview([FromBody] ReviewPostRequest review)
        {
            if (review == null)
            {
                return BadRequest("Review data is null");
            }

            try
            {
                Review new_review = new Review();
                
                new_review.reviewer_id = review.reviewer_id;
                new_review.reviewed_id = review.reviewed_id;
                new_review.roomed = review.roomed;
                new_review.positive_remarks = review.positive_remarks;
                new_review.criticisms = review.criticisms;

                _psql.roommate_reviews.Add(new_review);
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

    
    // public class RoommateReview
    // {
        
    //     public int id {get; set;}
    //     public int reviewer_id { get; set; }
    //     public int reviewed_id { get; set; }
    //     public bool roomed { get; set; }
    //     public string positive_remarks { get; set; }
    //     public string criticisms { get; set; }
    // }
}
