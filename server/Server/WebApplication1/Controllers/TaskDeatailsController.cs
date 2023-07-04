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

namespace WebApplication1.Controllers
{
    public class TaskDeatailsController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/TaskDeatails/{id}")]
        public IHttpActionResult GetTask(int id)
        {
            try
            {
                var task = db.Tasks
                    .Where(x => x.TaskID == id)
                    .Select(x => new TasksDTO 
                    {
                        TaskID = x.TaskID,
                        TaskName = x.TaskName,
                        ProjectID = x.ProjectID,
                        TaskType = x.TaskType,
                        TaskDescription = x.TaskDescription,
                        InsertTaskDate = x.InsertTaskDate,
                        Deadline = (DateTime)(x.Deadline),
                        isDone = x.isDone,
                        isDeleted = x.isDeleted
                    })
                    .FirstOrDefault();

                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
