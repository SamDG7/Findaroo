using Findaroo.Server.Model.RequestModel.Connection;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        PostgresContext _psql;
        public ConversationController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        [Route("all")]
        public List<Conversation> getConversations(String user_id)
        {
            return _psql.conversation
                .FromSql($"SELECT * from converstion where {user_id} @> user_ids")
                .ToList();
        }
        
        [HttpGet]
        public Conversation getConversation(String conversation_id)
        {
            if (conversation_id == null)
            {
                Response.StatusCode = 404;
                return new Conversation();
            }
            Conversation conversation = _psql.conversation.Find(conversation_id);

            if (conversation == null)
            {
                Response.StatusCode = 404;
                return new Conversation();
            }

            return conversation;
        }
        
        [HttpPost]
        public void makeConversation(String[] new_user_ids)
        {
            // Only make a new conversation if it does not exist
            if (_psql.conversation
                    .FromSql($"SELECT * from converstion where {new_user_ids} @> user_ids").ToList()
                    .Count == 0)
            {
                Conversation newConversation = new Conversation();
                
                newConversation.user_ids = new_user_ids;
                _psql.conversation.Add(newConversation);
                _psql.SaveChanges();
            }
        }

        [HttpDelete]
        public void deleteConversation([FromBody] DeleteConnectionRequest deleteConnectionRequest)
        {
            Connection conn = _psql.connection.Single(
                    c => (c.user_1_id == deleteConnectionRequest.user_1_id && c.user_2_id == deleteConnectionRequest.user_2_id)
                    || (c.user_1_id == deleteConnectionRequest.user_2_id && c.user_2_id == deleteConnectionRequest.user_1_id));
            _psql.connection.Remove(conn);
            _psql.SaveChanges();
        }
    }
}
