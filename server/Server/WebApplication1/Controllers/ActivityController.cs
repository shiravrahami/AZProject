using System.Collections.Generic;
using System.Linq;
using SignIn;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;
using Newtonsoft.Json.Linq;

namespace WebApplication1.Controllers
{
    public class ActivityController : ApiController
    {
        igroup195_DB_Prod db = new igroup195_DB_Prod();

        // GET api/activity
        [HttpGet]
        [Route("api/Activities")]
        public IEnumerable<ActivityDTO> GetActivities() // מחזירה אוסף של אובייקטי "ActivityDTO"
        {
            var activities = db.Activity     //הקוד יוצר מופע של ההקשר של מסד הנתונים ("igroup195_prod_DB") כדי לבצע שאילתה בטבלת "פעילות" במסד הנתונים.
                .Select(a => new ActivityDTO  //השיטה משתמשת ב-LINQ כדי להקרין תת-קבוצה של המאפיינים של כל שורה בטבלה "Activity" לתוך אובייקט "ActivityDTO" חדש.
                {
                    Activity_ID = a.ActivityID,
                    Task_ID = a.TaskID,
                    Employee_PK = a.EmployeePK,
                    Start_Date = a.StartDate,
                    //End_Date = a.EndDate
                    //לא מזהה את השדה..אומר שהטיפוס לא תקין, הטיפוס מסוג תאריך לפי הדתה בייס
                })
                .ToList();

            return activities; //מחזיר את רשימת האובייקטים ממחלקת דטאו מטבלת פעילות במסד הנתונים
        }
    }

}

