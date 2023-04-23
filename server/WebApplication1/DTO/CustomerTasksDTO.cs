using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class CustomerTasksDTO
    {
        public string CustomerName { get; set; }
        //public string OpenTaskname { get; set; }
        public int TotalopenCount { get; set; }
        public int CountTasks { get; set; }
    }
}