using Linquiztic.Data;
using Linquiztic.Dtos;
using Linquiztic.Models;
using Linquiztic.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Linquiztic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController(MyDbContext context,AIService aIService) : ControllerBase
    {
        private readonly MyDbContext _context = context;
        private readonly AIService _aiService = aIService;

        //[Authorize]
        [HttpGet("alluser")]
        public async Task<ActionResult> GetAllUser()
        {
            return Ok(await _context.Users.Include(each=>each.UserLanguages).ToListAsync());
        }

        [HttpPost("signup")]
        public async Task<ActionResult> AddUser(UserDto request)
        {
            var selectedUser = await _context.Users.FirstOrDefaultAsync(each => each.Email == request.email);
            if (selectedUser is not null) return BadRequest("user exist");
            User newuser = new User()
            {
                Id = Guid.NewGuid(),
                Name = request.name,
                Email = request.email,
                FirebaseId = request.firebaseId
            };
            await _context.Users.AddAsync(newuser);
            await _context.SaveChangesAsync();
            return Ok(newuser);
        }

        //[HttpPost("signin")]
        //public async Task<ActionResult> Signin(SigninDto request)
        //{
        //    var selectedUser = await _context.Users.Include(user=>user.UserLanguages).FirstOrDefaultAsync(each => each.Email == request.email);
        //    if (selectedUser is null) return BadRequest("user not exist");
        //    return Ok(selectedUser);
        //}

        [Authorize]
        [HttpDelete("deleteUser/{id}")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {
            var selectedUser = await _context.Users.FirstOrDefaultAsync(each => each.Id == id);
            if (selectedUser is null) return BadRequest("no user");
            _context.Users.Remove(selectedUser);
            await _context.SaveChangesAsync();
            return Ok("delete account success");
        }

        [Authorize]
        [HttpGet("getUserLanguage/{id}")]
        public async Task<ActionResult> GetUserLanguage(string id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(each => each.FirebaseId == id);
            if (user is null) return BadRequest("no user found");
            var myLanguages = await _context.UserLanguages.Where(each => each.UserId == user.Id).ToListAsync();
            return Ok(myLanguages);
        }

        [Authorize]
        [HttpPost("addLanguage")]
        public async Task<ActionResult> AddLanguage(AddLanguageDto request)
        {
            var selectedUser = await _context.Users.FirstOrDefaultAsync(each => each.FirebaseId == request.UserId);
            if (selectedUser is null) return BadRequest("no user");
            UserLanguage newLanguage = new UserLanguage()
            {
                Language = request.Language,
                Level = request.Level,
                UserId = selectedUser.Id,
                User = selectedUser,
                Id = Guid.NewGuid()
            };
            Console.WriteLine(newLanguage);
            await _context.UserLanguages.AddAsync(newLanguage);
            await _context.SaveChangesAsync();
            return Ok(newLanguage);
        }

        [Authorize]
        [HttpDelete("deleteLanguage/{id}")]
        public async Task<ActionResult> DeleteLanguage(Guid id)
        {
            var selectedLanguage = await _context.UserLanguages.FirstOrDefaultAsync(each => each.Id == id);
            if (selectedLanguage is null) return BadRequest("not found");
            _context.UserLanguages.Remove(selectedLanguage);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpGet("getLanguage/{id}")]
        public async Task<ActionResult> GetLanguage(Guid id)
        {
            var selectedLanguage = await _context.UserLanguages.Include(each => each.Words).FirstOrDefaultAsync(each => each.Id == id);
            if (selectedLanguage is null) return BadRequest("not found");
            return Ok(selectedLanguage);
        }

        [Authorize]
        [HttpPost("addWord")]
        public async Task<ActionResult> AddWord(AddWordDto request)
        {
            var selectedLanguage = await _context.UserLanguages.FirstOrDefaultAsync(each => each.Id == request.UserLanguageId);
            if (selectedLanguage is null) return BadRequest("not found");
            Word newWord = new Word()
            {
                WordText = request.WordText,
                AddedDate = DateOnly.FromDateTime(DateTime.Now),
                Mastery = "new",
                UserLanguageId = request.UserLanguageId,
                UserLanguage = selectedLanguage
            };
            await _context.Words.AddAsync(newWord);
            await _context.SaveChangesAsync();
            return Ok(newWord);
        }

        [Authorize]
        [HttpDelete("deleteWord/{id}")]
        public async Task<ActionResult> DeleteWord(int id)
        {
            var selectedWord = await _context.Words.FirstOrDefaultAsync(each => each.Id == id);
            if (selectedWord is null) return BadRequest();
            _context.Words.Remove(selectedWord);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet("getNewWords")]
        public async Task<ActionResult> GetWords(Guid userLangId)
        {
            var userLanguage = await _context.UserLanguages.Include(each => each.Words).FirstOrDefaultAsync(each=>each.Id == userLangId);
            if (userLanguage is null){ Console.WriteLine("null"); return NotFound(); }
            //Console.WriteLine("heheh");
            List<string> wordList = [];
            foreach(var word in userLanguage.Words)
            {
                wordList.Add(word.WordText);
            }
            string words = string.Join(" ", wordList);
            var response = await _aiService.FetchAiResponse(userLanguage.Language,userLanguage.Level,words);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("getWordMeaning")]
        public async Task<ActionResult> GetWordMeaning(string word,string language)
        {
            var response = await _aiService.GetWordMeaningExample(word, language);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("quiz/{id}")]
        public async Task<ActionResult> GetQuiz(Guid id)
        {
            var userLanguage = await _context.UserLanguages.Include(each => each.Words).FirstOrDefaultAsync(each => each.Id == id);
            if (userLanguage is null) { Console.WriteLine("null"); return NotFound(); }
            //Console.WriteLine("heheh");
            List<string> wordList = [];
            foreach (var word in userLanguage.Words)
            {
                wordList.Add(word.WordText);
            }
            var response = await _aiService.GetQuiz(wordList,userLanguage.Language, userLanguage.Level);
            return Ok(response);
        }
    }
}
