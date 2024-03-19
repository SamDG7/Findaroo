namespace Findaroo.Server.Model.RequestModel.RoommateInvitation
{
    public class UpdateRoommateInvitationRequest
    {
        public string sender_id { get; set; }
        public string receiver_id { get; set; }
        public string room_id { get; set; }
        public int[] roommate_agreement { get; set; }
    }
}
