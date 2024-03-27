using Findaroo.Server.Model.TableModel;
using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.PostgreSQL
{
    public class PostgresContext : DbContext
    {
        protected readonly IConfiguration _configuration;
        public PostgresContext(DbContextOptions<PostgresContext> options) : base(options) {}
        public DbSet<User> user { get; set; }
        public DbSet<Connection> connection { get; set; }
        public DbSet<ConnectionRequest> connection_request { get; set; }
        public DbSet<Conversation> conversation { get; set; }
        public DbSet<ConversationMessage> conversation_message { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(x => x.user_id)
                .HasDefaultValueSql("gen_random_uuid()");
            modelBuilder.Entity<User>()
                .Property(x => x.date_modified)
                .HasDefaultValueSql("current_timestamp");
            modelBuilder.Entity<Conversation>()
                .Property(x => x.conversation_id)
                .HasDefaultValueSql("gen_random_uuid()");
            modelBuilder.Entity<Conversation>()
                .Property(x => x.date_modified)
                .HasDefaultValueSql("current_timestamp");
            modelBuilder.Entity<ConversationMessage>()
                .Property(x => x.message_id)
                .HasDefaultValueSql("gen_random_uuid()");
            modelBuilder.Entity<ConversationMessage>()
                .Property(x => x.message_id)
                .HasDefaultValueSql("current_timestamp");
        }
    }
}
