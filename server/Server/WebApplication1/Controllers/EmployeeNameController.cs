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


    public class EmployeeNameController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();
        
        public string Get(int id)
        {
            return "value";
        }

        

        // PUT api/values/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
        [HttpPost]
        public IHttpActionResult GetEmployeeName([FromBody] EmployeeSignInDTO user)
            {
                var employee = db.Employees.FirstOrDefault(emp => emp.EmployeeEmail == user.Email);
                if (employee == null)
                {
                    return NotFound();
                }

                return Ok(employee.EmployeeName);
            }
        }

    }

