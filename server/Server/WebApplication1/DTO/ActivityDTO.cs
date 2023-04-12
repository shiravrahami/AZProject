using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class ActivityDTO
    {
        public int Activity_ID { get; set; }

        public int Task_ID { get; set; }

        public int Employee_PK { get; set; }

        public DateTime Start_Date { get; set; }

        public DateTime End_Date { get; set; }
    }
}


