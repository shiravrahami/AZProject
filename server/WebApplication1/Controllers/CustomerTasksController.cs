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
    //לבדוק בפוסטמן
    // שם לקוח, המשימות הפתוחות  שלו וסך כל המשימות שלו 

    public class CustomerTasksController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/CustomersTaskSummary")]
        public IHttpActionResult GetAllCustomersTaskSummary()
        {
            try
            {
                List<Customers> c = db.Customers.ToList();
                List<Tasks> t = db.Tasks.Where(x => x.isDone == false).ToList();
                List<Tasks> tAll = db.Tasks.ToList();
                List<Projects> p = db.Projects.ToList();
                List<CustomerTasksDTO> newList = new List<CustomerTasksDTO>();
                CustomerTasksDTO newC = new CustomerTasksDTO();  
                
                foreach (var item0 in p)
                {
                    foreach (var item1 in c)
                    {
                        foreach (var item2 in tAll)
                        {
                            foreach (var item3 in t)
                            {
                                if (item1.ID == item0.CustomerPK)
                                {
                                    if (item2.ProjectID==item0.ProjectID)
                                    {
                                        newC = new CustomerTasksDTO
                                        {
                                            CustomerName = item1.CustomerName,
                                            //OpenTaskname = item3.TaskName,
                                            TotalopenCount = item3.TaskName.Count(),
                                            CountTasks = item2.TaskName.Count(),
                                        };
                                        newList.Add(newC);
                                    }
                                }

                            }
                        }
                    }
                }

                return Ok(newList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}




