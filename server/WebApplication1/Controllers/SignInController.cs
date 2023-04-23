using SignIn;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;



namespace WebApplication1.Controllers
{
    public class SignInController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        public IHttpActionResult PostEmployeeSignIn ([FromBody] EmployeeSignInDTO user)
        {
            var employee = db.Employees.FirstOrDefault(emp => emp.EmployeeEmail == user.Email && emp.EmployeePassword == user.Password);
            try
            {
                if (employee != null)
                {
                    var employeeDetails = new EmployeeDeatailsDTO
                    {
                        EmployeeEmail = employee.EmployeeEmail,
                        EmployeeName = employee.EmployeeName,
                        EmployeeID = employee.EmployeeID,
                        EmployeePhone = employee.EmployeePhone,
                        EmployeePK = employee.ID,
                        EmployeeTitle = employee.EmployeeTitle,
                        EmployeePassword = employee.EmployeePassword,
                        EmployeePhoto = employee.EmployeePhoto
                    };

                    return Ok(employeeDetails);
                }
                else
                {
                    return BadRequest("Invalid email or password.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error during login: {ex.Message}");
            }
        }
    }
}

