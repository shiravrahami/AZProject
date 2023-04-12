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
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    public class ProjectUpdateController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        // PUT api/projects
        [HttpPut]
        [Route("api/ProjectUpdate")]
        public IHttpActionResult UpdateProject([FromBody] ProjectsDTO updatedProject)
        {
            try
            {
                var project = db.Projects.Find(updatedProject.ProjectID);
                if (project == null)
                {
                    return NotFound();
                }
                project.ProjectName = updatedProject.ProjectName;
                project.Description= updatedProject.Description;
                project.Deadline= updatedProject.Deadline;
                project.isDone= updatedProject.isDone;

                db.SaveChanges();

                return Ok("good");
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

    }
}