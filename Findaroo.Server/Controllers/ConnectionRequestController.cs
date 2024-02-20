using Findaroo.Server.Model.TableModel;
using Findaroo.Server.Model.RequestModel.ConnectionRequest;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Microsoft.Extensions.Primitives;
using Findaroo.Server.Authentication;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConnectionRequestController : ControllerBase
    {
        PostgresContext _psql;
        IAuthenticationService _authenticationService;
        public ConnectionRequestController(PostgresContext psql, IAuthenticationService authenticationService)
        {
            _psql = psql;
            _authenticationService = authenticationService;
        }

        [HttpGet]
        [Route("sent")]
        public IEnumerable<ConnectionRequest> getMySentConnectionRequests()
        {
            String user_id = null;
            try
            {
                if (!Request.Headers.TryGetValue("idToken", out StringValues idToken)) throw new Exception();
                user_id = _authenticationService.Authenticate(idToken).Result;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return null;
            }

            IEnumerable<ConnectionRequest> e = _psql.connection_request
                .FromSql($"select * from connection_request cr where cr.sender_id = {user_id}")
                .ToList();
            return e;
        }

        [HttpGet]
        [Route("received")]
        public IEnumerable<ConnectionRequest> getMyReceivedConnectionRequests(String user_id)
        {
            return _psql.connection_request
                .FromSql($"select * from connection_request cr where cr.receiver_id = {user_id}")
                .ToList();
        }

        [HttpPost]
        [Route("send")]
        public void sendConnectionRequests([FromBody] String other_user_id)
        {
            String user_id = null;
            try
            {
                if (!Request.Headers.TryGetValue("idToken", out StringValues idToken)) throw new Exception();
                user_id = _authenticationService.Authenticate(idToken).Result;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            ConnectionRequest newConnectionRequest = new ConnectionRequest();
            newConnectionRequest.sender_id = user_id;
            newConnectionRequest.receiver_id = other_user_id;

            try
            {
                _psql.connection_request.Add(newConnectionRequest);
                _psql.SaveChanges();
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
        }

        [HttpPost]
        [Route("accept")]
        public void acceptConnectionRequests([FromBody] String other_user_id)
        {
            String user_id = null;
            try
            {
                if (!Request.Headers.TryGetValue("idToken", out StringValues idToken)) throw new Exception();
                user_id = _authenticationService.Authenticate(idToken).Result;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            //TODO: check that connection request exists

            Connection newConnection = new Connection();
            newConnection.user_1_id = user_id;
            newConnection.user_2_id = other_user_id;
        
            try
            {
                _psql.connection.Add(newConnection);
                _psql.SaveChanges();
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
           }
        }

        [HttpDelete]
        public void deleteConnectionRequests([FromBody] String other_user_id)
        {
            String user_id = null;
            try
            {
                if (!Request.Headers.TryGetValue("idToken", out StringValues idToken)) throw new Exception();
                user_id = _authenticationService.Authenticate(idToken).Result;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            try 
            {
                //Kinda scuffed but using "delete from" in fromsql doesn't work for some reason
                List<ConnectionRequest> cr = _psql.connection_request
                    .FromSql($"select * from connection_request cr WHERE cr.sender_id = {user_id} AND cr.receiver_id = {other_user_id}")
                    .ToList();
                _psql.connection_request.Remove(cr[0]);
                _psql.SaveChanges();
            }
            catch (Exception e) 
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
        }
    }
}
