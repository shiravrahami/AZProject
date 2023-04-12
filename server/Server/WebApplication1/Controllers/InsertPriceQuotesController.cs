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
                if (priceDTO.Customer_PK == 0 ||
                    priceDTO.Project_Id == 0 ||
                    priceDTO.TotalWork_Hours == 0 ||
                    priceDTO.Total_Price == null)
                {
                    return BadRequest("One or more parameters are missing or empty");
                }

                // יצירת ציטוט מחיר חדש מה-DTO המתקבל
                PriceQuotes newPriceQuote = new PriceQuotes() //Inside the action, a new PriceQuotes object is created based on the PriceDTO object sent in the request.
                {
                    CustomerPK = priceDTO.Customer_PK,
                    ProjectID = priceDTO.Project_Id,
                    TotalWorkHours = priceDTO.TotalWork_Hours,
                    DiscoutPercent = priceDTO.Discout_Percent,
                    TotalPrice = priceDTO.Total_Price,
                    PriceQuoteFile = priceDTO.PriceQuote_File
                    //האם צריכה להוסיף גם את שני השדות האחרונים ששמתי בDTO ?
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
            //הפעולה מקבלת מזהה של ציטוט מחיר כפרמטר ומחזירה את הציטוט המתאים ממסד הנתונים
        }
    }
}
