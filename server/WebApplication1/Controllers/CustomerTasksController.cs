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
        igroup195_DB_Prod db = new igroup195_DB_Prod();
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










//public class CustomerTasksController : ApiController
//{
//    igroup195_DB_Prod db = new igroup195_DB_Prod();
//    [HttpGet]
//    [Route("api/CustomerTasks/GetCustomerTasks")]
//    public IHttpActionResult GetCustomerTasks()
//    {
//        try
//        {
//            var customerTasks = db.Customers
//                .Where(c => !c.isDeleted)
//                .Select(c => new CustomerTasksDTO
//                {
//                    CustomerID = c.CustomerID,
//                    CustomerName = c.CustomerName,
//                    TotalopenCount = db.Tasks
//                        .Count(t => t.Projects.CustomerPK == c.ID && t.isDone == false && t.isDeleted == false),
//                    CountTasks = db.Tasks
//                        .Count(t => t.Projects.CustomerPK == c.ID && t.isDeleted == false)
//                })
//                .ToList();

//            return Ok(customerTasks);
//        }
//        catch (Exception ex)
//        {
//            return BadRequest(ex.Message);
//        }
//    }

//}



//public class CustomerTasksController : ApiController
//{
//    igroup195_DB_Prod db = new igroup195_DB_Prod();

//    [HttpGet]
//    [Route("api/CustomersTaskSummary")]
//    public IHttpActionResult GetAllCustomersTaskSummary()
//    {
//        try
//        {
//            List<Customers> c = db.Customers.ToList();
//            List<Tasks> t = db.Tasks.Where(x => x.isDone == false).ToList();
//            List<Tasks> tAll = db.Tasks.ToList();
//            List<Projects> p = db.Projects.ToList();
//            List<CustomerTasksDTO> newList = new List<CustomerTasksDTO>();
//            CustomerTasksDTO newC = new CustomerTasksDTO();

//            foreach (var customer in c)
//            {
//                int totalTasksCount = 0;
//                int totalOpenTasksCount = 0;

//                foreach (var task in tAll)
//                {
//                    if (task.CustomerID == customer.ID)
//                    {
//                        totalTasksCount++;
//                        if (task.isDone == true)
//                        {
//                            task.isDone = false;
//                            db.Entry(task).State = EntityState.Modified;
//                            db.SaveChanges();
//                        }
//                    }
//                }

//                foreach (var openTask in t)
//                {
//                    if (openTask.CustomerID.ToString() == customer.CustomerID)
//                    {
//                        totalOpenTasksCount++;
//                    }
//                }

//                newC = new CustomerTasksDTO
//                {
//                    CustomerID = customer.CustomerID,
//                    CustomerName = customer.CustomerName,
//                    TotalopenCount = totalOpenTasksCount,
//                    CountTasks = totalTasksCount,
//                };
//                newList.Add(newC);
//            }

//            return Ok(newList);
//        }
//        catch (Exception ex)
//        {
//            return BadRequest(ex.Message);
//        }
//    }
//}

















//public class CustomerTasksController : ApiController
//{
//    igroup195_DB_Prod db = new igroup195_DB_Prod();

//    [HttpGet]
//    [Route("api/CustomersTaskSummary")]
//    public IHttpActionResult GetAllCustomersTaskSummary()
//    {
//        try
//        {
//            List<Customers> c = db.Customers.ToList();
//            List<Tasks> t = db.Tasks.Where(x => x.isDone == false).ToList();
//            List<Tasks> tAll = db.Tasks.ToList();
//            List<Projects> p = db.Projects.ToList();
//            List<CustomerTasksDTO> newList = new List<CustomerTasksDTO>();
//            CustomerTasksDTO newC = new CustomerTasksDTO();

//            foreach (var item1 in c)
//            {
//                int totalTasksCount = 0;
//                int totalOpenTasksCount = 0;
//                foreach (var item2 in tAll)
//                {
//                    if (item2.CustomerID == item1.ID)
//                    {
//                        totalTasksCount++;
//                    }
//                }
//                foreach (var item3 in t)
//                {
//                    if (item3.CustomerID == item1.ID)
//                    {
//                        totalOpenTasksCount++;
//                    }
//                }

//                newC = new CustomerTasksDTO
//                {
//                    CustomerName = item1.CustomerName,
//                    TotalopenCount = totalOpenTasksCount,
//                    CountTasks = totalTasksCount,
//                };
//                newList.Add(newC);
//            }

//            return Ok(newList);
//        }
//        catch (Exception ex)
//        {
//            return BadRequest(ex.Message);
//        }
//    }

//}





//public class CustomerTasksController : ApiController
//{
//    igroup195_DB_Prod db = new igroup195_DB_Prod();

//    [HttpGet]
//    [Route("api/CustomersTaskSummary")]
//    public IHttpActionResult GetAllCustomersTaskSummary()
//    {
//        try
//        {
//            List<Customers> c = db.Customers.ToList();
//            List<Tasks> t = db.Tasks.Where(x => x.isDone == false).ToList();
//            List<Tasks> tAll = db.Tasks.ToList();
//            List<Projects> p = db.Projects.ToList();
//            List<CustomerTasksDTO> newList = new List<CustomerTasksDTO>();
//            CustomerTasksDTO newC = new CustomerTasksDTO();

//            foreach (var item0 in p)
//            {
//                foreach (var item1 in c)
//                {
//                    foreach (var item2 in tAll)
//                    {
//                        foreach (var item3 in t)
//                        {
//                            if (item1.ID == item0.CustomerPK)
//                            {
//                                if (item2.ProjectID == item0.ProjectID)
//                                {
//                                    newC = new CustomerTasksDTO
//                                    {
//                                        CustomerName = item1.CustomerName,
//                                        TotalopenCount = item3.TaskName.Count(),
//                                        CountTasks = item2.TaskName.Count(),
//                                    };
//                                    newList.Add(newC);
//                                }
//                            }

//                        }
//                    }
//                }
//            }

//            return Ok(newList);
//        }
//        catch (Exception ex)
//        {
//            return BadRequest(ex.Message);
//        }
//    }
//}


































