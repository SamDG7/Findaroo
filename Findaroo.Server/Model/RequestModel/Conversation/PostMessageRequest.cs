namespace Findaroo.Server.Model.RequestModel.Conversation
{
    public class PostMessageRequest
    {
        public string conversation_id { get; set; }
        public string user_id { get; set; }
        public string message_text { get; set; }
    }
}