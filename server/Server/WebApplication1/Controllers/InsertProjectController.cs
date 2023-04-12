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
    public class InsertProjectController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPost]
        [Route("api/InsertProject")]
        public IHttpActionResult InsertProject([FromBody] ProjectsDTO proj)
        {
            try 
            {
                if (string.IsNullOrEmpty(proj.ProjectName?.ToString()) ||
                    proj.CustomerPK==0)
                {
                    return BadRequest("One or more parameters are missing or projty");
                }
                Projects project = new Projects() 
                {
                    ProjectName = proj.ProjectName,
                    CustomerPK = proj.CustomerPK,
                    Description = proj.Description,
                    InsertDate = proj.InsertDate,
                    Deadline = proj.Deadline,
                };

                db.Projects.Add(project);
                db.SaveChanges();

                return Ok("Project details saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving Project details: {ex.Message}");
            }
        }
    }
}

    
