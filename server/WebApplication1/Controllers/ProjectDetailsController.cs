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
    public class ProjectDetailsController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();

        

        //אותה אחת כמו למעלה חדשה
        [HttpGet]
        [Route("api/ProjectDetails/{id}")]
        public IHttpActionResult GetProject(int id)
        {
            try
            {
                // מציאת הפרויקט לפי ה-ID שנשלח בבקשה
                var project = db.Projects.FirstOrDefault(p => p.ProjectID == id);

                if (project == null)
                    return NotFound(); // אם הפרויקט לא קיים, מחזירים תשובת 404

                // מציאת שם הלקוח של הפרויקט
                var customerName = db.Customers.FirstOrDefault(c => c.ID == project.CustomerPK)?.CustomerName;

                // מציאת כמות השעות הכוללת מטבלת PriceQuotes
                //var totalWorkHours = db.PriceQuotes.Where(pq => pq.ProjectID == id).Sum(pq => pq.TotalWorkHours);
                //לחבר עם יינר לטבלת פרויקטים

                // יצירת אובייקט של פרטי הפרויקט כולל שם הלקוח וכמות השעות הכוללת
                var projectDetails = new
                {
                    InsertDate = project.InsertDate,
                    Deadline = (DateTime)project.Deadline,
                    Description = project.Description,
                    CustomerName = customerName,
                    PriceQuoteID= project.PriceQuoteID
                    //TotalWorkHours = totalWorkHours
                };

                return Ok(projectDetails);
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
                //project.ProjectName = updatedProject.ProjectName;
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

        //קוד חדש שלא מציג פרויקט שהתאריך שלו קטן מהיום
        [HttpGet]
        [Route("api/ListProjectsNextDay/{employeeID}")]
        public IHttpActionResult GetListProjectsNextDay(int employeeID)
        {
            try
            {
                DateTime today = DateTime.Now.Date;

                var projects = db.Projects
                    .Where(x => !x.isDeleted && x.Deadline >= today)
                    .Select(x => new ProjectsDTO
                    {
                        ProjectID = x.ProjectID,
                        ProjectName = x.ProjectName,
                        CustomerPK = x.CustomerPK,
                        Description = x.Description,
                        InsertDate = x.InsertDate,
                        Deadline = (DateTime)x.Deadline,
                        isDone = x.isDone,
                        isDeleted = x.isDeleted
                    })
                    .ToList();

                if (projects == null || projects.Count == 0)
                {
                    return NotFound();
                }

                return Ok(projects);
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }




        //כולל הוספת מיון
        //ListProjects
        [HttpGet]
        [Route("api/ListProjects")]
        public IHttpActionResult GetListProjects()
        {
            try
            {
                var projects = db.Projects.ToList();
                if (projects == null || projects.Count == 0)
                {
                    return NotFound();
                }

                var projList = db.Projects
                    .Where(x => !x.isDeleted)
                    .OrderByDescending(x => x.InsertDate) // מיון לפי תאריך יורד
                    .Select(x => new ProjectsDTO
                    {
                        ProjectID = x.ProjectID,
                        ProjectName = x.ProjectName,
                        CustomerPK = x.CustomerPK,
                        Description = x.Description,
                        InsertDate = x.InsertDate,
                        Deadline = (DateTime)(x.Deadline),
                        isDone = x.isDone,
                        isDeleted = x.isDeleted
                    })
                    .ToList();

                return Ok(projList);
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }


        //שכפול
        [HttpGet]
        [Route("api/ListProjectsNameDesc")]
        public IHttpActionResult GetListProjectsNameDesc()
        {
            try
            {
                var projects = db.Projects.ToList();
                if (projects == null || projects.Count == 0)
                {
                    return NotFound();
                }

                var projList = db.Projects
                    .Where(x => !x.isDeleted)
                    .OrderByDescending(x => x.ProjectName) // מיון לפי תאריך יורד
                    .Select(x => new ProjectsDTO
                    {
                        ProjectID = x.ProjectID,
                        ProjectName = x.ProjectName,
                        CustomerPK = x.CustomerPK,
                        Description = x.Description,
                        InsertDate = x.InsertDate,
                        Deadline = (DateTime)(x.Deadline),
                        isDone = x.isDone,
                        isDeleted = x.isDeleted
                    })
                    .ToList();

                return Ok(projList);
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }




        //ListProjects/{id}
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("api/ListProjects/{id}")]
        public IHttpActionResult PutListProjects(int id)
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


        //חדשה של אסתר
        [HttpGet]
        [Route("api/Projects/Tasks/{projectID}")]
        public IHttpActionResult GetTasksByProject(int projectID)
        {
            try
            {
                var project = db.Projects.FirstOrDefault(p => p.ProjectID == projectID);
                if (project == null)
                {
                    return NotFound();
                }

                var tasks = db.Tasks
                    .Where(t => t.ProjectID == projectID)
                    .Select(t => new ProjectTaskActivity
                    {
                        TaskName = t.TaskName,
                        TaskID = t.TaskID,
                        EndDate =(DateTime) t.Activity.Select(a => a.EndDate).FirstOrDefault(),
                        StartDate= t.Activity.Select (b=> b.StartDate).FirstOrDefault()
                    })
                    .ToList();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

      

    }
}




