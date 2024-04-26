using Findaroo.Server.Authentication;
using Findaroo.Server.Model.RequestModel.MessageReaction;
using Findaroo.Server.PostgreSQL;
using Findaroo.Server.Model.TableModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using FirebaseAdmin.Messaging;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MessageReactionController : ControllerBase
    {
        PostgresContext _psql;

        public MessageReactionController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public async Task<GetMessageReactionResponse> getMessageReaction(string messageId)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);

            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }

            if (_psql.conversation_message.Where(cm => cm.message_id.Equals(messageId)).FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }

            return new GetMessageReactionResponse(
                _psql.message_reaction.Where(mr => mr.message_id.Equals(messageId)).ToList()
            );
        }

        [HttpPost]
        public async void addMessageReaction([FromBody] AddMessageReactionRequest addMessageReactionRequest)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);

            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            if (_psql.conversation_message.Where(cm => cm.message_id.Equals(addMessageReactionRequest.messageId)).FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            _psql.message_reaction
                .Add(new MessageReaction(addMessageReactionRequest.messageId, userId, addMessageReactionRequest.messageReactionEmoji));
            _psql.SaveChanges();
        }

        [HttpDelete]
        public async void removeMessageReaction([FromBody] RemoveMessageReactionRequest removeMessageReactionRequest)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);

            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            if (_psql.conversation_message.Where(cm => cm.message_id.Equals(removeMessageReactionRequest.messageId)).FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            _psql.message_reaction
                .Where(mr => mr.message_id.Equals(removeMessageReactionRequest.messageId) && mr.user_id.Equals(userId))
                .ExecuteDelete();
            _psql.SaveChanges();
        }
    }
}
