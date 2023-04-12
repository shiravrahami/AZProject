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
    public class InsertTaskController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPost]
        [Route("api/InsertTask")]
        public IHttpActionResult InsertTask([FromBody] TasksDTO task)
        {
            try
            {
                if (string.IsNullOrEmpty(task.TaskName?.ToString()) || 
                    string.IsNullOrEmpty(task.TaskDescription?.ToString()) ||
                    task.ProjectID==0)
                {
                    return BadRequest("One or more parameters are missing or projty");
                }
                Tasks Task = new Tasks() 
                {
                    TaskName = task.TaskName,
                    ProjectID = task.ProjectID,
                    TaskType = task.TaskType,
                    TaskDescription = task.TaskDescription,
                    InsertTaskDate = task.InsertTaskDate,
                    Deadline = task.Deadline,
                };

                
                db.Tasks.Add(Task);
                db.SaveChanges();

                return Ok("Task details saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving Task details: {ex.Message}");
            }
        }
    }
}

    
