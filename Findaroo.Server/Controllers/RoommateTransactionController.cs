using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Findaroo.Server.PostgreSQL;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.Authentication;
using System.Net;
using Findaroo.Server.Model.ResponseModel;
using Findaroo.Server.Model.RequestModel.RoommateTransaction;
using Microsoft.EntityFrameworkCore;
using Findaroo.Server.Model.ResponseModel.RoommateTransaction;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoommateTransactionController : ControllerBase
    {
        PostgresContext _psql;

        public RoommateTransactionController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        public async Task<GetThisRoomTransactionResponse> getThisRoomTransaction(string room_id, int offset)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);
            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }

            if (_psql.roommate
                .Where(rm => rm.room_id.Equals(room_id) && rm.roommate_id.Equals(userId))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }

            return new GetThisRoomTransactionResponse(_psql.roommate_transaction
                .Where(rt => rt.room_id.Equals(room_id))
                .OrderByDescending(rt => rt.date_created)
                .Skip(offset)
                .Take(10)
                .ToList()
            );    
        }

        [HttpGet("amountOwed")]
        public async Task<GetAmountOwedResponse> getAmountOwed(string room_id) 
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);
            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }

            if (_psql.roommate
                .Where(rm => rm.room_id.Equals(room_id) && rm.roommate_id.Equals(userId))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return null;
            }

            return getAmountOwedHelper(room_id, userId);
        }

        [HttpPost]
        public async void createNewTransaction([FromBody] CreateNewTransactionRequest createNewTransactionRequest)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);
            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            if (_psql.roommate
                .Where(rm => rm.room_id.Equals(createNewTransactionRequest.roomId) && rm.roommate_id.Equals(userId))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            RoommateTransaction newTransaction = new RoommateTransaction(createNewTransactionRequest.roomId,
                userId, createNewTransactionRequest.receiverId, createNewTransactionRequest.name, 
                createNewTransactionRequest.amount);
            _psql.roommate_transaction.Add(newTransaction);
            _psql.SaveChanges();
        }

        [HttpPut("settleUp")]
        public async void settleUp([FromBody] SettleUpRequest settleUpRequest)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);
            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            if (_psql.roommate
                .Where(rm => rm.room_id.Equals(settleUpRequest.roomId) && rm.roommate_id.Equals(userId))
                .FirstOrDefault() == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            GetAmountOwedResponse getAmountOwedResponse = getAmountOwedHelper(settleUpRequest.roomId, userId);

            List<string> roommateId = getAmountOwedResponse.user_id;
            List<double> amountOwed = getAmountOwedResponse.amount_owed;

            for (int i = 0; i < roommateId.Count; i++)
            {
                if (Math.Abs(amountOwed[i]) < 0.01) { continue; }
                string receiver = amountOwed[i] > 0 ? roommateId[i] : userId;
                string payer = amountOwed[i] > 0 ? userId : roommateId[i];
                RoommateTransaction transaction = new RoommateTransaction(settleUpRequest.roomId,
                    payer,
                    new List<string> { receiver },
                    "Settle Up",
                    Math.Abs(amountOwed[i]));
                _psql.roommate_transaction.Add(transaction);
            }
            _psql.SaveChanges();
        }

        [HttpPut]
        public async void updateTransaction([FromBody] UpdateTransactionRequest updateTransactionRequest)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);
            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            RoommateTransaction? transaction = _psql.roommate_transaction
                .Where(rt => rt.transaction_id.Equals(updateTransactionRequest.transactionId) && rt.payer_id.Equals(userId))
                .FirstOrDefault();

            if (transaction == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return;
            }

            transaction.amount = updateTransactionRequest.amount;
            transaction.receiver_id = updateTransactionRequest.receiverId;
            _psql.roommate_transaction.Update(transaction);
            _psql.SaveChanges();
        }

        [HttpDelete]
        public async void deleteTransaction([FromBody] DeleteTransactionRequest deleteTransactionRequest)
        {
            string userId = await AuthenticationService.authenticate(Request.Cookies["idToken"]);
            if (userId == null)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            _psql.roommate_transaction
                .Where(rt => rt.transaction_id.Equals(deleteTransactionRequest.transactionId) && rt.payer_id.Equals(userId))
                .ExecuteDelete();
            _psql.SaveChanges();
        }

        private GetAmountOwedResponse getAmountOwedHelper(string room_id, string userId)
        {
            List<string> roommates = _psql.roommate
                .Where(rm => rm.room_id.Equals(room_id) && !rm.roommate_id.Equals(userId))
                .Select(rm => rm.roommate_id).ToList();

            List<double> amountOwedList = new List<double>();
            foreach (var rm in roommates)
            {
                double amountOwedToRm = _psql.roommate_transaction
                    .Where(rt => rt.room_id.Equals(room_id) && rt.payer_id.Equals(rm) && rt.receiver_id.Contains(userId))
                    .Select(rt => rt.amount / rt.receiver_id.Count()).Sum();
                double amountPaidToRm = _psql.roommate_transaction
                    .Where(rt => rt.room_id.Equals(room_id) && rt.payer_id.Equals(userId) && rt.receiver_id.Contains(rm))
                    .Select(rt => rt.amount / rt.receiver_id.Count()).Sum();

                amountOwedList.Add(Math.Round(amountOwedToRm - amountPaidToRm, 2));
            }

            return new GetAmountOwedResponse(roommates, amountOwedList);
        }
    }
}
