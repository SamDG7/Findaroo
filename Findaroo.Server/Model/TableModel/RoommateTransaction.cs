using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Findaroo.Server.Model.TableModel
{
    [Table("roommate_transaction")]
    public class RoommateTransaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string transaction_id { get; set; }
        public string room_id { get; set; }
        public string payer_id { get; set; }
        public List<string> receiver_id { get; set; }
        public double amount { get; set; }
        [DatabaseGenerated (DatabaseGeneratedOption.Identity)]
        public DateTime date_created { get; set; }

        public RoommateTransaction(string room_id, string payer_id, List<string> receiver_id, double amount)  {
            this.room_id = room_id;
            this.payer_id = payer_id;
            this.receiver_id = receiver_id;
            this.amount = amount;
        }

    }
}
