using System;
using System.Collections.Generic;
using SignIn;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;
using Newtonsoft.Json.Linq;
using NLog;

namespace WebApplication1.Controllers
{
    public class ActivityController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        // הוספת פעילות
        //לא טוב
        [HttpPost]
        [Route("api/Activities")]
        public IHttpActionResult ActivitiesAdd(ActivityDTO newActivity)
        {
            try
            {
                // בדיקה שהפעילות לא קיימת
                var existingActivity = db.Activity.FirstOrDefault(a => a.ActivityID == newActivity.ActivityID);
                if (existingActivity != null)
                {
                    return BadRequest("Activity already exists");
                }

                // יצירת אובייקט פעילות חדשה
                var activity = new Activity
                {
                    //ActivityID = newActivity.Activity_ID,
                    TaskID = newActivity.TaskID,
                    EmployeePK = newActivity.EmployeePK,
                    StartDate = newActivity.StartDate,
                    EndDate = newActivity.EndDate
                };

                // הוספת הפעילות למסד הנתונים
                db.Activity.Add(activity);
                db.SaveChanges();

                // יצירת תשובת ה HTTP 200 OK עם הפעילות החדשה
                var activityDTO = new ActivityDTO
                {
                    ActivityID = activity.ActivityID,
                    TaskID = activity.TaskID,
                    EmployeePK = activity.EmployeePK,
                    StartDate = activity.StartDate,
                    EndDate = (DateTime)activity.EndDate
                };
                return Ok(activityDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //קוד נוסף להוספת פעילות
        //לא טוב
        //[HttpPost]
        //[Route("api/Activitiesnew")]
        //public IHttpActionResult CreateActivity(ActivityDTO activityDTO)
        //{
        //    try
        //    {
        //        // בדיקה שהפעילות לא קיימת עם אותם פרטים
        //        var existingActivity = db.Activity.FirstOrDefault(a => a.TaskID == activityDTO.TaskID
        //            && a.EmployeePK == activityDTO.EmployeePK
        //            && a.StartDate == activityDTO.StartDate
        //            && a.EndDate == activityDTO.EndDate);

        //        if (existingActivity != null)
        //        {
        //            return BadRequest("Activity already exists");
        //        }

        //        // יצירת אובייקט פעילות חדשה
        //        var newActivity = new Activity
        //        {
        //            TaskID = activityDTO.TaskID,
        //            EmployeePK = activityDTO.EmployeePK,
        //            StartDate = activityDTO.StartDate,
        //            EndDate = activityDTO.EndDate
        //        };

        //        // הוספת הפעילות למסד הנתונים
        //        db.Activity.Add(newActivity);
        //        db.SaveChanges();

        //        // יצירת תשובת ה HTTP 201 CREATED עם הפעילות החדשה
        //        var createdActivity = new ActivityDTO
        //        {
        //            ActivityID = newActivity.ActivityID,
        //            TaskID = newActivity.TaskID,
        //            EmployeePK = newActivity.EmployeePK,
        //            StartDate = newActivity.StartDate,
        //            EndDate = (DateTime)newActivity.EndDate
        //        };
        //        return Created(Request.RequestUri + "/" + createdActivity.ActivityID.ToString(), createdActivity);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}



        //מתודה שמוחקת פעילות לפי מזהה פעילות
        [HttpDelete]
        [Route("api/Activity/DeleteActivity/{activityID}")]
        public IHttpActionResult DeleteActivity(int activityID)
        {
            try
            {
                // בדיקה אם הפעילות קיימת
                Activity activity = db.Activity.Where(a => a.ActivityID == activityID).First();
                if (activity == null)
                {
                    return NotFound();
                }
                // מחיקת הפעילות ממסד הנתונים
                db.Activity.Remove(activity);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
