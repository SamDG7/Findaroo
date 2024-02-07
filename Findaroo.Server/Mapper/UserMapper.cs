using Findaroo.Server.Model.RequestModel;
using Findaroo.Server.Model.TableModel;

namespace Findaroo.Server.Mapper
{
    public class UserMapper
    {
        public static void update(User user, UpdateUserRequest updateUserRequest)
        {
            if (updateUserRequest == null) return;
            if (user == null) user = new User();

            if (updateUserRequest.first_name != null) user.first_name = updateUserRequest.first_name;
            if (updateUserRequest.last_name != null) user.last_name = updateUserRequest.last_name;
            if (updateUserRequest.email != null) user.email = updateUserRequest.email;
            if (updateUserRequest.phone != null) user.phone = updateUserRequest.phone;
            if (updateUserRequest.age != null) user.age = updateUserRequest.age.Value;
            if (updateUserRequest.address != null) user.address = updateUserRequest.address;
            if (updateUserRequest.state != null) user.state = updateUserRequest.state;
            if (updateUserRequest.country != null) user.country = updateUserRequest.country;
            if (updateUserRequest.zip_code != null) user.zip_code = updateUserRequest.zip_code;
            if (updateUserRequest.occupation != null) user.occupation = updateUserRequest.occupation;
            if (updateUserRequest.company != null) user.company = updateUserRequest.company;
            if (updateUserRequest.school != null) user.school = updateUserRequest.school;
            if (updateUserRequest.rating != null) user.rating = updateUserRequest.rating.Value;
        }
    }
}
