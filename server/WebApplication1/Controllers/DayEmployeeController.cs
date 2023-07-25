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

    //לבדוק בפוסטמן
    //משימות לפי עובד ותאריך

    public class EmployeeTasksController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();

        [HttpGet]
        [Route("api/tasks/{employeeId}/{date}")]
        public List<TasksDTO> GetTasksByEmployeeAndDate(int employeeId, DateTime date)
        {
            List<TasksDTO> tasks = new List<TasksDTO>();

            using (var db = new igroup195_prodEntities())
            {
                var employeeTasks = db.Tasks
                    .Where(t => t.ProjectID == employeeId && t.InsertTaskDate.Date == date.Date)
                    .ToList();

                foreach (var task in employeeTasks)
                {
                    TasksDTO taskDTO = new TasksDTO
                    {
                        TaskID = task.TaskID,
                        TaskName = task.TaskName,
                        ProjectID = task.ProjectID,
                        TaskType = task.TaskType,
                        TaskDescription = task.TaskDescription,
                        InsertTaskDate = task.InsertTaskDate,
                        Deadline = (DateTime)task.Deadline,
                        isDone = task.isDone,
                        isDeleted = task.isDeleted
                    };

                    tasks.Add(taskDTO);
                }
            }

            return tasks;
        }




    }
}






