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


namespace WebApplication1.Controllers
{
    //הקוד מכיל שתי פעולות, אחת ליצירת הצעת מחיר חדשה ואחת לאחזור הצעת מחיר לפי המזהה שלו.
    public class InsertPriceQuotesController : ApiController
    {
        // הכנסת הקשר לבסיס הנתונים
        igroup195_prodEntities db = new igroup195_prodEntities();

        [HttpPost]
        [Route("api/InsertPriceQuote")]
        public IHttpActionResult InsertPriceQuote([FromBody] PriceDTO priceDTO)
        {

            try //בודק שכל הפרמטרים הנדרשים קיימים
            {
                if (priceDTO.CustomerPK == 0 ||
                    //priceDTO.ProjectId == 0 ||
                    priceDTO.TotalWorkHours == 0 ||
                    priceDTO.TotalPrice == 0)
                {
                    return BadRequest("One or more parameters are missing or empty");
                }

                // יצירת ציטוט מחיר חדש מה-DTO המתקבל
                PriceQuotes newPriceQuote = new PriceQuotes() //Inside the action, a new PriceQuotes object is created based on the PriceDTO object sent in the request.
                {
                    CustomerPK = priceDTO.CustomerPK,
                    //ProjectID = priceDTO.ProjectId,
                    TotalWorkHours = priceDTO.TotalWorkHours,
                    DiscoutPercent = priceDTO.DiscoutPercent,
                    TotalPrice = priceDTO.TotalPrice,
                    PriceQuoteFile = priceDTO.PriceQuoteFile

                };

                // עדכון המסד נתונים 
                db.PriceQuotes.Add(newPriceQuote);//האובייקט החדש מתווסף למסד הנתונים 
                db.SaveChanges();//האובייקט החדש נשמר במסד הנתונים

                return Ok("Price Quote details saved successfully");//העדכון הצליח
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving Price Quote details: {ex.Message}");//במידה ויש חריגות
            }
        }

        [HttpGet]
        [Route("api/pricequotes/{id}", Name = "GetPriceQuoteById")]
        public IHttpActionResult GetPriceQuoteById(int id)//לוקחת מזהה פרמטר שלם שהוא המזהה של הצעת המחיר שיש לאחזר ממסד הנתונים.
        {
            var priceQuote = db.PriceQuotes.Find(id);//הפעולה מאחזרת את הצעת המחיר ממסד הנתונים

            if (priceQuote == null)
            {
                return NotFound();//במידה ולא נמצאה
            }

            return Ok(priceQuote);
            //הפעולה מקבלת מזהה של הצעת מחיר כפרמטר ומחזירה את ההצעה המתאים ממסד הנתונים
        }


        // לקובץ של הצעת מחיר לפי הלקוח 
        [HttpGet]
        [Route("api/PriceQuote/{ID}")]
        public IHttpActionResult GetPriceQuoteByCustomer(int ID)
        {
            try
            {
                var priceQuote = db.PriceQuotes.FirstOrDefault(pq => pq.CustomerPK == ID);
                if (priceQuote == null)
                {
                    return NotFound();
                }

                var priceDTO = new PriceDTO
                {
                    PriceQuoteId = priceQuote.PriceQuoteID,
                    CustomerPK = priceQuote.CustomerPK,
                    //ProjectId = priceQuote.ProjectID,
                    TotalWorkHours = priceQuote.TotalWorkHours,
                    DiscoutPercent = priceQuote.DiscoutPercent,
                    TotalPrice = priceQuote.TotalPrice,
                    PriceQuoteFile = priceQuote.PriceQuoteFile
                };

                return Ok(priceDTO);
            }
            catch (Exception)
            {
                return BadRequest("Error");
            }
        }

        //מתודת שליחת מייל הצעת מחיר ללקוח
        [HttpGet]
        [Route("api/PriceQuoteSendMail/{ID}")]
        public IHttpActionResult GetPriceQuoteByCustomerSendMail(int ID)
        {
            try
            {
                var priceQuote = db.PriceQuotes.FirstOrDefault(pq => pq.CustomerPK == ID);
                if (priceQuote == null)
                {
                    return NotFound();
                }

                var customer = db.Customers.FirstOrDefault(c => c.ID == priceQuote.CustomerPK);
                if (customer == null)
                {
                    return NotFound();
                }

                var priceDTO = new PriceDTO
                {
                    PriceQuoteId = priceQuote.PriceQuoteID,
                    CustomerPK = priceQuote.CustomerPK,
                    CustomerName = customer.CustomerName,
                    CustomerEmail = customer.CustomerEmail,
                    //ProjectId = priceQuote.ProjectID,
                    TotalWorkHours = priceQuote.TotalWorkHours,
                    DiscoutPercent = priceQuote.DiscoutPercent,
                    TotalPrice = priceQuote.TotalPrice,
                    PriceQuoteFile = priceQuote.PriceQuoteFile
                };

                string subject = "הצעת מחיר";
                string body = $"שלום {customer.CustomerName} ,\n תודה שבחרת בנו ! \n להלן הצעת המחיר שלך\n סך הכל שעות עבודה- {priceQuote.TotalWorkHours}\n אחוז הנחה- {priceQuote.DiscoutPercent}\n מחיר סופי- {priceQuote.TotalPrice}\n קובץ הצעת מחיר- {priceQuote.PriceQuoteFile}";

                SendEmail(customer.CustomerEmail, subject, body);

                return Ok(priceDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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



        //אלמנט חכם

        //מתודה שתקבל מזהה של לקוח תציג את סכום הצעת המחיר, כל סכום כזה הוא נקודה במערך

        [HttpGet]
        [Route("api/TotalPrice/{ID}")]
        public IHttpActionResult GetTotalPrice(int ID)
        {
            try
            {
                var priceQuote = db.PriceQuotes.FirstOrDefault(pq => pq.CustomerPK == ID);
                if (priceQuote == null)
                {
                    return NotFound();
                }

                decimal totalPrice = priceQuote.TotalPrice;

                return Ok(totalPrice);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //מתודה שתחזיר כנק את כל הצעות המחיר
        [HttpGet]
        [Route("api/TotalPriceQuotes")]
        public IHttpActionResult GetTotalPriceQuotes()
        {
            try
            {
                var customers = db.Customers.ToList();

                List<decimal> totalPriceQuotes = new List<decimal>();

                foreach (var customer in customers)
                {
                    var priceQuote = db.PriceQuotes.FirstOrDefault(pq => pq.CustomerPK == customer.ID);

                    if (priceQuote != null)
                    {
                        decimal totalPrice = priceQuote.TotalPrice;
                        totalPriceQuotes.Add(totalPrice);
                    }
                }

                return Ok(totalPriceQuotes);
            }
            catch (Exception ex)
            {
                return BadRequest("Error retrieving total price quotes: " + ex.Message);
            }
        }

        //מחזירה את ההצעת מחיר הקרובה ביותר לערך שהוזן
        [HttpGet]
        [Route("api/ClosestPriceQuote/{value}")]
        public IHttpActionResult GetClosestPriceQuote(decimal value)
        {
            try
            {
                var customers = db.Customers.ToList();

                List<decimal> totalPriceQuotes = new List<decimal>();

                foreach (var customer in customers)
                {
                    var priceQuote = db.PriceQuotes.FirstOrDefault(pq => pq.CustomerPK == customer.ID);

                    if (priceQuote != null)
                    {
                        decimal totalPrice = priceQuote.TotalPrice;
                        totalPriceQuotes.Add(totalPrice);
                    }
                }

                // מציאת הנקודה הקרובה ביותר לערך שהמשתמש הזין
                decimal closestPoint = totalPriceQuotes.OrderBy(x => Math.Abs(x - value)).FirstOrDefault();

                return Ok(closestPoint);
            }
            catch (Exception ex)
            {
                return BadRequest("Error retrieving closest price quote: " + ex.Message);
            }
        }


    }

}

