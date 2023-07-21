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

        public string TaskDescription { get; set; }

        public DateTime InsertTaskDate { get; set; }

        public DateTime Deadline { get; set; }

        public bool isDone { get; set; }
        public bool isDeleted { get; set; }
        public string EmployeeName { get;  set; }
       public string CustomerName { get;  set; }

        //public DateTime EndDate { get; internal set; }//התווסף
        public string EmployeeEmail { get; set; }

        public double PriceQuoteTime { get; set; }//new
        public int EmployeeID { get; internal set; }
    }
}