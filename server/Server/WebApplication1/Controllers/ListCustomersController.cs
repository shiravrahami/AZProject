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
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    public class ListCustomersController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/ListCustomers")]
        public IHttpActionResult Get()
        {
            try
            {
                var customers = db.Customers.ToList();
                if (customers == null || customers.Count == 0)
                {
                    return NotFound();
                }
                var custList = db.Customers.Where(x => !x.isDeleted).Select(x => new CustomerDetailsDTO
                {
                    ID = x.ID,
                    CustomerName = x.CustomerName,
                    CustomerEmail = x.CustomerEmail,
                    CustomerID = x.CustomerID,
                    CustomerPhone = x.CustomerPhone,
                    CustomerAdress = x.CustomerAdress,
                    CustomerIsPotential = x.isPotential,
                    CustomerIsDeleted = x.isDeleted
                }).ToList();
                return Ok(custList);
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }

        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("api/ListCustomers/{id}")]
        public IHttpActionResult Put(int id)
        {
            var customer = db.Customers.FirstOrDefault(c => c.ID == id);
            if (customer == null)
            {
                return NotFound();
            }
            customer.isDeleted = true;
            db.SaveChanges();
            return Ok("The customer has been deleted!");
        }
    }
}
