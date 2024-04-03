using Findaroo.Server.Model.TableModel;

namespace Findaroo.Server.Model.ResponseModel;

public class GetThisRoomTransactionResponse
{
    public List<RoommateTransaction> roommateTransactionList {  get; set; }

    public GetThisRoomTransactionResponse(List<RoommateTransaction> roommateTransactionList)
    {
        this.roommateTransactionList = roommateTransactionList;
    }
}
