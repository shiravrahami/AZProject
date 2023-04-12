using SignIn;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    public class FileController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        // GET api/file/5
        [HttpGet]
        [Route("api/File/{id}")]
        public async Task<IHttpActionResult> GetFile(int id)
        {
            // Find the file in the database by its ID
            var file = await db.Files.FindAsync(id);//לוקחת פרמטר אינט שנקרא מזהה המשמש לאיתור הקובץ במסד הנתונים לפי המזהה שלו

            if (file == null)
            {
                return NotFound(); // Return 404 error if file not found
            }

            // Map the file entity to a file DTO
            var fileDTO = new FileDTO
            {
                FileID = file.FileID,
                Path = file.Path,
                Description = file.Description,
                //FileType = file.FileType,
                //FileTypeID = file.FileTypeID
            };

            // Return the file DTO
            return Ok<FileDTO>(fileDTO);
        }
    }


}
