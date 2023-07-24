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
//using KMeansAlgorithm;


namespace WebApplication1.Controllers
{
    public class ActivityController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();


        // הוספפעילות
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
                    Description = newActivity.Description,
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



        //מחיקת פעילות
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
         EndDate = a.EndDate.HasValue ? a.EndDate.Value.Hour : 0
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
        [Route("api/TaskDetailsPredictionWithDifficultyNEW")]
        public Dictionary<int, List<(string TaskName, int TaskID, double TimeDifference)>> GetTaskDetailsPredictionWithDifficultyNEW()
        {
            try
            {
                var tasks = db.Tasks.ToList();

                List<double> timeDifferences = new List<double>();


                foreach (var task in tasks)
                {
                    if (task.PriceQuoteTime == null)
                    {
                        continue;
                    }
                    double priceQuoteTime = (double)task.PriceQuoteTime; // זמן משוער מתוך טבלת TASKS

                    var activities = db.Activity
                        .Where(a => a.TaskID == task.TaskID)
                        .ToList();

                    TimeSpan totalWorkHours = TimeSpan.Zero;

                    foreach (var activity in activities)
                    {
                        DateTime? startDate = activity?.StartDate;
                        DateTime? endDate = activity?.EndDate;

                        if (startDate != null && endDate != null)
                        {
                            totalWorkHours += endDate.Value - startDate.Value;
                        }
                    }

                    double actualTime = totalWorkHours.TotalHours; // זמן בפועל

                    double timeDifference = priceQuoteTime - actualTime; // הפרש הזמן

                    timeDifferences.Add(timeDifference);
                }


              
                while (timeDifferences.Count < tasks.Count)
                {
                    timeDifferences.Add(0.0);
                }

                int k = 3;
                List<List<(string TaskName, int TaskID, double TimeDifference)>> clusters = KMeansClustering(tasks, timeDifferences, k);

                Dictionary<int, List<(string TaskName, int TaskID, double TimeDifference)>> clusteredTaskDetailsDict = new Dictionary<int, List<(string TaskName, int TaskID, double TimeDifference)>>();

                for (int i = 0; i < clusters.Count; i++)
                {
                    
                    List<(string TaskName, int TaskID, double TimeDifference)> clusterItems = new List<(string TaskName, int TaskID, double TimeDifference)>();

                  
                    foreach (var item in clusters[i])
                    {
                        clusterItems.Add((item.TaskName, item.TaskID, item.TimeDifference));
                    }

                   
                    clusteredTaskDetailsDict.Add(i, clusterItems);
                }

                return clusteredTaskDetailsDict;
            }
            catch (Exception ex)
            {
               
                throw new Exception("Error predicting task difficulties.", ex);
            }
        }
        
        private List<List<(string TaskName, int TaskID, double TimeDifference)>> KMeansClustering(List<Tasks> tasks, List<double> values, int k)
        {
            List<List<(string TaskName, int TaskID, double TimeDifference)>> clusters = new List<List<(string, int, double)>>();

            
            Random rand = new Random();
            List<double> centroids = new List<double>();
            for (int i = 0; i < k; i++)
            {
                int randomIndex = rand.Next(values.Count);
                centroids.Add(values[randomIndex]);
            }

            bool changed = true;
            while (changed)
            {
               
                clusters = Enumerable.Range(0, k).Select(_ => new List<(string, int, double)>()).ToList();
                for (int i = 0; i < tasks.Count; i++)
                {
                    double value = values[i];
                    int clusterIndex = GetNearestCentroidIndex(value, centroids);
                    clusters[clusterIndex].Add((tasks[i].TaskName, tasks[i].TaskID, value));
                }

               
                List<double> newCentroids = new List<double>();
                for (int i = 0; i < k; i++)
                {
                    if (clusters[i].Count > 0)
                    {
                        double newCentroid = clusters[i].Average(item => item.TimeDifference);
                        newCentroids.Add(newCentroid);
                    }
                    else
                    {
                       
                        int randomIndex = rand.Next(values.Count);
                        newCentroids.Add(values[randomIndex]);
                    }
                }

               
                changed = !centroids.SequenceEqual(newCentroids);
                centroids = newCentroids;
            }

            return clusters;
        }

       
        private int GetNearestCentroidIndex(double value, List<double> centroids)
        {
            int index = 0;
            double minDistance = Math.Abs(value - centroids[0]);
            for (int i = 1; i < centroids.Count; i++)
            {
                double distance = Math.Abs(value - centroids[i]);
                if (distance < minDistance)
                {
                    index = i;
                    minDistance = distance;
                }
            }
            return index;
        }



    }

}
