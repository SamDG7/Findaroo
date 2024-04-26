using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Findaroo.Server.Model.RequestModel.MessageReaction
{
    public class AddMessageReactionRequest
    {
        public string messageId { get; set; }
        public string messageReactionEmoji { get; set; }
    }
}
