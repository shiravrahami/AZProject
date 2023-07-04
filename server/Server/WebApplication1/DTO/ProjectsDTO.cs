using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class ProjectsDTO
    {
        public int ProjectID { get; set; }

        public string ProjectName { get; set; }

        public int CustomerPK { get; set; }

        public string Description { get; set; }

        public DateTime InsertDate { get; set; }

        public DateTime Deadline { get; set; }

        public bool isDone { get; set; }
        public bool isDeleted { get; set; }

    }
}