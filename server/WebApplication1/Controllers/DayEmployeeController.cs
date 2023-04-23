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
    //משימות לפי עובד ויום
    public class DayEmployeeController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/DayEmployee/{employeePK}/{day}")]
        public IHttpActionResult GetTasksByEmployeeAndDay(int employeePK, DateTime day)
        {
            var tasks = db.Tasks
                  .Where(t => t.EmployeePK == employeePK && t.InsertTaskDate == day && t.isDeleted == false)
                  .Select(t => new TaskNameAndDateDTO { TaskName = t.TaskName, InsertTaskDate = t.InsertTaskDate })
                  .ToList();

            if (tasks == null || tasks.Count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(tasks);
            }
        }
    }

}
