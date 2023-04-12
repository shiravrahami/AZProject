using System.Web.Http;
using WebApplication1.DTO;
using SignIn;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace WebApplication1.Controllers
{
    public class CustomerUpdateController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPut]
        [Route("api/CustomerUpdate")]
        public IHttpActionResult Put([FromBody] CustomerDetailsDTO updatedCustomer)
        {
            try
            {
                var customer = db.Customers.FirstOrDefault(c => c.ID == updatedCustomer.ID);

                if (customer == null)
                {
                    return NotFound();
                }

                customer.CustomerEmail = updatedCustomer.CustomerEmail;
                customer.CustomerName = updatedCustomer.CustomerName;
                customer.CustomerPhone = updatedCustomer.CustomerPhone;
                customer.CustomerAdress = updatedCustomer.CustomerAdress;
                customer.isPotential = updatedCustomer.CustomerIsPotential;

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
