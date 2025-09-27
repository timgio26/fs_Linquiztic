﻿namespace Linquiztic.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirebaseId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public ICollection<UserLanguage> UserLanguages { get; set; } = new List<UserLanguage>();
    }
}
