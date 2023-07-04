using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class CommentsDTO
    {
        public int CommentID { get; set; }

        public int TaskID { get; set; }

        public int EmployeePK { get; set; }

        public string Description { get; set; }

        public DateTime Date { get; set; }
    }
}