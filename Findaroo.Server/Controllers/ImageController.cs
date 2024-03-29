using Findaroo.Server.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Drawing;
using System.IO;
using System.Net;

namespace Findaroo.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        [HttpGet]
        public IActionResult getProfilePicture(String user_id)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "Images\\Profile", user_id);

            try
            {
                if (!Directory.Exists(path)) 
                {
                    path = Path.Combine(Directory.GetCurrentDirectory(), "Images\\Profile\\Default.jpg");
                } 
                else
                {
                    path = Directory.GetFiles(path)
                        .FirstOrDefault(Path.Combine(Directory.GetCurrentDirectory(), "Images\\Profile\\Default.jpg"));
                }

                Byte[] b = System.IO.File.ReadAllBytes(path);
                return File(b, "image/jpeg");
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return null;
            }
        }

        [HttpPost]
        // https://stackoverflow.com/questions/69676656/upload-files-via-js-to-asp-net-core-with-iformfile
        public void uploadProfilePicture([FromForm] ImageModel imageModel)
        {
            try
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "Images/Profile", imageModel.user_id);

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                
                path = Path.Combine(path, imageModel.image_name);

                using (Stream stream = new FileStream(path, FileMode.Create))
                {
                    imageModel.form_file.CopyTo(stream);
                }
            } 
            catch (Exception ex)
            {
                Response.StatusCode = ((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPut]
        public void updateProfilePicture([FromForm] ImageModel imageModel)
        {
            try
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "Images/Profile", imageModel.user_id);

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                var fileList = Directory.GetFiles(path);

                foreach ( var file in fileList )
                {
                    System.IO.File.Delete(file);
                }

                path = Path.Combine(path, imageModel.image_name);

                using (Stream stream = new FileStream(path, FileMode.Create))
                {
                    imageModel.form_file.CopyTo(stream);
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = ((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
