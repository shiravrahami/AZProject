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
    public class InsertCustomerController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPut]
        [Route("api/InsertCustomer")]
        public IHttpActionResult InsertCustomer([FromBody] CustomerDetailsDTO cust)
        {
            try 
            {
                if (string.IsNullOrEmpty(cust.CustomerEmail?.ToString()) ||
                    string.IsNullOrEmpty(cust.CustomerName?.ToString()) ||
                    string.IsNullOrEmpty(cust.CustomerAdress?.ToString()) ||
                    string.IsNullOrEmpty(cust.CustomerID?.ToString()) ||
                    string.IsNullOrEmpty(cust.CustomerPhone?.ToString()))
                {
                    return BadRequest("One or more parameters are missing or empty");
                }

                string CustomerEmail = cust.CustomerEmail.ToString();
                string CustomerName = cust.CustomerName.ToString();
                string CustomerID = cust.CustomerID.ToString();
                string CustomerPhone = cust.CustomerPhone.ToString();
                string CustomerAdress = cust.CustomerAdress.ToString();
                bool isPotential = cust.CustomerIsPotential;

                Customers Customer = new Customers();
                Customer.CustomerEmail = CustomerEmail;
                Customer.CustomerName = CustomerName;
                Customer.CustomerID = CustomerID;
                Customer.CustomerPhone = CustomerPhone;
                Customer.CustomerAdress = CustomerAdress;
                Customer.isPotential = isPotential;
                
                db.Customers.Add(Customer);

                db.SaveChanges();
                return Ok("Customer details saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving Customer details: {ex.Message}");
            }

        }
    }
}

    
