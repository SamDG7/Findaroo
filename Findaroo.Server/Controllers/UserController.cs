using Findaroo.Server.Authentication;
using Findaroo.Server.Mapper;
using Findaroo.Server.Model.RequestModel.User;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        PostgresContext _psql;
        IAuthenticationService _authenticationService;

        public UserController(PostgresContext psql, IAuthenticationService authenticationService) 
        {
            _psql = psql;
            _authenticationService = authenticationService;
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
        public string postUser([FromBody] PostUserRequest postUserRequest)
        {
            User user = new User(postUserRequest);
            _psql.user.Add(user);
            _psql.SaveChanges();

            return user.user_id;
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

        [HttpDelete]
        public void removeUser([FromBody] DeleteUserRequest deleteUserRequest)
        {
            if (deleteUserRequest.user_id == null)
            {
                Response.StatusCode = 404;
                return;
            }

            User toBeDeleted = _psql.user.Find(deleteUserRequest.user_id);

            if (toBeDeleted == null)
            {
                Response.StatusCode = 404;
                return;
            }

            _psql.user.Remove(toBeDeleted);
            _psql.SaveChanges();
        }
    }
}
