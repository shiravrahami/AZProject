using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class PriceDTO
    {
        public double PriceQuote_Id { get; set; }

        public int Customer_PK { get; set; }

        public int Project_Id { get; set; }

        public int TotalWork_Hours { get; set; }

        public int Discout_Percent { get; set; }

        public int Total_Price { get; set; }

        public string PriceQuote_File { get; set; }
    }
}