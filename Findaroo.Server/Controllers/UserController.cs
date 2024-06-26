﻿using Findaroo.Server.Mapper;
using Findaroo.Server.Model.RequestModel.User;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Findaroo.Server.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Findaroo.Server.Enums;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        PostgresContext _psql;
        private NotificationManager _notificationManager;

        public UserController(PostgresContext psql)
        {
            _psql = psql;
            _notificationManager = new NotificationManager(_psql);
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
                .OrderBy(u => idsToNames.ids.IndexOf(u.user_id))
                .Select(u => u.first_name + " " + u.last_name)
                .ToList();
        }
        
        [Route("all")]
        [HttpGet]
        public User[] GetAllUsers()
        {
            User[] users = _psql.user.Where(row => row.status).ToArray();
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

            _psql.connection
                .Where(u => u.user_1_id.Equals(deleteUserRequest.user_id) || u.user_2_id.Equals(deleteUserRequest.user_id))
                .ExecuteDelete();
            _psql.connection_request
                .Where(u => u.sender_id.Equals(deleteUserRequest.user_id) || u.receiver_id.Equals(deleteUserRequest.user_id))
                .ExecuteDelete();
            _psql.roommate
                .Where(rm => rm.roommate_id.Equals(deleteUserRequest.user_id))
                .ExecuteDelete();
            _psql.user.Remove(toBeDeleted);
            _psql.SaveChanges();
        }
        
        [HttpDelete]
        [Route("notify")]
        public void removeUserNotify([FromBody] DeleteUserRequest deleteUserRequest)
        {
            User[] users = _psql.user.Where(row => row.status).ToArray();
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

            _psql.connection
                .Where(u => u.user_1_id.Equals(deleteUserRequest.user_id) || u.user_2_id.Equals(deleteUserRequest.user_id))
                .ExecuteDelete();
            _psql.connection_request
                .Where(u => u.sender_id.Equals(deleteUserRequest.user_id) || u.receiver_id.Equals(deleteUserRequest.user_id))
                .ExecuteDelete();
            _psql.roommate
                .Where(rm => rm.roommate_id.Equals(deleteUserRequest.user_id))
                .ExecuteDelete();
            for (int i = 0; i < users.Length; i++)
            {
                string id = users[i].user_id;
                
                _notificationManager.recordNotification(
                    id,
                    "LrlND3E5SMZLPx9crbEXHfi4HDz2",
                    NotificationEnum.ModDeletedAccount
                );
            }
            _psql.user.Remove(toBeDeleted);
            
            _psql.SaveChanges();
        }
    }
}
