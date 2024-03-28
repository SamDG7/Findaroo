using Findaroo.Server.Model.RequestModel.Conversation;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;
using Findaroo.Server.Utilities;
using Findaroo.Server.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FirebaseAdmin.Auth;
using System.Net;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        PostgresContext _psql;
        NotificationManager _notificationManager;
        public ConversationController(PostgresContext psql)
        {
            _psql = psql;
            _notificationManager = new NotificationManager(_psql);
        }

        [HttpGet]
        [Route("all")]
        public List<Conversation> getConversations(String user_id)
        {
            return _psql.conversation
                .FromSql($"SELECT * from conversation where {user_id} = ANY(user_ids)")
                .ToList();
        }
        
        [HttpGet]
        [Route("messages")]
        public List<ConversationMessage> getConversationMessages(String conversation_id)
        {
            return _psql.conversation_message
                .FromSql($"SELECT * from conversation_message where {conversation_id} = conversation_id")
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
            Console.Write(new_user_ids);
            
            // Only make a new conversation if it does not exist
            if (_psql.conversation
                    //.FromSql($"SELECT * from conversation WHERE ((user_ids @> {new_user_ids}) AND (user_ids <@ {new_user_ids}))").ToList()
                    .FromSql($"SELECT * from conversation WHERE (user_ids @> ARRAY(SELECT UNNEST({new_user_ids}) ORDER BY UNNEST)::VARCHAR[])\n  AND (user_ids <@ ARRAY(SELECT UNNEST({new_user_ids}) ORDER BY UNNEST)::VARCHAR[])").ToList()
                    .Count == 0)
            {
                Conversation newConversation = new Conversation();
                
                newConversation.user_ids = new_user_ids;
                _psql.conversation.Add(newConversation);
                _psql.SaveChanges();
            }
        }
        
        [HttpPost]
        [Route("messages")]
        public async void makeMessage([FromBody] PostMessageRequest postMessageRequest)
        {
            Console.Write(postMessageRequest.message_text);
            
            ConversationMessage newConversationMessage = new ConversationMessage();
                
            newConversationMessage.conversation_id = postMessageRequest.conversation_id;
            newConversationMessage.user_id = postMessageRequest.user_id;
            newConversationMessage.message_text = postMessageRequest.message_text;
            var reference = _psql.conversation_message.Add(newConversationMessage);
            _psql.SaveChanges();
            
            Conversation conversation = getConversation(postMessageRequest.conversation_id);
            conversation.date_modified = reference.Entity.date_modified;
            _psql.conversation.Update(conversation);

            // Kinda inefficient but makes it scalable if we wanna make group chat
            for (int i = 0; i < conversation.user_ids.Length; i++)
            {
                string id = conversation.user_ids[i];
                if (id.Equals(postMessageRequest.user_id)) continue;
                _notificationManager.recordNotification(
                    id,
                    postMessageRequest.user_id,
                    NotificationEnum.Message
                );
            }
            
            _psql.SaveChanges();
        }

        /*
        [HttpDelete]
        public void deleteConversation([FromBody] DeleteConversationRequest deleteConversationRequest)
        {
            Connection conn = _psql.connection.Single(
                    c => (c.user_1_id == deleteConversationRequest.user_1_id && c.user_2_id == deleteConversationRequest.user_2_id)
                    || (c.user_1_id == deleteConversationRequest.user_2_id && c.user_2_id == deleteConversationRequest.user_1_id));
            _psql.connection.Remove(conn);
            _psql.SaveChanges();
        }
        */
    }
}
