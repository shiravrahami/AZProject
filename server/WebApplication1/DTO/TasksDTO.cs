using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class TasksDTO
    {
        //internal string CustomerName;

        public int TaskID { get; set; }

        public string TaskName { get; set; }

        public int ProjectID { get; set; }

        public int TaskType { get; set; }
        public int ID { get; set; }//מספר רץ של עובד

        public int CustomerPK { get; set; }//מספר רץ לקוח
        public string TaskDescription { get; set; }

        public DateTime InsertTaskDate { get; set; }

        public DateTime Deadline { get; set; }

        public bool isDone { get; set; }
        public bool isDeleted { get; set; }
        public string EmployeeName { get;  set; }
        public string CustomerName { get;  set; }
        public string CustomerID { get; set; }

       
        public string EmployeeEmail { get; set; }

        public double PriceQuoteTime { get; set; }
        public string EmployeeID { get; internal set; }



        public double Difficulty { get; set; }//חדש

    }
}