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
        igroup195_prodEntities db = new igroup195_prodEntities();


        //פרטי לקוחות
        [HttpGet]
        [Route("api/CustomerDetails/{id}")]

        public IHttpActionResult GetCustomerDetails(int id)
        {
            try
            {
               
                var cust = db.Customers
                    .Where(x => x.ID == id)
                    .Select(x => new CustomerDetailsDTO
                    {
                        ID = x.ID,
                        CustomerName = x.CustomerName,
                        CustomerEmail = x.CustomerEmail,
                        CustomerID = x.CustomerID,
                        CustomerPhone = x.CustomerPhone,
                        CustomerAdress = x.CustomerAdress,
                        CustomerIsPotential = x.isPotential,
                        CustomerIsDeleted = x.isDeleted,
                        CustomerType = x.CustomerType
                    })
                    .FirstOrDefault();

                return Ok(cust);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //עדכון לקוחות קוד חדש
        [HttpPut]
        [Route("api/CustomerUpdate/{customerId}")]
        public IHttpActionResult PutCustomerDetails(int customerId, [FromBody] CustomerDetailsDTO updatedCustomer)
        {
            try
            {
                var customer = db.Customers.FirstOrDefault(c => c.ID == customerId);

                if (customer == null)
                {
                    return BadRequest("Customer not found");
                }
                customer.CustomerID = updatedCustomer.CustomerID;
                customer.CustomerEmail = updatedCustomer.CustomerEmail;
                customer.CustomerName = updatedCustomer.CustomerName;
                customer.CustomerPhone = updatedCustomer.CustomerPhone;
                customer.CustomerAdress = updatedCustomer.CustomerAdress;
                customer.isPotential = updatedCustomer.CustomerIsPotential;
                customer.CustomerType = updatedCustomer.CustomerType;

                db.SaveChanges();

                return Ok("Customer details updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating employee details: {ex.Message}");
            }
        }

        //InsertCustomer
        [HttpPost]
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
                string CustomerType = cust.CustomerType;

                Customers Customer = new Customers();
                Customer.CustomerEmail = CustomerEmail;
                Customer.CustomerName = CustomerName;
                Customer.CustomerID = CustomerID;
                Customer.CustomerPhone = CustomerPhone;
                Customer.CustomerAdress = CustomerAdress;
                Customer.isPotential = isPotential;
                Customer.CustomerType = CustomerType;

                db.Customers.Add(Customer);

                db.SaveChanges();
                return Ok("Customer details saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving Customer details: {ex.Message}");
            }
        }

        //ListCustomers
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/ListCustomers")]
        public IHttpActionResult GetListCustomers()
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
                    CustomerIsDeleted = x.isDeleted,
                    CustomerType=x.CustomerType

                }).ToList();
                return Ok(custList);
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }

        //ListCustomers/{id}
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("api/ListCustomers/{id}")]
        public IHttpActionResult PutListCustomers (int id)
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



