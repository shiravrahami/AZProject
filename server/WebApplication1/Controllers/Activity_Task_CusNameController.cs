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
    //מתודה חדשה ששיר ביקשה
    public class Activity_Task_CusNameController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/GetActivity_Task_CusName/{taskId}")]
        public IHttpActionResult GetActivity_Task_CusName(int taskId)
        {
            try
            {
                var activities = db.Activity
                    .Where(a => a.TaskID == taskId)
                    .Join(db.Tasks, a => a.TaskID, t => t.TaskID, (a, t) => new { Activity = a, Task = t })
                    .Join(db.Customers, at => at.Task.ProjectID, c => c.ID, (at, c) => new { ActivityTask = at, Customer = c })
                    .Select(a => new ActivityDTO
                    {
                        Activity_ID = a.ActivityTask.Activity.ActivityID,
                        Task_ID = a.ActivityTask.Activity.TaskID,
                        Employee_PK = a.ActivityTask.Activity.EmployeePK,
                        Start_Date = a.ActivityTask.Activity.StartDate,
                        CustomerName = a.Customer.CustomerName
                    })
                    .ToList();

                return Ok(activities);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
