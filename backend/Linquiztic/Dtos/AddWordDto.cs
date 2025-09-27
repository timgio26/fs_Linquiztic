namespace Linquiztic.Dtos
{
    public class AddWordDto
    {
        public string WordText { get; set; } = string.Empty;
        public Guid UserLanguageId { get; set; }
    }
}
