using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Threading;

namespace WebApplication1.Controllers
{
    //הלקוח מקבל את ההצעת מחיר למייל שלו, ולאחר זמן שייקבע כפרמטר הלקוח יקבל תזכורת להצעת מחיר במייל.

    //אופציה 1
    public class PriceQuotesInC
    {
        static void Main()
        {
            // קריאה למתודה שמשלימה את הפעולות הנדרשות
            SendPriceProposal("customer@example.com");
        }

        static void SendPriceProposal(string customerEmail)
        {
            // שליחת ההצעת מחיר ללקוח
            SendEmail(customerEmail, "הצעת מחיר", "תוכן ההצעה");

            // המתנה מוגדרת (לדוגמה, עשרה ימים)
            TimeSpan reminderDelay = TimeSpan.FromDays(10);

            // הפעלת התזכורת להצעת המחיר
            Thread.Sleep(reminderDelay);
            SendEmail(customerEmail, "תזכורת להצעת מחיר", "תוכן התזכורת");
        }

        static void SendEmail(string to, string subject, string body)
        {
            try
            {
                using (var mail = new MailMessage())
                {
                    mail.From = new MailAddress("your-email@example.com");
                    mail.To.Add(to);
                    mail.Subject = subject;
                    mail.Body = body;

                    using (var smtpClient = new SmtpClient("smtp.example.com", 587))
                    {
                        smtpClient.EnableSsl = true;
                        smtpClient.Credentials = new System.Net.NetworkCredential("your-username", "your-password");
                        smtpClient.Send(mail);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("שגיאה בשליחת המייל: " + ex.Message);
            }
        }
    }


    /////////////////////////////////////////////////////////////////////////////////////////////
    

    //אופציה 2
    class PriceProposal
    {
        public void SendPriceOffer(string customerEmail)
        {
            // שליחת הצעת מחיר ללקוח
            SendEmail(customerEmail, "הצעת מחיר", "תודה שבחרתם בשירותינו. הנה הצעת המחיר שלנו לך.");

            // המתנה לפרק זמן של התזכורת
            Thread.Sleep(TimeSpan.FromDays(7));

            // שליחת תזכורת להצעת מחיר ללקוח
            SendEmail(customerEmail, "תזכורת להצעת מחיר", "נשמח לשמוע ממך בנוגע להצעת המחיר ששלחנו.");
        }

        private void SendEmail(string to, string subject, string body)
        {
            // כאן אתה יכול לממש את הקוד לשליחת המייל
            // תוכל להשתמש בספריית מיילים כמו System.Net.Mail או שירות דוא"ל חיצוני
            Console.WriteLine($"שליחת מייל לכתובת: {to}\nנושא: {subject}\nתוכן: {body}");
        }
    }

    class Programm
    {
        static void Main()
        {
            string customerEmail = "customer@example.com";

            PriceProposal priceProposal = new PriceProposal();
            priceProposal.SendPriceOffer(customerEmail);
        }
    }

}
