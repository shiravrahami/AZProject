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
    //כל הקבצים
    public class FileController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/File")]
        public IHttpActionResult GetAllFiles()
        {
            try
            {
                var files = db.Files
                    .Select(f => new FileDTO
                    {
                        FileID = f.FileID,
                        Path = f.Path,
                        Description = f.Description,
                        //FileType = f.FileType
                    })
                    .ToList();

                return Ok(files);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }


    //קובץ ספציפי
    //public class FileController : ApiController
    //{
    //    igroup195_DB_Prod db = new igroup195_DB_Prod();

    //    [HttpGet]
    //    [Route("api/File/{id}")]
    //    public IHttpActionResult GetFile(int id)
    //    {
    //        try
    //        {
    //            var file = db.Files
    //                .Where(f => f.FileID == id)
    //                .Select(f => new FileDTO
    //                {
    //                    FileID = f.FileID,
    //                    Path = f.Path,
    //                    Description = f.Description
    //                })
    //                .FirstOrDefault();

    //            if (file == null)
    //            {
    //                return NotFound();
    //            }

    //            return Ok(file);
    //        }
    //        catch (Exception ex)
    //        {
    //            return BadRequest(ex.Message);
    //        }
    //    }
    //}

}
