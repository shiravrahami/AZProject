using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class CustomerTasksDTO
    {
        public int CustomerPK { get; set; }
        public string CustomerName { get; set; }
        public int TotalopenCount { get; set; }
        public int CountTasks { get; set; }

        //public string TaskName { get; set; }
    }

    //public class CustomerSummaryDTO
    //{
    //    public string CustomerName { get; set; }
    //    public string CustomerID { get; set; }
    //    public int TotalTasks { get; set; }
    //    public int OpenTasks { get; set; }
    //}

}