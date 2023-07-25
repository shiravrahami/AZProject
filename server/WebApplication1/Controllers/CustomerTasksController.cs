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
    //עובד בפוסטמן
    // שם לקוח, המשימות הפתוחות  שלו וסך כל המשימות שלו 

    public class CustomerTasksController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();
        [HttpGet]
        [Route("api/CustomerTasks/GetCustomerTasks")]
        public IHttpActionResult GetCustomerTasks()
        {
            try
            {
                var customerTasks = db.Customers
                    .Where(c => !c.isDeleted)
                    .Select(c => new CustomerTasksDTO
                    {
                        CustomerPK = c.ID,
                        CustomerName = c.CustomerName,
                        TotalopenCount = db.Tasks
                            .Count(t => t.Projects.CustomerPK == c.ID && t.isDone == false && t.isDeleted == false),
                        CountTasks = db.Tasks
                            .Count(t => t.Projects.CustomerPK == c.ID && t.isDeleted == false)
                    })
                    .ToList();

                return Ok(customerTasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //המתודה עם התנאי שאין משימות פתוחות ששוות ל0
        [HttpGet]
        [Route("api/CustomerTasks/GetCustomerTasksSummary")]
        public IHttpActionResult GetCustomerTasksSummary()
        {
            try
            {
                var customerTasks = db.Customers
                    .Where(c => !c.isDeleted && db.Tasks.Count(t => t.Projects.CustomerPK == c.ID && t.isDone == false && t.isDeleted == false) != 0)
                    .Select(c => new CustomerTasksDTO
                    {
                        CustomerPK = c.ID,
                        CustomerName = c.CustomerName,
                        TotalopenCount = db.Tasks
                            .Count(t => t.Projects.CustomerPK == c.ID && t.isDone == false && t.isDeleted == false),
                        CountTasks = db.Tasks
                            .Count(t => t.Projects.CustomerPK == c.ID && t.isDeleted == false)
                    })
                    .ToList();

                return Ok(customerTasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }



}


























































