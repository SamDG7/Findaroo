namespace Findaroo.Server.Model.RequestModel.CalendarEvent
{
    public class AddEventRequest
    {
        public string room_id { get; set; }
        public string name { get; set; }
        public DateOnly date { get; set; }
        public string description { get; set; }
    }
}
