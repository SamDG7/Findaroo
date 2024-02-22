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

        [HttpPost("idsFromNames")]
        public List<String> idsToNames([FromBody] IdsToNamesRequest idsToNames)
        {
            List<String> ids = idsToNames.ids;
            return _psql.user
                .Where(u => ids.Contains(u.user_id))
                .Select(u => u.first_name + " " + u.last_name)
                .ToList();
        }
        
        [Route("all")]
        [HttpGet]
        public User[] GetAllUsers()
        {
            User[] users = _psql.user.Select(row => row).ToArray();

            return users;

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
