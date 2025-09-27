namespace Linquiztic.Dtos
{
    public class UserDto
    {
        public string name { get; set; }
        public string email { get; set; }
        public string firebaseId { get; set; }
    }

    public class SigninDto
    {
        public string email { get; set; }
    }
}
