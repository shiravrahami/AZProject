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
    public class InsertEmployeeController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPost]
        [Route("api/InsertEmployee")]
        public IHttpActionResult InsertEmployee([FromBody] EmployeeDeatailsDTO emp)
        {
            try 
            {
                if (string.IsNullOrEmpty(emp.EmployeeEmail?.ToString()) ||
                    string.IsNullOrEmpty(emp.EmployeeName?.ToString()) ||
                    string.IsNullOrEmpty(emp.EmployeePassword?.ToString()) ||
                    string.IsNullOrEmpty(emp.EmployeeID?.ToString()) ||
                    string.IsNullOrEmpty(emp.EmployeeTitle?.ToString()) ||
                    string.IsNullOrEmpty(emp.EmployeePhone?.ToString()))
                {
                    return BadRequest("One or more parameters are missing or empty");
                }

                string employeeEmail = emp.EmployeeEmail.ToString();
                string employeeName = emp.EmployeeName.ToString();
                string employeePassword = emp.EmployeePassword.ToString();
                string employeeID = emp.EmployeeID.ToString();
                string employeeTitle = emp.EmployeeTitle.ToString();
                string employeePhone = emp.EmployeePhone.ToString();
                string employeePhoto = emp.EmployeePhoto.ToString();

                Employees employee = new Employees();
                employee.EmployeeEmail = employeeEmail;
                employee.EmployeeName = employeeName;
                employee.EmployeeID = employeeID;
                employee.EmployeePhone = employeePhone;
                employee.EmployeePhoto = employeePhoto;
                employee.EmployeeTitle = employeeTitle;
                employee.EmployeePassword = employeePassword;
                
                db.Employees.Add(employee);

                db.SaveChanges();
                return Ok("Employee details saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving employee details: {ex.Message}");
            }
        }
    }
}

    
