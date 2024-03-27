namespace Findaroo.Server.Model.RequestModel.RoommateInvitation
{
    public class SendRoommateInvitationRequest
    {
        public String room_id { get; set; }
        public String receiver_id { get; set; }
        public int[] roommate_agreement { get; set; }
    }
}
