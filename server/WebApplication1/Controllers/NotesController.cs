using System;
using System.Collections.Generic;
using System.Web.Http;
using WebApplication1.DTO;
using SignIn;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;


namespace WebApplication1.Controllers
{
    //מביא את כל הפתקים

    public class NotesController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/Notes")]
        public IHttpActionResult GetAllNotes()
        {
            try
            {
                var notes = db.Notes
                    .Select(x => new NotesDTO
                    {
                        ID_Notes = x.ID,
                        EmployeePK_Notes = x.EmployeePK,
                        Title_Notes = x.Title,
                        Description_Notes = x.Description
                    })
                    .ToList();

                return Ok(notes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    //מביא פתק ספציפי
    //public class NotesController : ApiController
    //{
    //    igroup195_DB_Prod db = new igroup195_DB_Prod();
    //    [HttpGet]
    //    [Route("api/Notes/{id}")]
    //    public IHttpActionResult GetNoteById(int id)
    //    {
    //        try
    //        {
    //            var note = db.Notes
    //                .Where(x => x.ID == id)
    //                .Select(x => new NotesDTO
    //                {
    //                    ID_Notes = x.ID,
    //                    EmployeePK_Notes = x.EmployeePK,
    //                    Title_Notes = x.Title,
    //                    Description_Notes = x.Description
    //                })
    //                .FirstOrDefault();

    //            return Ok(note);
    //        }
    //        catch (Exception ex)
    //        {
    //            return BadRequest(ex.Message);
    //        }
    //    }
    //}

}
