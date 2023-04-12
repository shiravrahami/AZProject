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
    public class TaskUpdateController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPut]
        [Route("api/TaskUpdate")]
        public IHttpActionResult UpdateTask([FromBody] TasksDTO updatedTask)
        {
            try
            {
                var task = db.Tasks.Find(updatedTask.TaskID);
                if (task == null)
                {
                    return NotFound();
                }
                task.TaskID = updatedTask.TaskID;
                task.TaskName = updatedTask.TaskName;
                task.ProjectID = updatedTask.ProjectID;
                task.TaskType = updatedTask.TaskType;
                task.TaskDescription = updatedTask.TaskDescription;
                task.InsertTaskDate = updatedTask.InsertTaskDate;
                task.Deadline= updatedTask.Deadline;
                task.isDone= updatedTask.isDone;
                task.isDeleted = updatedTask.isDeleted;

                db.SaveChanges();

                return Ok("good");
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

    }
}