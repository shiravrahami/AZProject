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
    public class CustomerDetailsController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpGet]
        [Route("api/CustomerDetails/{id}")]

        public IHttpActionResult GetCustomerDetails(int id)
        {
            try
            {
                var cust = db.Customers
                    .Where(x => x.ID == id)
                    .Select(x => new CustomerDetailsDTO                    {
                        ID = x.ID,
                        CustomerName = x.CustomerName,
                        CustomerEmail = x.CustomerEmail,
                        CustomerID = x.CustomerID,
                        CustomerPhone = x.CustomerPhone,
                        CustomerAdress = x.CustomerAdress,
                        CustomerIsPotential = x.isPotential,
                        CustomerIsDeleted = x.isDeleted
                    })
                    .FirstOrDefault();

                return Ok(cust);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
