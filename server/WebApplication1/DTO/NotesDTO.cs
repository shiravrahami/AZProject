using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class NotesDTO
    {
        public int ID { get; set; }
        public int EmployeePK { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }
    }
}
