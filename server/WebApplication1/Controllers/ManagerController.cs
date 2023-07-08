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
using NLog;
using System.Net.Mail;



namespace WebApplication1.Controllers
{
    public class ManagerController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

       //מחזיר את פרטי העובד לפי המזהה
        [HttpGet]
        [Route("api/manager/employee/{id}")]
        public IHttpActionResult GetEmployeeDetails(int id)
        {
            EmployeeDeatailsDTO employeeDetails = GetEmployeeDetailsById(id);
            return Ok(employeeDetails);
        }

        //הוספת עובד חדש למערכת
        [HttpPost]
        [Route("api/manager/employee")]
        public IHttpActionResult AddEmployee(EmployeeDeatailsDTO employee)
        {
           
            if (employee.EmployeeID == "6")
            {
                //העובד מנהל
                employee.EmployeeTitle = "מנהל";

                // קוד לשליחת מייל לעובד החדש עם פרטיו
                SendEmailToEmployee(employee);
            }
            return Ok();
        }

       //עדכון עובד לפי מזהה
        [HttpPut]
        [Route("api/manager/employee/{id}")]
        public IHttpActionResult UpdateEmployeeDetails(int id, EmployeeDeatailsDTO employee)
        {
            if (employee.EmployeeID == "6")
            {
                //  שליחת מייל לעובד עם הפרטים המעודכנים
                SendEmailToEmployee(employee);
            }

            return Ok();
        }

        private EmployeeDeatailsDTO GetEmployeeDetailsById(int id)
        {
            // יצירת אובייקט לפרטי העובד
            EmployeeDeatailsDTO employeeDetails = new EmployeeDeatailsDTO();

            //פרטי העובד עם המזהה
            using (var context = new igroup195_DB_Prod())
            {
                Employees employee = context.Employees.FirstOrDefault(e => e.ID == id);

                //מילוי פרטי העובד
                if (employee != null)
                {
                    employeeDetails.EmployeeID = employee.EmployeeID;
                    employeeDetails.EmployeeName = employee.EmployeeName;
                    employeeDetails.EmployeeEmail = employee.EmployeeEmail;
                    employeeDetails.EmployeePhone = employee.EmployeePhone;
                    employeeDetails.ID = employee.ID;
                    employeeDetails.EmployeeTitle = employee.EmployeeTitle;
                    employeeDetails.EmployeePassword = employee.EmployeePassword;
                    employeeDetails.EmployeePhoto = employee.EmployeePhoto;
                }
            }

            // החזרת פרטי העובד
            return employeeDetails;
        }

        private void SendEmailToEmployee(EmployeeDeatailsDTO employee)
        {
            // כתובת האימייל של העובד החדש
            string recipientEmail = employee.EmployeeEmail;

            // נושא המייל
            string subject = "פרטי העובד החדש";

            // גוף המייל עם הפרטים של העובד החדש
            string body = $"שם העובד: {employee.EmployeeName}\nתעודת זהות: {employee.EmployeeID}\nסיסמה: {employee.EmployeePassword}\nמספר טלפון: {employee.EmployeePhone}";

            // יצירת אובייקט MailMessage עם הפרטים המתאימים
            MailMessage mailMessage = new MailMessage("your_email@example.com", recipientEmail, subject, body);


            SmtpClient smtpClient = new SmtpClient("smtp.example.com", 587);
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new System.Net.NetworkCredential("your_email@example.com", "your_password");
            smtpClient.EnableSsl = true;

            // שליחת המייל
            smtpClient.Send(mailMessage);
        }
    }



}
