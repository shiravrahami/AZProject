﻿using System;
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
        igroup195_prodEntities db = new igroup195_prodEntities();


        // הוספת פעילות
        //לא טוב
        [HttpPost]
        [Route("api/ActivitiesAdd")]
        public IHttpActionResult ActivitiesAdd(ActivityDTO newActivity)
        {
            try
            {

                Activity activity = new Activity()
                {
                    TaskID = newActivity.TaskID,
                    EmployeePK = newActivity.EmployeePK,
                    Description= newActivity.Description,
                    StartDate = newActivity.StartDate,
                    EndDate = newActivity.EndDate
                };

                var exisTasks = db.Tasks.FirstOrDefault(a => a.TaskID == newActivity.TaskID);
                var exisEmployee = db.Employees.FirstOrDefault(h => h.ID == newActivity.EmployeePK);

                if (exisTasks == null && exisEmployee == null)
                {
                    return BadRequest("Task And Employee Not Exists");
                }

                db.Activity.Add(activity);
                db.SaveChanges();

                return Ok("Activity details saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving Project details: {ex.Message}");
            }



        }
           
        

        //קוד נוסף למחיקת פעילות
        [HttpDelete]
        [Route("api/DeleteActivity/{activityID}")]
        public IHttpActionResult DeleteActivity(int activityID)
        {

            try
            {
                // בדיקה אם הפעילות קיימת
                var activity = db.Activity.FirstOrDefault(a => a.ActivityID == activityID);
                if (activity == null)
                {
                    return BadRequest("Activity is not found");
                }

                // מחיקת הפעילות ממסד הנתונים
                db.Activity.Remove(activity);
                db.SaveChanges();

                return Ok("Activity Remove");
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
         EndDate = a.EndDate.HasValue ? a.EndDate.Value.Hour :0
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
                    // Use the null-conditional operator (?.) and null-coalescing operator (??) to handle nullable TimeSpan
                    TimeSpan? timeDifference = activity.EndDate - activity.StartDate;
                    totalWorkHours += timeDifference ?? TimeSpan.Zero;
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

                double priceQuoteTime = (double)task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                var activities = db.Activity
                    .Where(a => a.TaskID == id)
                    .ToList();

                TimeSpan totalWorkHours = TimeSpan.Zero;

                foreach (var activity in activities)
                {
                    // Use the null-conditional operator (?.) and null-coalescing operator (??) to handle nullable DateTime
                    DateTime? startDate = activity.StartDate;
                    DateTime? endDate = activity.EndDate;

                    if (startDate != null && endDate != null)
                    {
                        totalWorkHours += endDate.Value - startDate.Value;
                    }
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
                    double priceQuoteTime = (double)task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                    var activities = db.Activity
                        .Where(a => a.TaskID == task.TaskID)
                        .ToList();

                    TimeSpan totalWorkHours = TimeSpan.Zero;

                    foreach (var activity in activities)
                    {
                        // Use the null-conditional operator (?.) and null-coalescing operator (??) to handle nullable DateTime
                        DateTime? startDate = activity.StartDate;
                        DateTime? endDate = activity.EndDate;

                        if (startDate != null && endDate != null)
                        {
                            totalWorkHours += endDate.Value - startDate.Value;
                        }
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
        //[HttpGet]
        //[Route("api/TaskDetailsPredictionsTheEnd")]
        //public int GetTaskDetailsPredictionTheEnd()
        //{
        //    try
        //    {
        //        var tasks = db.Tasks.ToList();

        //        List<double> clusterPoints = new List<double>();

        //        foreach (var task in tasks)
        //        {
        //            double priceQuoteTime = task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

        //            var activities = db.Activity
        //                .Where(a => a.TaskID == task.TaskID)
        //                .ToList();

        //            TimeSpan totalWorkHours = TimeSpan.Zero;

        //            foreach (var activity in activities)
        //            {
        //                totalWorkHours += activity.EndDate - activity.StartDate;
        //            }

        //            double actualTime = totalWorkHours.TotalHours; // זמן בפועל

        //            double timeDifference = priceQuoteTime - actualTime; // הפרש הזמן

        //            clusterPoints.Add(timeDifference);
        //        }

        //        double newDataPoint = 1.0; // הנקודה שאנו רוצים לזהות

        //        List<double> distances = clusterPoints.Select(point => Math.Abs(point - newDataPoint)).ToList();
        //        double minDistance = distances.Min();
        //        int clusterIndex = distances.IndexOf(minDistance);

        //        return clusterIndex;

        //    }
        //    catch (Exception ex)
        //    {
        //        // טיפול בשגיאות
        //        throw new Exception("Error predicting cluster index.", ex);
        //    }
        //}


        //המתודה הסופית
        //מעודכנת שתקבל פרמטר
        [HttpGet]
        [Route("api/TaskDetailsPredictionsTheEnd/{value}")]
        public int GetTaskDetailsPredictionTheEnd(double value)
        {
            try
            {
                var tasks = db.Tasks.ToList();
                List<double> clusterPoints = new List<double>();

                foreach (var task in tasks)
                {
                    double priceQuoteTime = (double)task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                    var activities = db.Activity
                        .Where(a => a.TaskID == task.TaskID)
                        .ToList();

                    TimeSpan totalWorkHours = TimeSpan.Zero;

                    foreach (var activity in activities)
                    {
                        // Use the null-conditional operator (?.) and null-coalescing operator (??) to handle nullable DateTime
                        DateTime? startDate = activity.StartDate;
                        DateTime? endDate = activity.EndDate;

                        if (startDate != null && endDate != null)
                        {
                            totalWorkHours += endDate.Value - startDate.Value;
                        }
                    }

                    double actualTime = totalWorkHours.TotalHours; // זמן בפועל

                    double timeDifference = priceQuoteTime - actualTime; // הפרש הזמן

                    clusterPoints.Add(timeDifference);
                }

                List<double> distances = clusterPoints.Select(point => Math.Abs(point - value)).ToList();
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

        //נחלק לשלוש קטגוריות- קל, בנוני וקשה
        //טווח קל החל ממינוס שתיים ומטה
        //טווח בינוני ממינוס אחד ומעלה
        //טווח קשה שתיים ומעלה
        [HttpGet]
        [Route("api/TaskDetailsPredictionWithDifficulty")]
        public Dictionary<string, List<double>> GetTaskDetailsPredictionWithDifficulty()
        {
            try
            {
                var tasks = db.Tasks.ToList();

                List<double> easyTasks = new List<double>();
                List<double> mediumTasks = new List<double>();
                List<double> hardTasks = new List<double>();

                foreach (var task in tasks)
                {
                    double priceQuoteTime = (double)task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                    var activities = db.Activity
                        .Where(a => a.TaskID == task.TaskID)
                        .ToList();

                    TimeSpan totalWorkHours = TimeSpan.Zero;

                    foreach (var activity in activities)
                    {
                        // Use the null-conditional operator (?.) and null-coalescing operator (??) to handle nullable DateTime
                        DateTime? startDate = activity.StartDate;
                        DateTime? endDate = activity.EndDate;

                        if (startDate != null && endDate != null)
                        {
                            totalWorkHours += endDate.Value - startDate.Value;
                        }
                    }

                    double actualTime = totalWorkHours.TotalHours; // זמן בפועל

                    double timeDifference = priceQuoteTime - actualTime; // הפרש הזמן

                    if (timeDifference < -1) // קטגוריה קלה (הפרש שלילי גדול מ-1)
                    {
                        easyTasks.Add(timeDifference);
                    }
                    else if (timeDifference >= -1 && timeDifference <= 1) // קטגוריה בינונית (הפרש בין -1 ל-1 כולל)
                    {
                        mediumTasks.Add(timeDifference);
                    }
                    else // קטגוריה קשה (הפרש חיובי גדול מ-1)
                    {
                        hardTasks.Add(timeDifference);
                    }
                }

                var result = new Dictionary<string, List<double>>()
{
    { "Easy", easyTasks },
    { "Medium", mediumTasks },
    { "Hard", hardTasks }
};

                return result;

            }
            catch (Exception ex)
            {
                // טיפול בשגיאות
                throw new Exception("Error predicting task difficulties.", ex);
            }
        }




    }
}
