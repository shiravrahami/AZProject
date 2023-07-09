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




        //מכאן מתחיל קוד שקשור לפרויקט NIRchen




        //מקבלת מזהה של משימה ומחזירה את השעת התחלה וסיום עבורה
        [HttpGet]
        [Route("api/TaskDetailsActivity/{id}")]
        public IHttpActionResult GetTaskDetailsActivity(int id)
        {
            try
            {
                var activities = db.Activity
                    .Where(a => a.TaskID == id)
                    .Select(a => new
                    {
                        StartDate = a.StartDate.Hour,
                        EndDate = a.EndDate.Hour

                    })
                    .ToList();

                if (activities.Count == 0)
                    return NotFound();

                return Ok(activities);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //המתודה מציגה את סך השעות שעבדו על המשימה
        [HttpGet]
        [Route("api/TaskDetailsHour/{id}")]
        public IHttpActionResult GetTaskDetailsHour(int id)
        {
            try
            {
                var activities = db.Activity
                    .Where(a => a.TaskID == id)
                    .ToList();

                if (activities.Count == 0)
                    return NotFound();

                TimeSpan totalWorkHours = TimeSpan.Zero;

                foreach (var activity in activities)
                {
                    totalWorkHours += activity.EndDate - activity.StartDate;
                }

                var result = new
                {
                    TotalWorkHours = totalWorkHours.TotalHours
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        //המתודה כולל ההפרש בין המשוער לבפועל 
        [HttpGet]
        [Route("api/TaskDetailsHourCHECK/{id}")]
        public IHttpActionResult GetTaskDetailsHourCHECK(int id)
        {
            try
            {
                var task = db.Tasks.FirstOrDefault(t => t.TaskID == id);
                if (task == null)
                    return NotFound();

                double priceQuoteTime = task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                var activities = db.Activity
                    .Where(a => a.TaskID == id)
                    .ToList();

                if (activities.Count == 0)
                    return NotFound();

                TimeSpan totalWorkHours = TimeSpan.Zero;

                foreach (var activity in activities)
                {
                    totalWorkHours += activity.EndDate - activity.StartDate;
                }

                double actualTime = totalWorkHours.TotalHours; // זמן בפועל

                double timeDifference = priceQuoteTime - actualTime; // הפרש הזמן

                var result = new
                {
                    EstimatedTime = priceQuoteTime,
                    ActualTime = actualTime,
                    TimeDifference = timeDifference
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //מביא את המערך של כל נקודות ההפרשים
        [HttpGet]
        [Route("api/TaskDetailsPrediction")]
        public List<double> GetTaskDetailsPrediction()
        {
            try
            {
                var tasks = db.Tasks.ToList();

                List<double> clusterPoints = new List<double>();

                foreach (var task in tasks)
                {
                    double priceQuoteTime = task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                    var activities = db.Activity
                        .Where(a => a.TaskID == task.TaskID)
                        .ToList();

                    TimeSpan totalWorkHours = TimeSpan.Zero;

                    foreach (var activity in activities)
                    {
                        totalWorkHours += activity.EndDate - activity.StartDate;
                    }

                    double actualTime = totalWorkHours.TotalHours; // זמן בפועל

                    double timeDifference = priceQuoteTime - actualTime; // הפרש הזמן

                    clusterPoints.Add(timeDifference);
                }

                return clusterPoints;
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות
                throw new Exception("Error predicting cluster points.", ex);
            }
        }


        //מחזיר את הערך 6 כמו בקוד המקורי של ניר
        [HttpGet]
        [Route("api/TaskDetailsPredictionsTheEnd")]
        public int GetTaskDetailsPredictionTheEnd()
        {
            try
            {
                var tasks = db.Tasks.ToList();

                List<double> clusterPoints = new List<double>();

                foreach (var task in tasks)
                {
                    double priceQuoteTime = task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                    var activities = db.Activity
                        .Where(a => a.TaskID == task.TaskID)
                        .ToList();

                    TimeSpan totalWorkHours = TimeSpan.Zero;

                    foreach (var activity in activities)
                    {
                        totalWorkHours += activity.EndDate - activity.StartDate;
                    }

                    double actualTime = totalWorkHours.TotalHours; // זמן בפועל

                    double timeDifference = priceQuoteTime - actualTime; // הפרש הזמן

                    clusterPoints.Add(timeDifference);
                }

                double newDataPoint = 1.0; // הנקודה שאנו רוצים לזהות

                List<double> distances = clusterPoints.Select(point => Math.Abs(point - newDataPoint)).ToList();
                double minDistance = distances.Min();
                int clusterIndex = distances.IndexOf(minDistance);

                return clusterIndex;
                
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות
                throw new Exception("Error predicting cluster index.", ex);
            }
        }






    }
}
