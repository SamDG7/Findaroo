using Findaroo.Server.Model.RequestModel.CalendarEvent;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    public class CalendarEvent
    {
        [Key]
        public string event_id { get; set; }
        public string room_id { get; set; }
        public string name { get; set; }
        public DateOnly date { get; set; }
        public string description { get; set; }

        public CalendarEvent() { }

        public CalendarEvent(
            string room_id,
            string name,
            DateOnly date,
            string description
        )
        {
            this.room_id = room_id;
            this.name = name;
            this.date = date;
            this.description = description;
        }

        public CalendarEvent(AddEventRequest req)
        {
            this.room_id = req.room_id;
            this.name = req.name;
            this.date = req.date;
            this.description = req.description;
        }
    }
}
