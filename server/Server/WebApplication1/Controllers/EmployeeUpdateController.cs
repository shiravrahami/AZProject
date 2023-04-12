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
    public class EmployeeUpdateController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPut]
        [Route("api/EmployeeUpdate")]
        public IHttpActionResult UpdateEmployeeDetails([FromBody] JObject data)
        {
            try //בודק שכל הפרמטרים הנדרשים קיימים
            {
                if (string.IsNullOrEmpty(data["EmployeeEmail"]?.ToString()) ||
                    string.IsNullOrEmpty(data["NewEmployeeName"]?.ToString()) ||
                    string.IsNullOrEmpty(data["NewEmployeeID"]?.ToString()) ||
                    string.IsNullOrEmpty(data["NewEmployeePhone"]?.ToString()))
                {
                    return BadRequest("One or more parameters are missing or empty");
                }

                string email = data["EmployeeEmail"].ToString();
                string name = data["NewEmployeeName"].ToString();
                string id = data["NewEmployeeID"].ToString();
                string phone = data["NewEmployeePhone"].ToString();

                var employee = db.Employees.FirstOrDefault(emp => emp.EmployeeEmail == email);//מחפש את רשומת העובדים במסד הנתונים על סמך כתובת הדוא"ל שסופקה

                if (employee == null)
                {
                    return BadRequest("Employee not found");//אם לא נמצא העובד
                }

                employee.EmployeeEmail = email;
                employee.EmployeeName = name;
                employee.EmployeeID = id;
                employee.EmployeePhone = phone;


                db.SaveChanges();//אם העובד נמצא, הקוד מעדכן את שם העובד, תעודת זהות ומספר טלפון בערכים החדשים

                return Ok("Employee details updated successfully");//העדכון הצליח
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating employee details: {ex.Message}");//במידה ויש חריגות
            }
        }
    }
}

    
