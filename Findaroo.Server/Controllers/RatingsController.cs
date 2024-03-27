using Findaroo.Server.Model.ResponseModel.Room;
using Findaroo.Server.Model.DTO;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Findaroo.Server.Authentication;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Findaroo.Server.Model.RequestModel.Room;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RatingsController : ControllerBase
    {
        PostgresContext _psql;

        public RatingsController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public Ratings getRatings(string user_id, string to_user)
        {
            if (user_id == null)
            {
                Response.StatusCode = 404;
                return new Ratings("", "", 0);
            }
            Ratings rating = _psql.ratings.Find(user_id, to_user);

            if (rating == null)
            {
                Response.StatusCode = 404;
                return new Ratings("", "", 0);
            }

            return rating;
        }

        [HttpGet]
        [Route("avg")]
        public double aggRating(string user)
        {
            return _psql.ratings.Where(rt => rt.to_user == user).Average(rt => rt.rating);
        }
        [HttpPost]
        public string postRating(string user_id, string to_user, int rating)
        {
            Ratings ratings = new Ratings(user_id, to_user, rating);
            _psql.ratings.Add(ratings);
            _psql.SaveChanges();

            return ratings.user_id;
        }
        
        [HttpPut]
        public void updateUser(string user_id, string to_user, int rating)
        {
            if (user_id == null)
            {
                Response.StatusCode = 404;
                return;
            }

            Ratings ratings = _psql.ratings.Find(user_id, to_user);

            ratings.rating = rating;

            _psql.ratings.Update(ratings);
            _psql.SaveChanges();
        }
    }
}
