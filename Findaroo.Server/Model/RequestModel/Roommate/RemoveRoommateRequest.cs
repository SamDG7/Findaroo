namespace Findaroo.Server.Model.RequestModel.Roommate
{
    public class RemoveRoommateRequest
    {
        public string roomId { get; set; }
        public string userIdToRemove { get; set; }
    }
}
