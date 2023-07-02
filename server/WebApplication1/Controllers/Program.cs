using System;
using System.Collections.Generic;
using System.Linq;


namespace WebApplication1.Controllers
{
    //פונקציה בסיש ניר
    // הקוד מציג  את האינדקס הקרוב ביותר לנקודת הנתונים החדשה
    public class Program
    {
        static void Main()
        {
            List<double> clusterCenters = new List<double> { 2.5, 4.2, 6.8 };//רשימת מספרים כפולים שמציגות את נקודות המרכז

            double newDataPoint = 5.3;//מייצג את הנקודה שאנו רוצים לזהות

            List<double> distances = clusterCenters.Select(center => Math.Abs(center = newDataPoint)).ToList();//חישוב המרחק המוחלט בין נקודות המרכז לנקודה החדשה
            //עבור כל נקודת מרכז יחושב המרחק החדש המוחלט מהנקודה החדשה והתוצאה תישמר ברשימת המרחקים

            double minDistance = distances.Min();//מחזירה את המרחק המינימלי

            int clusterIndex = distances.IndexOf(minDistance);

            Console.WriteLine("Accigned cluster index: " + clusterIndex);// מדפיס את המספר של הנק החדשה הקרובה ביותר
            //Assigned cluster index: 1

        }
    }
}