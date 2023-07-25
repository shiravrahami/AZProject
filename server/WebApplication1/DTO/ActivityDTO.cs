using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class ActivityDTO
    {
        public int ActivityID { get; set; }

        public int TaskID { get; set; }

        public int EmployeePK { get; set; }

        public string Description { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CustomerName { get; set; }

    }

}


