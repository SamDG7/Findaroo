using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConnectionRequestController : ControllerBase
    {
        PostgresContext _psql;
        public ConnectionRequestController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public IEnumerable<ConnectionRequest> getMySentConnectionRequests(String user_id)
        {
            return _psql.connection_requests
                .FromSql($"select * from connection_request where connection_request.sender_id = {user_id}")
                .ToList();
        }

        [HttpGet]
        public IEnumerable<ConnectionRequest> getMyReceivedConnectionRequests(String user_id)
        {
            return _psql.connection_requests
                .FromSql($"select * from connection_request where connection_request.receiver_id = {user_id}")
                .ToList();
        }

        [HttpPost]
        public void sendConnectionRequests([FromBody] ConnectionRequest sendConnectionRequest)
        {
            try
            {
                _psql.connection_requests.Add(sendConnectionRequest);
                _psql.SaveChanges();
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
        }

        [HttpPost]
        public void acceptConnectionRequests([FromBody] ConnectionRequest acceptConnectionRequest)
        {
            Connection newConnection = new Connection();
            newConnection.user_1_id = acceptConnectionRequest.sender_id;
            newConnection.user_2_id = acceptConnectionRequest.receiver_id;

            try
            {
                _psql.connections.Add(newConnection);
                _psql.SaveChanges();
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
        }

        [HttpDelete]
        public void deleteConnectionRequests([FromBody] ConnectionRequest deleteConnectionRequest)
        {
            try 
            {
                _psql.connection_requests.Remove(deleteConnectionRequest);
                _psql.SaveChanges();
            }
            catch (Exception e) 
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
        }
    }
}
