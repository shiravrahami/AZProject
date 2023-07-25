using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class PriceDTO
    {
        public double PriceQuoteId { get; set; }

        public int CustomerPK { get; set; }

        
        public int TotalWorkHours { get; set; }

        public int DiscoutPercent { get; set; }

        public int TotalPrice { get; set; }

        public string PriceQuoteFile { get; set; }
        public string CustomerName { get; internal set; }

        public string CustomerEmail { get; set; }
       
    }
}