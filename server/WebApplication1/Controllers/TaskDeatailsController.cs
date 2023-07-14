using SignIn;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Http;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class TaskDeatailsController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        //פרטי משימה 
        [HttpGet]
        [Route("api/TaskDeatails/{id}")]
        public IHttpActionResult GetTask(int id)
        {
            try
            {
                var task = db.Tasks
                    .Where(x => x.TaskID == id)
                    .Select(x => new TasksDTO
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
                    })
                    .FirstOrDefault();

                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //עדכון משימה לפי מזהה משימה קוד חדש
        [HttpPut]
        [Route("api/TaskUpdate/{taskId}")]
        public IHttpActionResult UpdateTask(int taskId, [FromBody] TasksDTO updatedTask)
        {

            try
            {
                var task = db.Tasks.FirstOrDefault(ts => ts.TaskID == taskId);

                if (task == null)
                {
                    return BadRequest("Task not found");
                }

                task.TaskID = updatedTask.TaskID;
                task.TaskName = updatedTask.TaskName;
                task.ProjectID = updatedTask.ProjectID;
                task.TaskType = updatedTask.TaskType;
                task.TaskDescription = updatedTask.TaskDescription;
                task.InsertTaskDate = updatedTask.InsertTaskDate;
                task.Deadline = updatedTask.Deadline;
                task.isDone = updatedTask.isDone;
                task.isDeleted = updatedTask.isDeleted;

                db.SaveChanges();

                return Ok("Task details updated successfully");
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }



        //עדכון משימה קוד ישן 
        //[HttpPut]
        //[Route("api/TaskUpdate")]
        //public IHttpActionResult UpdateTasks([FromBody] TasksDTO updatedTask)
        //{

        //    try
        //    {
        //        var task = db.Tasks.Find(updatedTask.TaskID);
        //        if (task == null)
        //        {
        //            return NotFound();
        //        }

        //        task.TaskID = updatedTask.TaskID;
        //        task.TaskName = updatedTask.TaskName;
        //        task.ProjectID = updatedTask.ProjectID;
        //        task.TaskType = updatedTask.TaskType;
        //        task.TaskDescription = updatedTask.TaskDescription;
        //        task.InsertTaskDate = updatedTask.InsertTaskDate;
        //        task.Deadline = updatedTask.Deadline;
        //        task.isDone = updatedTask.isDone;
        //        task.isDeleted = updatedTask.isDeleted;

        //        db.SaveChanges();

        //        return Ok("good");
        //    }
        //    catch (Exception)
        //    {
        //        return BadRequest();
        //    }
        //}

        //סוגי משימה
        [HttpGet]
        [Route("api/TaskTypes")]
        public IHttpActionResult GetAllTaskTypes()
        {
            try
            {
                var taskTypes = db.TaskType
                    .Select(t => new TaskTypeDTO
                    {
                        TaskTypeID = t.TaskTypeID,
                        TaskKind = t.TaskKind
                    })
                    .ToList();

                return Ok(taskTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //InsertTask
        [HttpPost]
        [Route("api/InsertTask")]
        public IHttpActionResult InsertTask([FromBody] TasksDTO task)
        {
            try
            {
                if (string.IsNullOrEmpty(task.TaskName?.ToString()) ||
                    string.IsNullOrEmpty(task.TaskDescription?.ToString()) ||
                    task.ProjectID == 0)
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

        //מקורית
        //[HttpGet]
        //[Route("api/ListTasks/{employeeID}")]
        //public IHttpActionResult GetListTasks(int employeeID)
        //{
        //    try
        //    {

        //        if (employeeID == 6)
        //        {
        //            var MangerTasksList = db.Tasks.Where(x => !x.isDeleted)
        //                 .OrderByDescending(x => x.InsertTaskDate)
        //                .Select(x => new TasksDTO
        //                {
        //                    TaskID = x.TaskID,
        //                    TaskName = x.TaskName,
        //                    ProjectID = x.ProjectID,
        //                    TaskType = x.TaskType,
        //                    TaskDescription = x.TaskDescription,
        //                    InsertTaskDate = x.InsertTaskDate,
        //                    Deadline = (DateTime)(x.Deadline),
        //                    isDone = x.isDone,
        //                    isDeleted = x.isDeleted,
        //                    CustomerName = x.Projects.Customers.CustomerName

        //                }).ToList();
        //            return Ok(MangerTasksList);

        //        }
        //        else
        //        {
        //            var tasks = (from t in db.Tasks
        //                         join tea in db.Task_Employee_Activity on t.TaskID equals tea.TaskID
        //                         where tea.EmployeePK == employeeID
        //                         && !t.isDeleted
        //                         orderby t.InsertTaskDate descending
        //                         select new
        //                         {
        //                             t.TaskID,
        //                             t.TaskName,
        //                             t.ProjectID,
        //                             t.TaskType,
        //                             t.TaskDescription,
        //                             t.InsertTaskDate,
        //                             t.Deadline,
        //                             t.isDone,
        //                             t.isDeleted,
        //                             CustomerName = t.Projects.Customers.CustomerName
        //                         }).ToList();

        //            if (tasks == null || tasks.Count == 0)
        //            {
        //                return NotFound();
        //            }

        //            var TasksList = tasks.Select(x => new TasksDTO
        //            {
        //                TaskID = x.TaskID,
        //                TaskName = x.TaskName,
        //                ProjectID = x.ProjectID,
        //                TaskType = x.TaskType,
        //                TaskDescription = x.TaskDescription,
        //                InsertTaskDate = x.InsertTaskDate,
        //                Deadline = (DateTime)(x.Deadline),
        //                isDone = x.isDone,
        //                isDeleted = x.isDeleted,
        //                CustomerName = x.CustomerName
        //            }).ToList();

        //            return Ok(TasksList);
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        return BadRequest("Error");
        //    }
        //}

        //מקורית בתוספת שם העובד
        [HttpGet]
        [Route("api/ListTasks/{employeeID}")]
        public IHttpActionResult GetListTasks(int employeeID)
        {
            try
            {
                if (employeeID == 6)
                {
                    var MangerTasksList = db.Tasks.Where(x => !x.isDeleted)
                        .OrderByDescending(x => x.InsertTaskDate)
                        .Select(x => new TasksDTO
                        {
                            TaskID = x.TaskID,
                            TaskName = x.TaskName,
                            ProjectID = x.ProjectID,
                            TaskType = x.TaskType,
                            TaskDescription = x.TaskDescription,
                            InsertTaskDate = x.InsertTaskDate,
                            Deadline = (DateTime)(x.Deadline),
                            isDone = x.isDone,
                            isDeleted = x.isDeleted,
                            CustomerName = x.Projects.Customers.CustomerName,
                            EmployeeName = ""
                        }).ToList();
                    return Ok(MangerTasksList);
                }
                else
                {
                    var tasks = (from t in db.Tasks
                                 join tea in db.Task_Employee_Activity on t.TaskID equals tea.TaskID
                                 join e in db.Employees on tea.EmployeePK equals e.ID
                                 where tea.EmployeePK == employeeID && !t.isDeleted
                                 orderby t.InsertTaskDate descending
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
                                     t.isDeleted,
                                     CustomerName = t.Projects.Customers.CustomerName,
                                     EmployeeName = e.EmployeeName
                                 }).ToList();

                    if (tasks == null)
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
                        isDeleted = x.isDeleted,
                        CustomerName = x.CustomerName,
                        EmployeeName = x.EmployeeName
                    }).ToList();

                    return Ok(TasksList);
                }
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }




        //שכפול ומיון לפי שם משימה
        [HttpGet]
        [Route("api/ListTasksNameDesc/{employeeID}")]
        public IHttpActionResult GetListTasksNameDesc(int employeeID)
        {
            try
            {

                if (employeeID == 6)
                {
                    var MangerTasksList = db.Tasks.Where(x => !x.isDeleted)
                         .OrderByDescending(x => x.TaskName)
                        .Select(x => new TasksDTO
                        {
                            TaskID = x.TaskID,
                            TaskName = x.TaskName,
                            ProjectID = x.ProjectID,
                            TaskType = x.TaskType,
                            TaskDescription = x.TaskDescription,
                            InsertTaskDate = x.InsertTaskDate,
                            Deadline = (DateTime)(x.Deadline),
                            isDone = x.isDone,
                            isDeleted = x.isDeleted,
                            CustomerName = x.Projects.Customers.CustomerName

                        }).ToList();
                    return Ok(MangerTasksList);

                }
                else
                {
                    var tasks = (from t in db.Tasks
                                 join tea in db.Task_Employee_Activity on t.TaskID equals tea.TaskID
                                 where tea.EmployeePK == employeeID
                                 && !t.isDeleted
                                 orderby t.InsertTaskDate descending
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
                                     t.isDeleted,
                                     CustomerName = t.Projects.Customers.CustomerName
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
                        isDeleted = x.isDeleted,
                        CustomerName = x.CustomerName
                    }).ToList();

                    return Ok(TasksList);
                }
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }








        //כולל הוספת המיון
        //ListTasks/{employeeID}
        //[HttpGet]
        //[Route("api/ListTasks/{employeeID}")]
        //public IHttpActionResult GetListTasks(int employeeID)
        //{
        //    try
        //    {

        //        if (employeeID == 6)
        //        {

        //            var MangerTasksList = db.Tasks.Where(x => !x.isDeleted)
        //                 .OrderByDescending(x => x.InsertTaskDate)
        //                .Select(x => new TasksDTO
        //                {
        //                    TaskID = x.TaskID,
        //                    TaskName = x.TaskName,
        //                    ProjectID = x.ProjectID,
        //                    TaskType = x.TaskType,
        //                    TaskDescription = x.TaskDescription,
        //                    InsertTaskDate = x.InsertTaskDate,
        //                    Deadline = (DateTime)(x.Deadline),
        //                    isDone = x.isDone,
        //                    isDeleted = x.isDeleted

        //                }).ToList();
        //            return Ok(MangerTasksList);

        //        }
        //        else
        //        {

        //            var tasks = (from t in db.Tasks
        //                         join tea in db.Task_Employee_Activity on t.TaskID equals tea.TaskID
        //                         where tea.EmployeePK == employeeID
        //                         && !t.isDeleted
        //                         orderby t.InsertTaskDate descending
        //                         select new
        //                         {
        //                             t.TaskID,
        //                             t.TaskName,
        //                             t.ProjectID,
        //                             t.TaskType,
        //                             t.TaskDescription,
        //                             t.InsertTaskDate,
        //                             t.Deadline,
        //                             t.isDone,
        //                             t.isDeleted
        //                         }).ToList();


        //            if (tasks == null || tasks.Count == 0)
        //            {
        //                return NotFound();
        //            }

        //            var TasksList = tasks.Select(x => new TasksDTO
        //            {
        //                TaskID = x.TaskID,
        //                TaskName = x.TaskName,
        //                ProjectID = x.ProjectID,
        //                TaskType = x.TaskType,
        //                TaskDescription = x.TaskDescription,
        //                InsertTaskDate = x.InsertTaskDate,
        //                Deadline = (DateTime)(x.Deadline),
        //                isDone = x.isDone,
        //                isDeleted = x.isDeleted

        //            }).ToList();
        //            return Ok(TasksList);
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        return BadRequest("Error");
        //    }
        //}

        //אותה מתודה עם התאריך העתידי
        [HttpGet]
        [Route("api/ListTasksNextDay/{employeeID}")]
        public IHttpActionResult GetListTasksNextDay(int employeeID)
        {
            try
            {
                DateTime today = DateTime.Now.Date;

                if (employeeID == 6)
                {
                    var MangerTasksList = db.Tasks
                        .Where(x => !x.isDeleted && x.Deadline >= today)
                        .OrderByDescending(x => x.InsertTaskDate)
                        .Select(x => new TasksDTO
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
                        })
                        .ToList();

                    return Ok(MangerTasksList);
                }
                else
                {
                    var tasks = (from t in db.Tasks
                                 join tea in db.Task_Employee_Activity on t.TaskID equals tea.TaskID
                                 where tea.EmployeePK == employeeID && !t.isDeleted && t.Deadline >= today
                                 orderby t.InsertTaskDate descending
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
                                 })
                                 .ToList();

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
                    })
                    .ToList();

                    return Ok(TasksList);
                }
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }





        //ListTasks/{id}
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("api/ListTasks/{id}")]
        public IHttpActionResult PutListTasks(int id)
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

        //חזיר את מספר המשימות הפתוחות
        //SumTasks
        [HttpGet]
        [Route("api/SumTasks/GetOpenTasksCount")]
        public IHttpActionResult GetOpenTasksCount()
        {
            int openTasksCount = db.Tasks
                                .Where(t => t.isDeleted == false && t.isDone == false)
                                .Select(t => t.TaskID)
                                .Count();

            return Ok(openTasksCount);
        }


        //מחזיר פעילות לפי משימה ספציפית 
        //יצרתי אותה מתודה בתוספת שם לקוח
        [HttpGet]
        [Route("api/Tasks/{taskId}/Activities")]
        public IHttpActionResult GetActivitiesByTaskId(int taskId)
        {
            try
            {
                var activities = db.Activity
                    .Where(a => a.TaskID == taskId)
                    .Select(a => new ActivityDTO
                    {
                        ActivityID = a.ActivityID,
                        TaskID = a.TaskID,
                        EmployeePK = a.EmployeePK,
                        StartDate = a.StartDate
                    })
                    .ToList();

                return Ok(activities);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





        //מקבלת שם משימה ומחחזירה את סהכ השעות שעבדו עליה
        //[HttpGet]
        //[Route("api/TaskWorkedHours/{taskName}")]
        //public IHttpActionResult GetTaskWorkedHours(string taskName)
        //{
        //    try
        //    {
        //        var task = db.Tasks
        //            .FirstOrDefault(t => t.TaskName == taskName);

        //        if (task == null)
        //            return NotFound();

        //        TimeSpan totalWorkHours = (TimeSpan)(task.Deadline - task.InsertTaskDate);

        //        var result = new
        //        {
        //            TotalWorkHours = totalWorkHours.TotalHours
        //        };

        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}


        //[HttpGet]
        //[Route("api/TaskWorkedHours/{taskName}")]
        //public IHttpActionResult GetTaskWorkedHours(string taskName)
        //{
        //    try
        //    {
        //        var tasks = db.Tasks
        //            .Where(t => t.TaskName.Contains(taskName))
        //            .ToList();

        //        if (tasks.Count == 0 || tasks == null)
        //            return NotFound();

        //        TimeSpan totalWorkHours = TimeSpan.Zero;

        //        foreach (var task in tasks)
        //        {
        //            totalWorkHours += task.Deadline - task.InsertTaskDate;
        //        }

        //        var result = new
        //        {
        //            TotalWorkHours = totalWorkHours.TotalHours
        //        };

        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}



        //מחזירה שעות לפי הסטרינג של משימה
        //[HttpGet]
        //[Route("api/TaskWorkedHour/{taskName}")]
        //public IHttpActionResult GetTaskWorkedHour(string taskName)
        //{
        //    try
        //    {
        //        var tasks = db.Tasks
        //            .Where(t => t.TaskName.Contains(taskName))
        //            .Select(t => t.TaskID)
        //            .ToList();

        //        var activities = db.Activity
        //            .Where(a => tasks.Contains(a.TaskID))
        //            .ToList();

        //        TimeSpan totalWorkHours = TimeSpan.Zero;

        //        foreach (var activity in activities)
        //        {
        //            totalWorkHours += activity.EndDate - activity.StartDate;
        //        }

        //        var result = new
        //        {
        //            TotalWorkHours = totalWorkHours.TotalHours
        //        };

        //        if (tasks == null || tasks.Count == 0)
        //            return NotFound();

        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}


        //מחזירה מערך בו מזהה משימה ולכל מזהה את סך השעות שעבדו על אותה משימה
        //[HttpGet]
        //[Route("api/TaskWorkedHour/{taskName}")]
        //public IHttpActionResult GetTaskWorkedHour(string taskName)
        //{
        //    try
        //    {
        //        var tasks = db.Tasks
        //            .Where(t => t.TaskName.Contains(taskName))
        //            .Select(t => t.TaskID)
        //            .ToList();

        //        var activities = db.Activity
        //            .Where(a => tasks.Contains(a.TaskID))
        //            .ToList();

        //        var taskWorkHours = new Dictionary<int, double>();

        //        foreach (var taskID in tasks)
        //        {
        //            var taskActivities = activities.Where(a => a.TaskID == taskID);
        //            TimeSpan totalWorkHours = TimeSpan.Zero;

        //            foreach (var activity in taskActivities)
        //            {
        //                totalWorkHours += activity.EndDate - activity.StartDate;
        //            }

        //            taskWorkHours[taskID] = totalWorkHours.TotalHours;
        //        }

        //        var result = new
        //        {
        //            TaskWorkHours = taskWorkHours
        //        };

        //        if (tasks == null || tasks.Count == 0)
        //            return NotFound();

        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}


        //תקבל סוג ושם משימה ותחזיר את סוג המשימה, הממצוע שעות שעבדו עליה ומזהה המשימה
        //[HttpGet]
        //[Route("api/TaskWorkedHour/{taskType}/{taskName}")]
        //public IHttpActionResult GetTaskWorkedHour(int taskType, string taskName)
        //{
        //    try
        //    {
        //        var tasks = db.Tasks
        //            .Where(t => t.TaskName.Contains(taskName) && t.TaskType == taskType)
        //            .Select(t => t.TaskID)
        //            .ToList();

        //        var activities = db.Activity
        //            .Where(a => tasks.Contains(a.TaskID))
        //            .ToList();

        //        var taskWorkHours = new Dictionary<int, double>();

        //        foreach (var taskID in tasks)
        //        {
        //            var taskActivities = activities.Where(a => a.TaskID == taskID);
        //            TimeSpan totalWorkHours = TimeSpan.Zero;

        //            foreach (var activity in taskActivities)
        //            {
        //                totalWorkHours += activity.EndDate - activity.StartDate;
        //            }

        //            taskWorkHours[taskID] = totalWorkHours.TotalHours;
        //        }

        //        var averageWorkHours = taskWorkHours.Values.Average();

        //        var result = new
        //        {
        //            TaskWorkHours = taskWorkHours,
        //            TaskType = taskType,
        //            AverageWorkHours = averageWorkHours


        //        };

        //        if (tasks == null || tasks.Count == 0)
        //            return NotFound();

        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}


        //תקבל סוג , שם משימה ושעות הצעת מחיר ותחזיר את סוג המשימה, הממצוע שעות שעבדו עליה, מזהה המשימה והאם סך השעות קטן או גדול
        [HttpGet]
        [Route("api/TaskWorkedHour/{taskType}/{taskName}/{pqHours}")]       
        public IHttpActionResult GetTaskWorkedHour(int taskType, string taskName, double pqHours)
        {
            try
            {
                var tasks = db.Tasks
                    .Where(t => t.TaskName.Contains(taskName) && t.TaskType == taskType)
                    .Select(t => t.TaskID)
                    .ToList();

                var activities = db.Activity
                    .Where(a => tasks.Contains(a.TaskID))
                    .ToList();

                var taskWorkHours = new Dictionary<int, double>();

                foreach (var taskID in tasks)
                {
                    var taskActivities = activities.Where(a => a.TaskID == taskID);
                    TimeSpan totalWorkHours = TimeSpan.Zero;

                    foreach (var activity in taskActivities)
                    {
                        totalWorkHours += activity.EndDate - activity.StartDate;
                    }

                    taskWorkHours[taskID] = totalWorkHours.TotalHours;
                }

                var averageWorkHours = taskWorkHours.Values.Average();
                var difference = pqHours - averageWorkHours;
                var isPQHoursBigger = pqHours > averageWorkHours;

                var result = new
                {
                    TaskWorkHours = taskWorkHours,
                    TaskType = taskType,
                    AverageWorkHours = averageWorkHours,
                    PQHours = pqHours,
                    Difference = difference,
                    IsPQHoursBigger = isPQHoursBigger
                };

                if (tasks == null || tasks.Count == 0)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




    }


}




