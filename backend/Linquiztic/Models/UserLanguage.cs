using System.Diagnostics;
using System.Text.Json.Serialization;

namespace Linquiztic.Models
{
    public class UserLanguage
    {
        public Guid Id { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;

        public ICollection<Word> Words { get; set; } = new List<Word>();

        public Guid UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;

    }
}
