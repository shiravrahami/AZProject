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
         
        //פרטי פרויקט
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

        //עדכון פרויקט קוד חדש
        [HttpPut]
        [Route("api/ProjectUpdate/{projectId}")]
        public IHttpActionResult UpdateProject(int projectId, [FromBody] ProjectsDTO updatedProject)
        {
            try
            {
                // מציאת הפרויקט לפי מזהה הפרויקט שהתקבל
                var project = db.Projects.FirstOrDefault(pro => pro.ProjectID == projectId);

                // בדיקה אם הפרויקט נמצא
                if (project == null)
                {
                    return BadRequest("Project not found");
                }

                // עדכון פרטי הפרויקט עם הפרטים המעודכנים שהתקבלו
                project.ProjectName = updatedProject.ProjectName;
                project.Description = updatedProject.Description;
                project.Deadline = updatedProject.Deadline;
                project.isDone = updatedProject.isDone;

                // שמירת השינויים בבסיס הנתונים
                db.SaveChanges();

                return Ok("Project details updated successfully");
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }







        //עדכון פרויקט קוד ישן
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
                project.Description = updatedProject.Description;
                project.Deadline = updatedProject.Deadline;
                project.isDone = updatedProject.isDone;

                db.SaveChanges();

                return Ok("good");
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        //InsertProject
        [HttpPost]
        [Route("api/InsertProject")]
        public IHttpActionResult InsertProject([FromBody] ProjectsDTO proj)
        {
            try
            {
                if (string.IsNullOrEmpty(proj.ProjectName?.ToString()) ||
                    proj.CustomerPK == 0)
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

        //ListProjects/{employeeID}
        [HttpGet]
        [Route("api/ListProjects/{employeeID}")]
        public IHttpActionResult GetListProjects (int employeeID)
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
                    var projects = (from p in db.Projects
                                    join
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

        //ListProjects/{id}
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("api/ListProjects/{id}")]
        public IHttpActionResult PutListProjects (int id)
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




