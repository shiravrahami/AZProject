﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class TasksDTO
    {
        internal string CustomerName;

        public int TaskID { get; set; }

        public string TaskName { get; set; }

        public int ProjectID { get; set; }

        public int TaskType { get; set; }

        public string TaskDescription { get; set; }

        public DateTime InsertTaskDate { get; set; }

        public DateTime Deadline { get; set; }

        public bool isDone { get; set; }
        public bool isDeleted { get; set; }
        public object EmployeeName { get; internal set; }
        //public string CustomerName { get; internal set; }
    }
}