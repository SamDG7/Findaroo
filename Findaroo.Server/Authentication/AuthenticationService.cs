using FirebaseAdmin.Auth;
using System.Runtime.CompilerServices;

namespace Findaroo.Server.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        public async Task<String> CreateUser(String username, String password)
        {
            var userArgs = new UserRecordArgs
            {
                Email = username,
                Password = password
            };

            var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(userArgs);

            return userRecord.Uid;
        }

        public async Task<String> Authenticate(String idToken)
        {
            try
            {
                var userRecord = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                return userRecord.Uid;
            } catch (FirebaseAuthException)
            {
                throw;
            }
        }
    }
}
