using Findaroo.Server.Model.TableModel;
using Microsoft.EntityFrameworkCore;

namespace Findaroo.Server.PostgreSQL
{
    public class PostgresContext : DbContext
    {
        protected readonly IConfiguration _configuration;

        public PostgresContext(DbContextOptions<PostgresContext> options) : base(options) {}

        public DbSet<User> user { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(x => x.user_id)
                .HasDefaultValueSql("gen_random_uuid()");
            modelBuilder.Entity<User>()
                .Property(x => x.date_modified)
                .HasDefaultValueSql("current_timestamp");
        }
    }
}
