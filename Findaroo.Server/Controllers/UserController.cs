using Findaroo.Server.Model.RequestModel;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        PostgresContext _psql;

        public UserController(PostgresContext psql) 
        {
            _psql = psql;
        }

        [HttpGet]
        public User getUser()
        {
            return new User("Ryan", "Doan", "doan23@purdue.edu");
        }

        [HttpPost]
        public void postUser([FromBody] PostUserRequest postUserRequest)
        {
            _psql.user.Add(new User(postUserRequest));
            _psql.SaveChanges();
        }
    }
}
