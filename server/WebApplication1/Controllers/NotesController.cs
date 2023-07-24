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
        igroup195_prodEntities db = new igroup195_prodEntities();
        //הצגה של כל הפתקים
      
        [HttpGet]
        [Route("api/Notes")]
        public IHttpActionResult GetAllNotes()
        {
            try
            {
                var notes = db.Notes
                    .Select(x => new NotesDTO
                    {
                        ID = x.ID,
                        EmployeePK = x.EmployeePK,
                        Title = x.Title,
                        Description = x.Description
                    })
                    .ToList();

                return Ok(notes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        //מחיקת פתק ספציפי
        
        [HttpDelete]
        [Route("api/Notes/{id}")]
        public IHttpActionResult DeleteNoteByID(int id)
        {
            try
            {
                var note = db.Notes.FirstOrDefault(n => n.ID == id);
                if (note == null)
                {
                    return NotFound();
                }

                db.Notes.Remove(note);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //עריכת פתק ספציפי
        
        [HttpPut]
        [Route("api/Notes/{id}")]
        public IHttpActionResult UpdateNoteByID(int id, [FromBody] NotesDTO updatedNote)
        {
            try
            {
                var note = db.Notes.FirstOrDefault(n => n.ID == id);
                if (note == null)
                {
                    return NotFound();
                }

                // עדכון הפרטים של הפתק
                note.EmployeePK = updatedNote.EmployeePK;
                note.Title = updatedNote.Title;
                note.Description = updatedNote.Description;

                db.SaveChanges();

                return Ok(note);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        //הוספת פתק חדש
        
        [HttpPost]
        [Route("api/Notes")]
        public IHttpActionResult AddNewNote([FromBody] NotesDTO newNote)
        {
            try
            {
                // יצירת פתק חדש במסד הנתונים
                var note = new Notes
                {
                    EmployeePK = newNote.EmployeePK,
                    Title = newNote.Title,
                    Description = newNote.Description
                };

                var insertedNote = db.Notes.Add(note);
  
                db.SaveChanges();

                return Ok(insertedNote);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        //מביא פתק ספציפי
       
        [HttpGet]
        [Route("api/Notes/{id}")]
        public IHttpActionResult GetNoteById(int id)
        {
            try
            {
                var note = db.Notes
                    .Where(x => x.ID == id)
                    .Select(x => new NotesDTO
                    {
                        ID = x.ID,
                        EmployeePK = x.EmployeePK,
                        Title = x.Title,
                        Description = x.Description
                    })
                    .FirstOrDefault();

                return Ok(note);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}



