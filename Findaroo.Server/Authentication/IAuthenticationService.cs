namespace Findaroo.Server.Authentication
{
    public interface IAuthenticationService
    {
        Task<string> CreateUser(String username, String password);
        Task<string> Authenticate(String idToken);
    }
}
