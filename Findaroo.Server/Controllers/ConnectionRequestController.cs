using Findaroo.Server.Model.RequestModel.ConnectionRequest;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        public ConnectionRequest[] getMySentConnectionRequests(String user_id)
        {
            return null;
        }

        [HttpGet]
        public ConnectionRequest[] getMyReceivedConnectionRequests(String user_id)
        {
            return null;
        }

        [HttpPost]
        public void sendConnectionRequests([FromBody] ConnectionRequest sendConnectionRequest)
        {
            _psql.connection_requests.Add(sendConnectionRequest);
            _psql.SaveChanges();
        }

        [HttpPost]
        public void acceptConnectionRequests([FromBody] ConnectionRequest acceptConnectionRequest)
        {
            Connection newConnection = new Connection();
            newConnection.user_1_id = acceptConnectionRequest.sender_id;
            newConnection.user_2_id = acceptConnectionRequest.receiver_id;

            _psql.connections.Add(newConnection);
            _psql.SaveChanges();
        }

        [HttpDelete]
        public void deleteConnectionRequests([FromBody] ConnectionRequest deleteConnectionRequest)
        {

        }
    }
}
