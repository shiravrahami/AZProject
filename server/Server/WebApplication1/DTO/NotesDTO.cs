using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class NotesDTO
    {
        public int ID_Notes { get; set; }
        public int EmployeePK_Notes { get; set; }

        public string Title_Notes { get; set; }

        public string Description_Notes { get; set; }
    }
}
