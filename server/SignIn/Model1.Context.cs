﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SignIn
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class igroup195_DB_Prod : DbContext
    {
        public igroup195_DB_Prod()
            : base("name=igroup195_DB_Prod")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Activity> Activity { get; set; }
        public virtual DbSet<Comments> Comments { get; set; }
        public virtual DbSet<Customers> Customers { get; set; }
        public virtual DbSet<Employees> Employees { get; set; }
        public virtual DbSet<Files> Files { get; set; }
        public virtual DbSet<Notes> Notes { get; set; }
        public virtual DbSet<PriceQuotes> PriceQuotes { get; set; }
        public virtual DbSet<Projects> Projects { get; set; }
        public virtual DbSet<sysdiagrams> sysdiagrams { get; set; }
        public virtual DbSet<Task_Employee_Activity> Task_Employee_Activity { get; set; }
        public virtual DbSet<Tasks> Tasks { get; set; }
        public virtual DbSet<TaskType> TaskType { get; set; }
    }
}
