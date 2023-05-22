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
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/tasks/{employeeId}/{date}")]
        public List<TasksDTO> GetTasksByEmployeeAndDate(int employeeId, DateTime date)
        {
            List<TasksDTO> tasks = new List<TasksDTO>();

            using (var db = new igroup195_DB_Prod())
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





//    public class DayEmployeeController : ApiController
//    {
//        igroup195_DB_Prod db = new igroup195_DB_Prod();

//        [HttpGet]
//        [Route("api/DayEmployee/{employeePK}/{day}")]
//        public IHttpActionResult GetTasksByEmployeeAndDay(int employeePK, DateTime day)
//        {
//            var tasks = db.Tasks
//                .Where(t => t.EmployeePK == employeePK && t.InsertTaskDate == day && !t.isDeleted)
//                .Select(t => new TaskNameAndDateDTO { TaskName = t.TaskName, InsertTaskDate = t.InsertTaskDate })
//                .ToList();

//            if (tasks == null || !tasks.Any())
//            {
//                return NotFound();
//            }

//            return Ok(tasks);
//        }


//        [HttpGet]
//        [Route("api/DayEmployee/{employeePK}/{day}")]
//        public IHttpActionResult GetTasksByEmployeeAndDay(int employeePK, DateTime day)
//        {
//            var tasks = db.Tasks
//                  .Where(t => t.EmployeePK == employeePK && t.InsertTaskDate == day && t.isDeleted == false)
//                  .Select(t => new TaskNameAndDateDTO { TaskName = t.TaskName, InsertTaskDate = t.InsertTaskDate })
//                  .ToList();

//            if (tasks == null || tasks.Count == 0)
//            {
//                return NotFound();
//            }
//            else
//            {
//                return Ok(tasks);
//            }
//        }



//        [HttpGet]
//        [Route("api/EmployeeTasks/{employeeID}")]
//        public IHttpActionResult GetTasksByEmployeeAndDate(string employeeID, DateTime? date = null)
//        {
//            if (date == null)
//            {
//                date = DateTime.Today;
//            }

//            var employeeTasks = db.Tasks
//                .Where(t => t.EmployeeID == employeeID && t.InsertTaskDate == date.Value && t.isDeleted == false)
//                .Select(t => new TaskNameAndDateDTO { TaskName = t.TaskName, InsertTaskDate = t.InsertTaskDate })
//                .ToList();

//            if (employeeTasks == null || employeeTasks.Count == 0)
//            {
//                return NotFound();
//            }

//            return Ok(employeeTasks);
//        }
//    }

//}
