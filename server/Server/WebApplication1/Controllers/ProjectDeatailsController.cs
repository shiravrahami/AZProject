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

namespace WebApplication1.Controllers
{
    public class ProjectDeatailsController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/ProjectDeatails/{id}")]
        public IHttpActionResult GetProject(int id)
        {
            try
            {

                var project = db.Projects
                    .Where(p => p.ProjectID == id)
                    .Select(p => new ProjectsDTO
                    {
                        ProjectID = p.ProjectID,
                        ProjectName = p.ProjectName,
                        CustomerPK = p.CustomerPK,
                        Description = p.Description,
                        InsertDate = p.InsertDate,
                        Deadline = (DateTime)(p.Deadline),
                        isDone = p.isDone
                    })
                    .FirstOrDefault();

                return Ok(project);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
