using System.Text.Json.Serialization;

namespace Linquiztic.Models
{
    public class Word
    {
        public int Id { get; set; }
        public string WordText { get; set; } = string.Empty;
        public DateOnly AddedDate { get; set; }
        public string Mastery { get; set; } = string.Empty;
        public Guid UserLanguageId { get; set; }

        [JsonIgnore]
        public UserLanguage UserLanguage { get; set; } = null!;
    }
}
