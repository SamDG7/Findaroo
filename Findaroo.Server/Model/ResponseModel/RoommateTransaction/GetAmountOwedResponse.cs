namespace Findaroo.Server.Model.ResponseModel.RoommateTransaction
{
    public class GetAmountOwedResponse
    {
        public List<string> user_id { get; set; }
        public List<double> amount_owed { get; set; }

        public GetAmountOwedResponse(List<string> user_id, List<double> amount_owed)
        {
            this.user_id = user_id;
            this.amount_owed = amount_owed;
        }
    }
}
