using Findaroo.Server.Model.RequestModel.User;
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
            if (updateUserRequest.min_price != null) user.min_price = updateUserRequest.min_price;
            if (updateUserRequest.max_price != null) user.max_price = updateUserRequest.max_price;
            if (updateUserRequest.preferences != null) user.preferences = updateUserRequest.preferences;
            if (updateUserRequest.room_type != null) user.room_type = updateUserRequest.room_type;
            if (updateUserRequest.lifestyle_answers != null) user.lifestyle_answers = updateUserRequest.lifestyle_answers;
            user.status = updateUserRequest.status;
        }
    }
}
