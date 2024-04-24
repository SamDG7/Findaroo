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

            List<string> roommates = _psql.roommate
                .Where(rm => rm.room_id.Equals(room_id) && !rm.roommate_id.Equals(userId))
                .Select(rm => rm.roommate_id).ToList();

            List<double> amountOwed = new List<double>();
            foreach (var rm in roommates)
            {
                double amountOwedToRm = _psql.roommate_transaction
                    .Where(rt => rt.room_id.Equals(room_id) && rt.payer_id.Equals(rm))
                    .Select(rt => rt.amount / rt.receiver_id.Count()).Sum();
                double amountPaidToRm = _psql.roommate_transaction
                    .Where(rt => rt.room_id.Equals(room_id) && rt.payer_id.Equals(userId))
                    .Select(rt => rt.amount / rt.receiver_id.Count()).Sum();

                amountOwed.Add(Math.Round(amountOwedToRm - amountPaidToRm, 2));
            }

            return new GetAmountOwedResponse(roommates, amountOwed);
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
    }
}
