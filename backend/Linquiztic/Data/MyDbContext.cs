using Linquiztic.Models;
using Microsoft.EntityFrameworkCore;

namespace Linquiztic.Data
{
    public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Word> Words { get; set; }
        public DbSet<UserLanguage> UserLanguages { get; set; }
    }
}
