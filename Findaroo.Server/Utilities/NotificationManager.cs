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
            if (type == NotificationEnum.Message)
            {
                Notification? nExists = _psql.notification
                    .Where(n => n.sender_id.Equals(sender_id) && n.receiver_id.Equals(receiver_id) && n.type == type)
                    .FirstOrDefault();
                if (nExists == null)
                {
                    _psql.notification.Add(new Notification(sender_id, receiver_id, type));
                }
                else
                {
                    nExists.count += 1;
                    _psql.notification.Update(nExists);
                }
                _psql.SaveChanges();
            }
            else
            {
                _psql.notification.Add(notification);
                _psql.SaveChanges();
            }
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
