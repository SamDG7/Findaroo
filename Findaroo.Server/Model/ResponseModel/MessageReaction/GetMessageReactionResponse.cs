using Findaroo.Server.Model.TableModel;

namespace Findaroo.Server.Model.TableModel;

public class GetMessageReactionResponse
{
    public List<MessageReaction> messageReactions {  get; set; }

    public GetMessageReactionResponse(List<MessageReaction> messageReactions)
    {
        this.messageReactions = messageReactions;
    }
}
