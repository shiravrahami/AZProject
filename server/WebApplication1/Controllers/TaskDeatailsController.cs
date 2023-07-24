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
using System.Net.Mail;
using System.Data.Entity.Validation;
using System.Data.Entity;

namespace WebApplication1.Controllers
{
    public class TaskDeatailsController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();
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

        //עדכון משימה כולל שם עובד 
        [HttpPut]
        [Route("api/TaskUpdate/{taskId}")]
        public IHttpActionResult UpdateTask(int taskId, [FromBody] TasksDTO updatedTask)
        {
            try
            {
                if (taskId <= 0)
                {
                    return BadRequest("Invalid TaskID");
                }

                var task = db.Tasks.FirstOrDefault(ts => ts.TaskID == taskId);

                if (task == null)
                {
                    return BadRequest("Task not found");
                }

                // עדכון פרטי המשימה
                task.TaskName = updatedTask.TaskName;
                task.ProjectID = updatedTask.ProjectID;
                task.TaskType = updatedTask.TaskType;
                task.TaskDescription = updatedTask.TaskDescription;
                task.InsertTaskDate = updatedTask.InsertTaskDate;
                task.Deadline = updatedTask.Deadline;
                task.isDone = updatedTask.isDone;
                task.isDeleted = updatedTask.isDeleted;
                task.PriceQuoteTime = (int)updatedTask.PriceQuoteTime;

                // עדכון שם העובד אם הוא קיים בבקשה
                if (!string.IsNullOrEmpty(updatedTask.EmployeeID))
                {
                    var employee = db.Employees.FirstOrDefault(e => e.ID == updatedTask.ID);
                    if (employee != null)
                    {
                        var taskEmployeeActivity = db.Task_Employee_Activity.FirstOrDefault(tea => tea.TaskID == taskId);
                        if (taskEmployeeActivity != null)
                        {
                            taskEmployeeActivity.EmployeePK = employee.ID;
                        }
                        else
                        {
                            taskEmployeeActivity = new Task_Employee_Activity { TaskID = taskId, EmployeePK = employee.ID };
                            db.Task_Employee_Activity.Add(taskEmployeeActivity);
                        }
                    }
                }

                db.SaveChanges();

                return Ok("Task details updated successfully");
            }
            catch (Exception)
            {
                return BadRequest("Failed to update task details");
            }
        }


        //מזהה עובד ולקוח
        [HttpPut]
        [Route("api/TaskUpdateID/{taskId}")]
        public IHttpActionResult UpdateTaskID(int taskId, [FromBody] TasksDTO updatedTask)
        {
            try
            {
                if (taskId <= 0)
                {
                    return BadRequest("Invalid TaskID");
                }

                var task = db.Tasks
                              .Include(t => t.Projects)
                              .Include(t => t.Projects.Customers)
                              .FirstOrDefault(ts => ts.TaskID == taskId);

                if (task == null)
                {
                    return BadRequest("Task not found");
                }

                // עדכון פרטי המשימה
                task.TaskName = updatedTask.TaskName;
                task.ProjectID = updatedTask.ProjectID;
                task.TaskType = updatedTask.TaskType;
                task.TaskDescription = updatedTask.TaskDescription;
                task.InsertTaskDate = updatedTask.InsertTaskDate;
                task.Deadline = updatedTask.Deadline;
                task.isDone = updatedTask.isDone;
                task.isDeleted = updatedTask.isDeleted;
                task.PriceQuoteTime = (int)updatedTask.PriceQuoteTime;

                // עדכון מזהה הלקוח אם הוא קיים בבקשה
                if (!string.IsNullOrEmpty(updatedTask.CustomerID))
                {
                    var customer = db.Customers.FirstOrDefault(c => c.CustomerID == updatedTask.CustomerID);
                    if (customer != null)
                    {
                        task.Projects.Customers = customer;
                    }
                    else
                    {
                        customer = new Customers { CustomerID = updatedTask.CustomerID };
                        task.Projects.Customers = customer;
                    }
                }

                // עדכון מזהה העובד אם הוא קיים בבקשה
                if (!string.IsNullOrEmpty(updatedTask.EmployeeID))
                {
                    var employee = db.Employees.FirstOrDefault(e => e.EmployeeID == updatedTask.EmployeeID);
                    if (employee != null)
                    {
                        var taskEmployeeActivity = db.Task_Employee_Activity.FirstOrDefault(tea => tea.TaskID == taskId);
                        if (taskEmployeeActivity != null)
                        {
                            taskEmployeeActivity.EmployeePK = employee.ID;
                        }
                        else
                        {
                            taskEmployeeActivity = new Task_Employee_Activity { TaskID = taskId, EmployeePK = employee.ID };
                            db.Task_Employee_Activity.Add(taskEmployeeActivity);
                        }
                    }
                }

                db.SaveChanges();

                return Ok("Task details updated successfully");
            }
            catch (Exception)
            {
                return BadRequest("Failed to update task details");
            }
        }



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

      


        //מתודת הכנסת משימה עם אובייקט פעילות ריק סופי ועובד!
        //new method after a talk with the chat 
        //InsertTask
        [HttpPost]
        [Route("api/AddTask/{employeeID}")]
        public IHttpActionResult AddTask([FromBody] TasksDTO task, int employeeID)
        {
            try
            {
                if (string.IsNullOrEmpty(task.TaskName) || task.ProjectID == 0 || string.IsNullOrEmpty(task.TaskDescription))
                {
                    return BadRequest("One or more parameters are missing or invalid");
                }

                // יצירת אובייקט משימה חדשה
                Tasks newTask = new Tasks
                {
                    TaskName = task.TaskName,
                    ProjectID = task.ProjectID,
                    TaskType = task.TaskType,
                    TaskDescription = task.TaskDescription,
                    InsertTaskDate = task.InsertTaskDate,
                    Deadline = task.Deadline,
                    isDone = task.isDone,
                    isDeleted = task.isDeleted,

                    // PriceQuoteTime = (int)task.PriceQuoteTime
                };

                // הוספת המשימה למסד הנתונים
                db.Tasks.Add(newTask);
                db.SaveChanges();

                Activity newActivity = new Activity()
                {
                    TaskID = newTask.TaskID,
                    EmployeePK = employeeID,
                    Description = "סיווג עובד למשימה",
                    StartDate = DateTime.Today,
                    EndDate = DateTime.Today
                };

                db.Activity.Add(newActivity);
                db.SaveChanges();

                var taskEmployeeActivity = new Task_Employee_Activity { TaskID = newTask.TaskID, EmployeePK = employeeID, ActivityID = newActivity.ActivityID };
                db.Task_Employee_Activity.Add(taskEmployeeActivity);
                db.SaveChanges();

                return Ok("Task added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error adding task: {ex.Message}");
            }
        }








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
                            CustomerID = x.Projects.Customers.CustomerID,

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
                                 select new TasksDTO
                                 {
                                     TaskID = t.TaskID,
                                     TaskName = t.TaskName,
                                     ProjectID = t.ProjectID,
                                     TaskType = t.TaskType,
                                     TaskDescription = t.TaskDescription,
                                     InsertTaskDate = t.InsertTaskDate,
                                     Deadline = (DateTime)t.Deadline,
                                     isDone = t.isDone,
                                     isDeleted = t.isDeleted,
                                     CustomerName = t.Projects.Customers.CustomerName,
                                     EmployeeName = e.EmployeeName,
                                     EmployeeEmail = e.EmployeeEmail, // Add the Employee Email
                                     EmployeeID = e.EmployeeID, // Add the Employee ID
                                     CustomerID = t.Projects.Customers.CustomerID,
                                     ID = e.ID
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
                        EmployeeName = x.EmployeeName,
                        CustomerID = x.CustomerID,
                        EmployeeEmail = x.EmployeeEmail,
                        EmployeeID = x.EmployeeID,
                        PriceQuoteTime = x.PriceQuoteTime,
                        ID = x.ID
                    }).ToList();

                    return Ok(TasksList);
                }
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }
        


        //מתודה שמביאה כמות משימות פתוחות לכל עובד 
        [HttpGet]
        [Route("api/ListTasksForAllEmployee")]
        public IHttpActionResult GetListTasksForAllEmployee()
        {
            try
            {
                var employeesOpenTasksCount = db.Employees
                    .Select(e => new NumberOfTaskDTO
                    {
                        EmployeeName = e.EmployeeName,
                        NumberOfOpenTasks = db.Tasks.Count(t => t.Task_Employee_Activity.Any(tea => tea.EmployeePK == e.ID) && !t.isDone && !t.isDeleted)
                    })
                    .ToList();

                return Ok(employeesOpenTasksCount);
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

                        TimeSpan? timeDifference = activity.EndDate - activity.StartDate;
                        totalWorkHours += timeDifference ?? TimeSpan.Zero;
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


        


        //ברגע שנוצרת משימה חדשה יישלח מייל לעובד שיבצע אותה
        //שם , מייל, מזהה
        [HttpPost]
        [Route("api/InsertTaskMailToEmployee")]
        public IHttpActionResult InsertTaskMailToEmployee([FromBody] TasksDTO task)
        {
            try
            {
                if (string.IsNullOrEmpty(task.TaskName?.ToString()) ||
                    string.IsNullOrEmpty(task.TaskDescription?.ToString()) ||
                    task.ProjectID == 0 ||
                    string.IsNullOrEmpty(task.EmployeeName?.ToString()) ||
                    string.IsNullOrEmpty(task.EmployeeEmail?.ToString()))
                {
                    return BadRequest("One or more parameters are missing or invalid");
                }

                Tasks Task = new Tasks()
                {
                    TaskName = task.TaskName,
                    ProjectID = task.ProjectID,
                    TaskType = task.TaskType,
                    TaskDescription = task.TaskDescription,
                    InsertTaskDate = task.InsertTaskDate,
                    Deadline = task.Deadline,
                    EmployeeName = task.EmployeeName,
                    EmployeeEmail = task.EmployeeEmail
                };

                db.Tasks.Add(Task);
                db.SaveChanges();

                string subject = "משימה חדשה התקבלה";
                string body = $"שלום {task.EmployeeName},\nהתקבלה משימה חדשה!\nלהלן פרטי המשימה:\nשם משימה: {task.TaskName}\nסוג משימה: {task.TaskType}\nתיאור משימה: {task.TaskDescription}\nתאריך קבלת משימה: {task.InsertTaskDate}\nתאריך סיום משימה: {task.Deadline}\n בהצלחה!";

                SendEmail(task.EmployeeEmail, subject, body);

                return Ok("Task details saved successfully and email sent successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving Task details: {ex.Message}");
            }
        }

        private void SendEmail(string toMail, string subjects, string bodys)
        {
            Console.WriteLine($"Sending an email: {toMail}\nSubject: {subjects}\nBody: {bodys}");

            MailMessage message = new MailMessage();
            message.From = new MailAddress("remotlat@outlook.com");
            message.To.Add(toMail);
            message.Subject = subjects;
            message.Body = bodys;

            SmtpClient smtpClient = new SmtpClient("smtp.office365.com", 587);
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential("remotlat@outlook.com", "1223OutlookWork");
            smtpClient.EnableSsl = true;

            smtpClient.Send(message);
        }



        



    }


}







