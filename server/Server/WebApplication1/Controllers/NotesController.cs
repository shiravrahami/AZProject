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
    public class NotesController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/Notes")]
        public IEnumerable<NotesDTO> GetNotes()
        {
            var notes = db.Notes
                            .Select(n => new NotesDTO
                            {
                                ID_Notes = n.ID,
                                EmployeePK_Notes = n.EmployeePK,
                                Title_Notes = n.Title,
                                Description_Notes = n.Description
                            })
                            .ToList();

            return notes;
        }
        //Within GetNotes(), a LINQ query is used to select all notes from the Notes table in the database, and map them to an instance of the NotesDTO class, which contains only the relevant properties needed to display a list of notes. The mapped notes are then returned as an IEnumerable<NotesDTO>.
    }
}
