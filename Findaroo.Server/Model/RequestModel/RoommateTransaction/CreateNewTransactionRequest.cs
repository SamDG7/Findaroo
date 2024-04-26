namespace Findaroo.Server.Model.RequestModel.RoommateTransaction
{
    public class CreateNewTransactionRequest
    {
        public string roomId {  get; set; }
        public List<String> receiverId { get; set; }
        public string name { get; set; }
        public double amount { get; set; }
    }
}
