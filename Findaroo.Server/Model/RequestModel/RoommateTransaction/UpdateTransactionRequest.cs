namespace Findaroo.Server.Model.RequestModel.RoommateTransaction
{
    public class UpdateTransactionRequest
    {
        public string transactionId {  get; set; }
        public List<string> receiverId { get; set; }
        public double amount { get; set; }
    }
}
