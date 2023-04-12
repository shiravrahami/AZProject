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
using System.Runtime.CompilerServices;


namespace WebApplication1.Controllers
{
    public class ListProjectsController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/ListProjects/{employeeID}")]
        public IHttpActionResult Get(int employeeID)
        {
            try
            {
                if (employeeID == 6)
                {
                    var projects = db.Projects.ToList();
                    if (projects == null || projects.Count == 0)
                    {
                        return NotFound();
                    }
                    var projList = db.Projects.Where(x => !x.isDeleted).Select(x => new ProjectsDTO
                    {
                        ProjectID = x.ProjectID,
                        ProjectName = x.ProjectName,
                        CustomerPK = x.CustomerPK,
                        Description = x.Description,
                        InsertDate = x.InsertDate,
                        Deadline = (DateTime)(x.Deadline),
                        isDone = x.isDone,
                        isDeleted = x.isDeleted
                    }).ToList();

                    return Ok(projList);
                }
                else
                {
                    var projects = (from p in db.Projects join 
                                 t in db.Tasks on p.ProjectID equals t.ProjectID
                                 join tea in db.Task_Employee_Activity on t.TaskID equals tea.TaskID
                                 where tea.EmployeePK == employeeID
                                 && !t.isDeleted
                                 select new
                                 {
                                     p.ProjectID,
                                     p.ProjectName,
                                     p.CustomerPK,
                                     p.Description,
                                     p.InsertDate,
                                     p.Deadline,
                                     p.isDone, 
                                     p.isDeleted 
                                 }).ToList();
                    return Ok(projects);    
                }
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("api/ListProjects/{id}")]
        public IHttpActionResult Put(int id)
        {
            var project = db.Projects.FirstOrDefault(c => c.ProjectID == id);
            if (project == null)
            {
                return NotFound();
            }
            project.isDeleted = true;
            db.SaveChanges();
            return Ok("The project has been deleted!");
        }

    }
}
