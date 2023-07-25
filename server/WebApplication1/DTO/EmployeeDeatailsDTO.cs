using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class EmployeeDeatailsDTO
    {
        public string EmployeeEmail { get; set; }

        public string EmployeeName { get; set; }

        public string EmployeeID { get; set; }

        public string EmployeePhone { get; set; }

        public int ID { get; set; }
        public string EmployeeTitle { get; set; }
        public string EmployeePassword { get; set; }
        public string EmployeePhoto { get; set; }

       public bool isDeleted  {get; set; }//התווסף
        public int TasksNotDoneCount { get; internal set; }
        
    }
}