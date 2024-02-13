namespace Findaroo.Server.Model
{
    public class ImageModel
    {
        public string user_id {  get; set; }
        public string image_name { get; set; }
        public IFormFile form_file { get; set; }
    }
}
