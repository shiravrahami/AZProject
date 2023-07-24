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
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Data.Entity.Validation;


namespace WebApplication1.Controllers
{
    public class SignInController : ApiController
    {
        igroup195_prodEntities db = new igroup195_prodEntities();
        [HttpPost]
        [Route("api/signin")]
        public IHttpActionResult PostEmployeeSignIn([FromBody] EmployeeSignInDTO user)
        {
            try
            {
                string hashedInputPassword = EncryptPassword(user.Password);

                var employee = db.Employees.FirstOrDefault(emp => emp.EmployeeEmail == user.Email && emp.EmployeePassword == hashedInputPassword);

                if (employee != null)
                {

                    var employeeDetails = new EmployeeDeatailsDTO
                    {
                        EmployeeEmail = employee.EmployeeEmail,
                        EmployeeName = employee.EmployeeName,
                        EmployeeID = employee.EmployeeID,
                        EmployeePhone = employee.EmployeePhone,
                        ID = employee.ID,
                        EmployeeTitle = employee.EmployeeTitle,
                        EmployeePhoto = employee.EmployeePhoto
                    };

                    return Ok(employeeDetails);

                }

                return BadRequest("Invalid email or password.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error during login: {ex.Message}");
            }
        }

        private static string EncryptPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }


       


    }
}

