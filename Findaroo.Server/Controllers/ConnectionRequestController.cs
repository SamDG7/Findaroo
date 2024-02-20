﻿using Findaroo.Server.Model.TableModel;
using Findaroo.Server.Model.RequestModel.ConnectionRequest;
using Findaroo.Server.PostgreSQL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConnectionRequestController : ControllerBase
    {
        PostgresContext _psql;
        public ConnectionRequestController(PostgresContext psql)
        {
            _psql = psql;
        }

        [HttpGet]
        [Route("sent")]
        public IEnumerable<ConnectionRequest> getMySentConnectionRequests(String user_id)
        {
            IEnumerable<ConnectionRequest> e = _psql.connection_request
                .FromSql($"select * from connection_request cr where cr.sender_id = {user_id}")
                .ToList();
            return e;
        }

        [HttpGet]
        [Route("received")]
        public IEnumerable<ConnectionRequest> getMyReceivedConnectionRequests(String user_id)
        {
            return _psql.connection_request
                .FromSql($"select * from connection_request cr where cr.receiver_id = {user_id}")
                .ToList();
        }

        [HttpPost]
        [Route("send")]
        public void sendConnectionRequests([FromBody] ConnectionRequestRequest sendConnectionRequest)
        {
            ConnectionRequest newConnectionRequest = new ConnectionRequest();
            newConnectionRequest.sender_id = sendConnectionRequest.sender_id;
            newConnectionRequest.receiver_id = sendConnectionRequest.receiver_id;

            try
            {
                _psql.connection_request.Add(newConnectionRequest);
                _psql.SaveChanges();
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
        }

        [HttpPost]
        [Route("accept")]
        public void acceptConnectionRequests([FromBody] ConnectionRequestRequest acceptConnectionRequest)
        {
            Connection newConnection = new Connection();
            newConnection.user_1_id = acceptConnectionRequest.sender_id;
            newConnection.user_2_id = acceptConnectionRequest.receiver_id;
        
            try
            {
                _psql.connection.Add(newConnection);
                _psql.SaveChanges();
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
           }
        }

        [HttpDelete]
        public void deleteConnectionRequests([FromBody] ConnectionRequestRequest deleteConnectionRequest)
        {
            try 
            {
                //Kinda scuffed but using "delete from" in fromsql doesn't work for some reason
                List<ConnectionRequest> cr = _psql.connection_request
                    .FromSql($"select * from connection_request cr WHERE cr.sender_id = {deleteConnectionRequest.sender_id} AND cr.receiver_id = {deleteConnectionRequest.receiver_id}")
                    .ToList();
                _psql.connection_request.Remove(cr[0]);
                _psql.SaveChanges();
            }
            catch (Exception e) 
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }
        }
    }
}