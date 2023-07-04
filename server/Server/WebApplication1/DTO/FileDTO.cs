using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class FileDTO
    {
        public int FileID { get; set; }

        public string Path { get; set; }

        public string Description { get; set; }

        public string FileType { get; set; }

        public int FileTypeID { get; set; }
    }
}