using System.Web.Http;
using WebApplication1.DTO;
using SignIn;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Data.Entity;

namespace WebApplication1.Controllers
{
    //מחזירה רשימה של כל הפרויקטים (רק את המזהה שלהם)ולכל פרויקט את המשימות שלו ( מזהה ושם ומשימה)
    public class TsaksInProjectController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();

        [HttpGet]
        [Route("api/InProjects")]
        public IHttpActionResult GetProjects()
        {
            var projects = db.Projects
                .Where(p => !p.isDeleted)
                .Select(p => new
                {
                    ProjectID = p.ProjectID,
                    Tasks = p.Tasks
                        .Where(t => !t.isDeleted)
                        .OrderBy(t => t.Deadline)
                        .Select(t => new
                        {
                            TaskID = t.TaskID,
                            TaskName = t.TaskName,
                        }).ToList()
                }).ToList();

            return Ok(projects);
        }




        //לפי מזהה הלקוח נביא את רשימת הפרויקטים של אותו לקוח ולכל פרויקט את המשימות שלו

        [HttpGet]
            [Route("api/Projects/{customerId}")]
            public IHttpActionResult GetProjects(int customerId)
            {
                var projects = db.Projects
                    .Where(p => p.CustomerPK == customerId && !p.isDeleted)
                    .Select(p => new
                    {
                        ProjectID = p.ProjectID,
                        Tasks = p.Tasks
                            .Where(t => !t.isDeleted)
                            .OrderBy(t => t.Deadline)
                            .Select(t => new
                            {
                                TaskID = t.TaskID,
                                TaskName = t.TaskName,
                                
                            }).ToList()
                    }).ToList();

                return Ok(projects);
            }






        //סופי עם כל הפרטים

        [HttpGet]
        [Route("api/ProjectsAndTasks")]
        public IHttpActionResult GetProjectsAndTasks()
        {
            try
            {
                var projectsAndTasks = db.Projects
                    .Where(p => !p.isDeleted)
                    .Select(p => new
                    {
                        ProjectID = p.ProjectID,
                        ProjectName = p.ProjectName,
                        CustomerPK = p.CustomerPK,
                        isDone = p.isDone,
                        InsertDate = p.InsertDate,
                        Description = p.Description,
                        Deadline = (DateTime)(p.Deadline),
                        Tasks = p.Tasks
                            .Where(t => !t.isDeleted)
                            .OrderBy(t => t.InsertTaskDate)
                            .Select(t => new
                            {
                                t.TaskID,
                                TaskName = t.TaskName,
                                ProjectID = t.ProjectID,
                                TaskType = t.TaskType,
                                TaskDescription = t.TaskDescription,
                                InsertTaskDate = t.InsertTaskDate,
                                Deadline = (DateTime)(t.Deadline),
                                isDone = t.isDone,
                                isDeleted = t.isDeleted,
                                EmployeeName = t.Task_Employee_Activity
                                    .Where(tea => tea.TaskID == t.TaskID)
                                    .Select(tea => tea.Employees.EmployeeName)
                                    .FirstOrDefault()
                            }).ToList()
                    }).ToList();

                return Ok(projectsAndTasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //חדשהמזהה עובד
        [HttpGet]
        [Route("api/ProjectsAndTasks/{employeeID}")]
        public IHttpActionResult GetProjectsAndTasks(int employeeID)
        {
            try
            {
                var projectsAndTasks = db.Projects
                    .Where(p => !p.isDeleted)
                    .Select(p => new
                    {
                        ProjectID = p.ProjectID,
                        ProjectName = p.ProjectName,
                        CustomerPK = p.CustomerPK,
                        isDone = p.isDone,
                        InsertDate = p.InsertDate,
                        Description = p.Description,
                        Deadline = (DateTime)(p.Deadline),
                        Tasks = p.Tasks
                            .Where(t => !t.isDeleted && t.Task_Employee_Activity.Any(tea => tea.EmployeePK == employeeID))
                            .OrderBy(t => t.InsertTaskDate)
                            .Select(t => new
                            {
                                t.TaskID,
                                TaskName = t.TaskName,
                                ProjectID = t.ProjectID,
                                TaskType = t.TaskType,
                                TaskDescription = t.TaskDescription,
                                InsertTaskDate = t.InsertTaskDate,
                                Deadline = (DateTime)(t.Deadline),
                                isDone = t.isDone,
                                isDeleted = t.isDeleted,
                                EmployeeName = t.Task_Employee_Activity
                                    .Where(tea => tea.TaskID == t.TaskID && tea.EmployeePK == employeeID)
                                    .Select(tea => tea.Employees.EmployeeName)
                                    .FirstOrDefault()
                            }).ToList()
                    }).ToList();

                return Ok(projectsAndTasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }


}




