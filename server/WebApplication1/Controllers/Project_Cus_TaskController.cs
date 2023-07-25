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







}







