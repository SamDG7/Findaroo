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
using System.Runtime.InteropServices.JavaScript;

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
            var conversationList = _psql.conversation
                .FromSql($"SELECT * from conversation where {user_id} = ANY(user_ids)")
                .ToList();
            foreach (var conversation in conversationList)
            {
                var messageList = getConversationMessages(conversation.conversation_id);
                if (messageList.Count > 0)
                {
                    conversation.date_modified = messageList[^1].date_modified;
                }
            }
            conversationList.Sort((a, b) => DateTime.Compare(b.date_modified, a.date_modified));
            return conversationList;
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
        
        [HttpGet]
        [Route("getUsers")]
        public User[] getConversationUserNames(String conversationId)
        {
            // Get the conversation
            var conversation = getConversation(conversationId);
            
            // Add the user's info
            List<User> userList = new List<User>();
            foreach (var userId in conversation.user_ids)
            {
                userList.Add(_psql.user.Find(userId));
            }
            
            return userList.ToArray();
        }
        
        [HttpPost]
        [Route("addUser")]
        public void addUserToConversation(String conversationId, String newUserId)
        {
            Console.Write(newUserId);
            
            // Get the conversation
            var conversation = getConversation(conversationId);
            
            // Add the user if it is new
            List<String> userList = new List<string>(conversation.user_ids);
            if (userList.Contains(newUserId))
            {
                Response.StatusCode = 404;
                return;
            }
            userList.Add(newUserId);
            conversation.user_ids = userList.ToArray();
            
            _notificationManager.recordNotification(
                newUserId,
                newUserId,
                NotificationEnum.AddedToConversation
            );
            
            // Update the database
            _psql.conversation.Update(conversation);
            _psql.SaveChanges();
        }
        
        [HttpPost]
        [Route("removeUser")]
        public void removeUserFromConversation(String conversationId, String removingUserId)
        {
            Console.Write(removingUserId);
            
            // Get the conversation
            var conversation = getConversation(conversationId);
            
            // Add the user if it is new
            List<String> userList = new List<string>(conversation.user_ids);
            if (!userList.Contains(removingUserId))
            {
                Response.StatusCode = 404;
                return;
            }
            userList.Remove(removingUserId);
            conversation.user_ids = userList.ToArray();
            
            _notificationManager.recordNotification(
                removingUserId,
                removingUserId,
                NotificationEnum.RemovedFromConversation
            );
            
            // Update the database
            _psql.conversation.Update(conversation);
            _psql.SaveChanges();
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
            _psql.conversation_message.Add(newConversationMessage);

            var conversation = _psql.conversation.Find(postMessageRequest.conversation_id);

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
