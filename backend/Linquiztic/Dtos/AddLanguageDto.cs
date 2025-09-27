namespace Linquiztic.Dtos
{
    public class AddLanguageDto
    {
        public string Language { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string UserId { get; set; }
    }
}
