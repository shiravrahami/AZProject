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

        public IHttpActionResult Post([FromBody] EmployeeSignInDTO user)
        {
            var user1 = db.Employees.FirstOrDefault(emp => emp.EmployeeEmail == user.Email && emp.EmployeePassword == user.Password);
            try
            {
                if (user1 != null)
                {
                    return Ok("Login successful!");
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

