using System;
using System.Collections.Generic;
using System.Web.Http;
using WebApplication1.DTO;
using SignIn;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace WebApplication1.Controllers
{
    //תקין בפוסטמן
    //הפונקציה מקבלת מזהה של לקוח ומחזירה את כל הפרויקטים המקושרים לו ולמשימות של אותו פרויקט
    //public class Project_Cus_TaskController : ApiController
    //{
    //    igroup195_DB_Prod db = new igroup195_DB_Prod();

    //    [HttpGet]
    //    [Route("api/Project_Cus_Task/GetProjectsAndTasks/{customerId}")]
    //    public IHttpActionResult GetProjectsAndTasks(int customerId)
    //    {
    //        try
    //        {
    //            var projectsAndTasks = db.Projects
    //                .Where(p => p.CustomerPK == customerId && !p.isDeleted)
    //                .Select(p => new ProjectsDTO
    //                {
    //                    ProjectID = p.ProjectID,
    //                    ProjectName = p.ProjectName,
    //                    CustomerPK = p.CustomerPK,
    //                    Description = p.Description,
    //                    InsertDate = p.InsertDate,
    //                    Deadline = (DateTime)p.Deadline,
    //                    isDone = p.isDone,
    //                    isDeleted = p.isDeleted,
    //                    Tasks = p.Tasks
    //                        .Where(t => !t.isDeleted)
    //                        .Select(t => new TasksDTO
    //                        {
    //                            TaskID = t.TaskID,
    //                            TaskName = t.TaskName,
    //                            ProjectID = t.ProjectID,
    //                            TaskType = t.TaskType,
    //                            TaskDescription = t.TaskDescription,
    //                            InsertTaskDate = t.InsertTaskDate,
    //                            Deadline = (DateTime)t.Deadline,
    //                            isDone = t.isDone,
    //                            isDeleted = t.isDeleted
    //                        })
    //                        .ToList()
    //                })
    //                .ToList();

    //            return Ok(projectsAndTasks);
    //        }
    //        catch (Exception ex)
    //        {
    //            return BadRequest(ex.Message);
    //        }
    //    }



    //שם פרויקט וכל המשימות שלו
    //public class Project_Cus_TaskController : ApiController
    //{
    //    igroup195_DB_Prod db = new igroup195_DB_Prod();

    //    [HttpGet]
    //    [Route("api/Project_Cus_Task/GetProjectsAndTasks/{customerId}")]
    //    public IHttpActionResult GetProjectsAndTasks(int customerId)
    //    {
    //        try
    //        {
    //            var projectsAndTasks = db.Projects
    //                .Where(p => p.CustomerPK == customerId && !p.isDeleted)
    //                .Select(p => new ProjectsDTO
    //                {
    //                    ProjectID = p.ProjectID,
    //                    ProjectName = p.ProjectName,
    //                    CustomerPK = p.CustomerPK,
    //                    Description = p.Description,
    //                    InsertDate = p.InsertDate,
    //                    Deadline = (DateTime)p.Deadline,
    //                    isDone = p.isDone,
    //                    isDeleted = p.isDeleted,
    //                    Tasks = p.Tasks
    //                        .Where(t => !t.isDeleted)
    //                        .Select(t => new TasksDTO
    //                        {
    //                            TaskID = t.TaskID,
    //                            TaskName = t.TaskName,
    //                            ProjectID = t.ProjectID,
    //                            TaskType = t.TaskType,
    //                            TaskDescription = t.TaskDescription,
    //                            InsertTaskDate = t.InsertTaskDate,
    //                            Deadline = (DateTime)t.Deadline,
    //                            isDone = t.isDone,
    //                            isDeleted = t.isDeleted
    //                        })
    //                        .ToList()
    //                })
    //                .ToList();

    //            // Flatten the result to include each task as a separate object
    //            var result = projectsAndTasks.SelectMany(p => p.Tasks.Select(t => new
    //            {
    //                p.ProjectName,
    //                t.TaskID,
    //                t.TaskName,
    //                t.ProjectID,
    //                t.TaskType,
    //                t.TaskDescription,
    //                t.InsertTaskDate,
    //                t.Deadline,
    //                t.isDone,
    //                t.isDeleted
    //            }));

    //            return Ok(result);
    //        }
    //        catch (Exception ex)
    //        {
    //            return BadRequest(ex.Message);
    //        }
    //    }


    //}


    //הקוד מביא ללקוח את הפרויקטים שלו, לכל פרוייקט את המשימות שלו. במידה ויש לפרויקט מספר משימות הן מוצגות באותו אובייקט תחת שם הפרויקט, לא מוצג כל פרטי המשימה
    public class Project_Cus_TaskController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();

        [HttpGet]
        [Route("api/Project_Cus_Task/GetProjectsAndTasks/{customerId}")]
        public IHttpActionResult GetProjectsAndTasks(int customerId)
        {
            try
            {
                var projectsAndTasks = db.Projects
                    .Where(p => p.CustomerPK == customerId && !p.isDeleted)
                    .Select(p => new
                    {
                        ProjectName = p.ProjectName,
                        Tasks = p.Tasks
                            .Where(t => !t.isDeleted)
                            .Select(t => new
                            {
                                t.TaskID,
                                t.TaskName,
                                Deadline = (DateTime)t.Deadline
                            })
                            .ToList()
                    })
                    .ToList();

                var result = projectsAndTasks
                    .GroupBy(p => p.ProjectName)
                    .Select(g => new
                    {
                        ProjectName = g.Key,
                        Tasks = g.SelectMany(p => p.Tasks)
                            .ToList()
                    })
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }







    //הקוד מביא ללקוח את הפרויקטים שלו, לכל פרוייקט את המשימות שלו. במידה ויש לפרויקט מספר משימות הן מוצגות באותו אובייקט תחת שם הפרויקט, כל פרטי המשימות מוצגות
    //public class Project_Cus_TaskController : ApiController
    //{
    //    igroup195_DB_Prod db = new igroup195_DB_Prod();

    //    [HttpGet]
    //    [Route("api/Project_Cus_Task/GetProjectsAndTasks/{customerId}")]
    //    public IHttpActionResult GetProjectsAndTasks(int customerId)
    //    {
    //        try
    //        {
    //            var projectsAndTasks = db.Projects
    //                .Where(p => p.CustomerPK == customerId && !p.isDeleted)
    //                .Select(p => new
    //                {
    //                    ProjectName = p.ProjectName,
    //                    Tasks = p.Tasks
    //                        .Where(t => !t.isDeleted)
    //                        .Select(t => new TasksDTO
    //                        {
    //                            TaskID = t.TaskID,
    //                            TaskName = t.TaskName,
    //                            ProjectID = t.ProjectID,
    //                            TaskType = t.TaskType,
    //                            TaskDescription = t.TaskDescription,
    //                            InsertTaskDate = t.InsertTaskDate,
    //                            Deadline = (DateTime)t.Deadline,
    //                            isDone = t.isDone,
    //                            isDeleted = t.isDeleted
    //                        })
    //                        .ToList()
    //                })
    //                .ToList();

    //            var result = projectsAndTasks
    //                .GroupBy(p => p.ProjectName)
    //                .Select(g => new
    //                {
    //                    ProjectName = g.Key,
    //                    Tasks = g.SelectMany(p => p.Tasks)
    //                        .ToList()
    //                })
    //                .ToList();

    //            return Ok(result);
    //        }
    //        catch (Exception ex)
    //        {
    //            return BadRequest(ex.Message);
    //        }

    //    }



    //}
}







