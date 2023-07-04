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
        igroup195_DB_Prod db = new igroup195_DB_Prod();

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

        //מחזירה רשימה של כל הפרויקטים(מזהה ושם)ולכל פרויקט את המשימות שלו (מזהה ושם) חדש
        [HttpGet]
        [Route("api/ProjectsAndTasks")]
        public IHttpActionResult GetProjectsAndTasks()
        {
            var projects = db.Projects
                .Where(p => !p.isDeleted)
                .Select(p => new
                {
                    ProjectID = p.ProjectID,
                    ProjectName = p.ProjectName,
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
       

    }
}



