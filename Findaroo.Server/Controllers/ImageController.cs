using Findaroo.Server.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        [HttpGet]
        public IFormFile getProfilePicture(String user_id)
        {
            return null;
        }

        [HttpPost]
        public void uploadProfilePicture([FromForm] ImageModel imageModel)
        {
            try
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imageModel.image_name);

                using (Stream stream = new FileStream(path, FileMode.Create))
                {
                    imageModel.form_file.CopyTo(stream);
                }
            } catch (Exception ex)
            {
                Response.StatusCode = ((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
