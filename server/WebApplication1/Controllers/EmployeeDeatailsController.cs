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

public class EmployeeDetailsController : ApiController
{
    igroup195_prodEntities db = new igroup195_prodEntities();
    //פרטי עובדים
    [HttpGet]
    [Route("api/EmployeeDetails/{id}")]
    public IHttpActionResult GetEmployeeDetails(int id)
    {
        try
        {
            var emp = db.Employees
                .Where(x => x.ID == id)
                .Select(x => new EmployeeDeatailsDTO
                {
                    EmployeeEmail = x.EmployeeEmail,
                    EmployeeName = x.EmployeeName,
                    EmployeeID = x.EmployeeID,
                    EmployeePhone = x.EmployeePhone,
                    ID = x.ID,
                    EmployeeTitle = x.EmployeeTitle,
                    EmployeePassword = x.EmployeePassword,
                    EmployeePhoto = x.EmployeePhoto
                })
                .FirstOrDefault();

            return Ok(emp);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    //עדכון עובד קוד חדש
    [HttpPut]
    [Route("api/EmployeeUpdate/{employeeId}")]
    public IHttpActionResult UpdateEmployeeDetails(int employeeId, [FromBody] EmployeeDeatailsDTO updatedDetails)
    {
        try
        {
            var employee = db.Employees.FirstOrDefault(emp => emp.ID == employeeId);

            if (employee == null)
            {
                return BadRequest("Employee not found");
            }

            employee.EmployeeEmail = updatedDetails.EmployeeEmail;
            employee.EmployeeName = updatedDetails.EmployeeName;
            employee.EmployeeID = updatedDetails.EmployeeID;
            employee.EmployeePhone = updatedDetails.EmployeePhone;
            employee.EmployeeTitle = updatedDetails.EmployeeTitle;
            employee.EmployeePassword = updatedDetails.EmployeePassword;
            employee.EmployeePhoto = updatedDetails.EmployeePhoto;

            db.SaveChanges();

            return Ok("Employee details updated successfully");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating employee details: {ex.Message}");
        }
    }



    //עדכון עובד קוד ישן
    //[HttpPut]
    //[Route("api/EmployeeUpdate")]
    //public IHttpActionResult UpdateEmployeeDetails([FromBody] JObject data)
    //{
    //    try //בודק שכל הפרמטרים הנדרשים קיימים
    //    {
    //        if (string.IsNullOrEmpty(data["EmployeeEmail"]?.ToString()) ||
    //            string.IsNullOrEmpty(data["NewEmployeeName"]?.ToString()) ||
    //            string.IsNullOrEmpty(data["NewEmployeeID"]?.ToString()) ||
    //            string.IsNullOrEmpty(data["NewEmployeePhone"]?.ToString()))
    //        {
    //            return BadRequest("One or more parameters are missing or empty");
    //        }

    //        string email = data["EmployeeEmail"].ToString();
    //        string name = data["NewEmployeeName"].ToString();
    //        string id = data["NewEmployeeID"].ToString();
    //        string phone = data["NewEmployeePhone"].ToString();

    //        var employee = db.Employees.FirstOrDefault(emp => emp.EmployeeEmail == email);//מחפש את רשומת העובדים במסד הנתונים על סמך כתובת הדוא"ל שסופקה

    //        if (employee == null)
    //        {
    //            return BadRequest("Employee not found");//אם לא נמצא העובד
    //        }

    //        employee.EmployeeEmail = email;
    //        employee.EmployeeName = name;
    //        employee.EmployeeID = id;
    //        employee.EmployeePhone = phone;


    //        db.SaveChanges();//אם העובד נמצא, הקוד מעדכן את שם העובד, תעודת זהות ומספר טלפון בערכים החדשים

    //        return Ok("Employee details updated successfully");//העדכון הצליח
    //    }
    //    catch (Exception ex)
    //    {
    //        return BadRequest($"Error updating employee details: {ex.Message}");//במידה ויש חריגות
    //    }
    //}



    //ListEmployees
    [HttpGet]
    [Route("api/ListEmployees")]
    public IHttpActionResult GetListEmployees()
    {
        try
        {
            var employees = db.Employees.ToList();
            if (employees == null || employees.Count == 0)
            {
                return NotFound();
            }
            var empList = db.Employees.Where(x => !x.isDeleted).Select(x => new EmployeeDeatailsDTO
            {
                ID = x.ID,
                EmployeeID = x.EmployeeID,
                EmployeeName = x.EmployeeName,
                EmployeeEmail = x.EmployeeEmail,
                EmployeePhone = x.EmployeePhone,
                EmployeeTitle = x.EmployeeTitle,
                EmployeePassword = x.EmployeePassword,
                EmployeePhoto = x.EmployeePhoto
            }).ToList();

            return Ok(empList);
        }
        catch (Exception)
        {
            return BadRequest("Error");
        }
    }

    //ListEmployees/{id}
    [HttpPut]
    [Route("api/ListEmployees/{id}")]
    public IHttpActionResult PutListEmployees(int id)
    {
        var employee = db.Employees.FirstOrDefault(e => e.ID == id);
        if (employee == null)
        {
            return NotFound();
        }

        employee.isDeleted = true;
        db.SaveChanges();
        return Ok("The employee has been deleted!");
    }

    //הוספת עובד חדש מקורי
    //[HttpPut]
    //[Route("api/InsertEmployee")]
    //public IHttpActionResult InsertEmployee([FromBody] EmployeeDeatailsDTO emp)
    //{
    //    try
    //    {
    //        if (string.IsNullOrEmpty(emp.EmployeeEmail?.ToString()) ||
    //            string.IsNullOrEmpty(emp.EmployeeName?.ToString()) ||
    //            string.IsNullOrEmpty(emp.EmployeePassword?.ToString()) ||
    //            string.IsNullOrEmpty(emp.EmployeeID?.ToString()) ||
    //            string.IsNullOrEmpty(emp.EmployeeTitle?.ToString()) ||
    //            string.IsNullOrEmpty(emp.EmployeePhone?.ToString()))
    //        {
    //            return BadRequest("One or more parameters are missing or empty");
    //        }

    //        string employeeEmail = emp.EmployeeEmail.ToString();
    //        string employeeName = emp.EmployeeName.ToString();
    //        string employeePassword = emp.EmployeePassword.ToString();
    //        string employeeID = emp.EmployeeID.ToString();
    //        string employeeTitle = emp.EmployeeTitle.ToString();
    //        string employeePhone = emp.EmployeePhone.ToString();
    //        string employeePhoto = emp.EmployeePhoto.ToString();

    //        Employees employee = new Employees();
    //        employee.EmployeeEmail = employeeEmail;
    //        employee.EmployeeName = employeeName;
    //        employee.EmployeeID = employeeID;
    //        employee.EmployeePhone = employeePhone;
    //        employee.EmployeePhoto = employeePhoto;
    //        employee.EmployeeTitle = employeeTitle;
    //        employee.EmployeePassword = employeePassword;

    //        db.Employees.Add(employee);

    //        db.SaveChanges();

    //        string subject = "employee password";
    //        string body = $"Hello {employeeName},\nWelcome to the system.\nYour Password is {employeePassword} .";

    //        SendEmail(employeeEmail, subject, body);

    //        return Ok("Employee details saved successfully");
    //    }
    //    catch (Exception ex)
    //    {
    //        return BadRequest($"Error saving employee details: {ex.Message}");
    //    }
    //}


    //מתודה המוסיפה עובד חדש למערכת ושולחת לו ססמא ראשונית במייל
    [HttpPost]
    [Route("api/InsertEmployeeSendMail")]
    public IHttpActionResult InsertEmployeeSendMail([FromBody] EmployeeDeatailsDTO emp)
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

            string subject = "פרטי התחברות למערכת";
            string body = $"שלום {employeeName} ,\n ברוך הבא למערכת שלנו ! \n הססמא הראשונית שלך היא {employeePassword}";

            SendEmail(employeeEmail, subject, body);

            return Ok("Employee details saved successfully");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error saving employee details: {ex.Message}");
        }
    }

    private void SendEmail(string toMail, string subjects, string bodys)
    {
        Console.WriteLine($"Sending an email: {toMail}\nSubject: {subjects}\nBody: {bodys}");

        MailMessage message = new MailMessage();
        message.From = new MailAddress("remotlat@outlook.com");
        message.To.Add(toMail);
        message.Subject = subjects;
        message.Body = bodys;

        SmtpClient smtpClient = new SmtpClient("smtp.office365.com", 587);
        smtpClient.UseDefaultCredentials = false;
        smtpClient.Credentials = new NetworkCredential("remotlat@outlook.com", "1223OutlookWork");
        smtpClient.EnableSsl = true;

        smtpClient.Send(message);
    }


    //מחזירה את המזהה של העובד החדש ביותר
    //[HttpGet]
    //[Route("api/GetNewEmployeeID")]
    //public IHttpActionResult GetNewEmployeeID()
    //{
    //    try
    //    {
    //        // נמצא את העובד החדש באמצעות מיון לפי המזהה ID בסדר יורד
    //        Employees newEmployee = db.Employees.OrderByDescending(e => e.ID).FirstOrDefault();

    //        if (newEmployee != null)
    //        {
    //            return Ok(newEmployee.ID);
    //        }
    //        else
    //        {
    //            return NotFound();
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        return BadRequest($"Error retrieving new employee ID: {ex.Message}");
    //    }
    //}




    ////יצירת עובד חדש עם הצפנה

    [HttpPost]
    [Route("api/InsertEmployeePassword")]
    public IHttpActionResult InsertEmployeePassword([FromBody] EmployeeDeatailsDTO emp)
    {
        try
        {
            // בדיקה האם כל השדות מולאו
            if (string.IsNullOrEmpty(emp.EmployeeEmail) ||
                string.IsNullOrEmpty(emp.EmployeeName) ||
                string.IsNullOrEmpty(emp.EmployeePassword) ||
                string.IsNullOrEmpty(emp.EmployeeID) ||
                string.IsNullOrEmpty(emp.EmployeeTitle) ||
                string.IsNullOrEmpty(emp.EmployeePhone))
            {
                return BadRequest("One or more parameters are missing or empty");
            }

            // הצפנת הסיסמה
            string encryptedPassword = EncryptPassword(emp.EmployeePassword);

            // בדיקה האם כבר קיים עובד עם אותה ת"ז
            var existingEmployee = db.Employees.FirstOrDefault(e => e.EmployeeID == emp.EmployeeID);
            if (existingEmployee != null)
            {
                return BadRequest("An employee with this ID already exists");
            }

            Employees employee = new Employees();
            employee.EmployeeID = emp.EmployeeID;
            employee.EmployeeName = emp.EmployeeName;
            employee.EmployeeEmail = emp.EmployeeEmail;
            employee.EmployeePhone = emp.EmployeePhone;
            employee.EmployeeTitle = emp.EmployeeTitle;
            employee.EmployeePassword = encryptedPassword; // שמירת הסיסמה המוצפנת במסד הנתונים
            employee.EmployeePhoto = emp.EmployeePhoto;
            employee.isDeleted = emp.isDeleted;

            db.Employees.Add(employee);
            db.SaveChanges();

            return Ok("Employee details saved successfully");
        }
        catch (Exception ex)
        {

            return BadRequest($"Error saving employee details: {ex.Message}");
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











