using Findaroo.Server.Mapper;
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
        public User getUser(String user_id)
        {
            if (user_id == null)
            {
                Response.StatusCode = 404;
                return new User();
            }
            User user = _psql.user.Find(user_id);

            if (user == null)
            {
                Response.StatusCode = 404;
                return new User();
            }

            return user;
        }

        [HttpPost]
        public void postUser([FromBody] PostUserRequest postUserRequest)
        {
            _psql.user.Add(new User(postUserRequest));
            _psql.SaveChanges();
        }

        [HttpPut]
        public void updateUser([FromBody] UpdateUserRequest updateUserRequest)
        {
            if (updateUserRequest.user_id == null)
            {
                Response.StatusCode = 404;
                return;
            }

            User user = _psql.user.Find(updateUserRequest.user_id);

            UserMapper.update(user, updateUserRequest);

            _psql.user.Update(user);
            _psql.SaveChanges();
        }
    }
}
