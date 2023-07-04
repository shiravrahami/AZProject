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
using System.Runtime.CompilerServices;
using System.Data.Entity.Infrastructure;

namespace WebApplication1.Controllers
{
    public class ListTasksController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/ListTasks/{employeeID}")]
        public IHttpActionResult Get(int employeeID)
        {
            try
            {

                if (employeeID == 6)
                {
                    var MangerTasksList = db.Tasks.Where(x=>!x.isDeleted).Select(x => new TasksDTO
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

                    }).ToList();
                    return Ok(MangerTasksList);

                }
                else
                {
                    var tasks = (from t in db.Tasks
                                 join tea in db.Task_Employee_Activity on t.TaskID equals tea.TaskID
                                 where tea.EmployeePK == employeeID
                                 && !t.isDeleted
                                 select new
                                 {
                                     t.TaskID,
                                     t.TaskName,
                                     t.ProjectID,
                                     t.TaskType,
                                     t.TaskDescription,
                                     t.InsertTaskDate,
                                     t.Deadline,
                                     t.isDone,
                                     t.isDeleted
                                 }).ToList();


                    if (tasks == null || tasks.Count == 0)
                    {
                        return NotFound();
                    }
                    var TasksList = tasks.Select(x => new TasksDTO
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

                    }).ToList();
                    return Ok(TasksList);
                }
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }

        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("api/ListTasks/{id}")]
        public IHttpActionResult Put(int id)
        {
            var tasks = db.Tasks.FirstOrDefault(c => c.TaskID == id);
            if (tasks == null)
            {
                return NotFound();
            }
            tasks.isDeleted = true;
            db.SaveChanges();
            return Ok("The task has been deleted!");
        }
    }
}
