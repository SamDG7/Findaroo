using Findaroo.Server.Model.TableModel;

namespace Findaroo.Server.Model.ResponseModel;

public class GetThisRoomTransactionResponse
{
    public List<TableModel.RoommateTransaction> roommateTransactionList {  get; set; }

    public GetThisRoomTransactionResponse(List<TableModel.RoommateTransaction> roommateTransactionList)
    {
        this.roommateTransactionList = roommateTransactionList;
    }
}
