using Findaroo.Server.Enums;
using Findaroo.Server.Model.TableModel;
using Findaroo.Server.PostgreSQL;

namespace Findaroo.Server.Utilities
{
    public class NotificationManager
    {
        PostgresContext _psql;

        public NotificationManager(PostgresContext psql)
        {
            _psql = psql;
        }

        public void recordNotification(string receiver_id, string sender_id, NotificationEnum type)
        {
            Notification notification = new Notification(sender_id, receiver_id, type);
            _psql.notification.Add(notification);
            _psql.SaveChanges();
        }

        public void recordMessageNotification(string receiver_id)
        {
            
        }

        public void recordConnectionRequestNotification(string receiver_id)
        {

        }

        public void recordConnectionRequestAcceptedNotification(string receiver_id)
        {

        }

        public void recordRoommateInvitationNotification(string receiver_id)
        {

        }

        public void recordRoommateInvitationAcceptedNotification(string receiver_id)
        {

        }
    }
}
