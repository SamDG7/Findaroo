using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text;
using static Google.Apis.Requests.BatchRequest;

namespace Findaroo.Server.Authentication
{
    public class AuthenticationService
    {
        public static async Task<string> authenticate(string? idToken)
        {
            if (idToken == null)
            {
                return null;
            }
            else
            {
                var userRecord = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                if (userRecord == null)
                {
                    return null;
                }
                return userRecord.Uid;
            }
            
        }
    }
}
