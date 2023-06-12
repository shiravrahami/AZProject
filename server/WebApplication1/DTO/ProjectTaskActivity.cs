using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class ProjectTaskActivity
    {
        public string TaskName { get; set; }
        public int TaskID { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime StartDate { get; internal set; }
    }
}