using System.Web.Http;
using WebApplication1.DTO;
using SignIn;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;


namespace WebApplication1.Controllers
{
    //הקוד מכיל שתי פעולות, אחת ליצירת הצעת מחיר חדשה ואחת לאחזור הצעת מחיר לפי המזהה שלו.
    public class InsertPriceQuotesController : ApiController
    {
        // הכנסת הקשר לבסיס הנתונים
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        [HttpPost]
        [Route("api/InsertPriceQuote")]
        public IHttpActionResult InsertPriceQuote([FromBody] PriceDTO priceDTO)
        {

            try //בודק שכל הפרמטרים הנדרשים קיימים
            {
                if (priceDTO.CustomerPK == 0 ||
                    priceDTO.ProjectId == 0 ||
                    priceDTO.TotalWorkHours == 0 ||
                    priceDTO.TotalPrice == 0)
                {
                    return BadRequest("One or more parameters are missing or empty");
                }

                // יצירת ציטוט מחיר חדש מה-DTO המתקבל
                PriceQuotes newPriceQuote = new PriceQuotes() //Inside the action, a new PriceQuotes object is created based on the PriceDTO object sent in the request.
                {
                    CustomerPK = priceDTO.CustomerPK,
                    ProjectID = priceDTO.ProjectId,
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
        [Route("api/PriceQuote/{customerId}")]
        public IHttpActionResult GetPriceQuoteByCustomer(int customerId)
        {
            try
            {
                var priceQuote = db.PriceQuotes.FirstOrDefault(pq => pq.CustomerPK == customerId);
                if (priceQuote == null)
                {
                    return NotFound();
                }

                var priceDTO = new PriceDTO
                {
                    PriceQuoteId = priceQuote.PriceQuoteID,
                    CustomerPK = priceQuote.CustomerPK,
                    ProjectId = priceQuote.ProjectID,
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


    }
}
