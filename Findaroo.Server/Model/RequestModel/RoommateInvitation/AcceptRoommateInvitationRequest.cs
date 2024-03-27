namespace Findaroo.Server.Model.RequestModel.RoommateInvitation
{
    public class AcceptRoommateInvitationRequest
    {
        public string sender_id { get; set; }
        public string receiver_id { get; set; }
        public string room_id { get; set; }
    }
}
