using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Linq.Dynamic;
using System.Net;
using System.Net.Configuration;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using Shop.Models;

namespace Shop.Controllers
{
    public class ContactController : Controller
    {
        // GET: Contact
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();

        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            else if (User.IsInRole("Customers"))
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        [HttpPost]
        public ActionResult Create(FormCollection form)
        {
            try
            {
                string email = Convert.ToString(form["Email"]);
                string mess = Convert.ToString(form["Message"]);
                Conversation conversation = new Conversation
                {
                    Email = email,
                    Message = mess,
                    Status = true,
                    DateCreate = DateTime.Now
                };
                db.Conversations.Add(conversation);
                db.SaveChanges();
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult LoadDataTable(int? gender, int? categoryId, int? productId)
        {
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            var start = Request.Form.GetValues("start").FirstOrDefault();
            var length = Request.Form.GetValues("length").FirstOrDefault();
            string searchvalue = Request.Form.GetValues("search[value]").FirstOrDefault();
            var sortColumn = Request.Form.GetValues("columns[" + Request.Form.GetValues("order[0][column]").FirstOrDefault() + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            int pageSize = length != null ? Convert.ToInt32(length) : 0;
            int skip = start != null ? Convert.ToInt32(start) : 0;
            int recordsTotal = 0;
            var listWarehouse = db.Conversations.Where(c => c.Status == true).ToList();

            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<Conversation> listSearch = listWarehouse.FindAll(l => l.Email.ToLower().Contains(searchvalue.ToLower()) == true);
                listWarehouse = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listWarehouse = listWarehouse.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listWarehouse.Count();
            var data = listWarehouse.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult Reply(FormCollection form)
        {
            try
            {
                int id = int.Parse(form["Id"]);
                string mess = Convert.ToString(form["Message"]);  
                var conver = db.Conversations.Single(c => c.Id == id);
                Mailer(conver.Email, mess);
                conver.Status = false;
                db.SaveChanges();
                return Json(new { success = true, data = "Đã trả lời thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = ex }, JsonRequestBehavior.AllowGet);
            }
           
        }
        public void Mailer(string Email, string mess)
        {
            try
            {

                var smtpSection = (SmtpSection)ConfigurationManager.GetSection("system.net/mailSettings/smtp");
                string strHost = smtpSection.Network.Host;
                int port = smtpSection.Network.Port;
                string strUserName = smtpSection.Network.UserName;
                string strFromPass = smtpSection.Network.Password;
                SmtpClient smtp = new SmtpClient(strHost, port);
                NetworkCredential cert = new NetworkCredential(strUserName, strFromPass);
                smtp.Credentials = cert;
                smtp.EnableSsl = true;
                MailMessage msg = new MailMessage(smtpSection.From, Email);
                msg.Subject = "Coza Store!";
                msg.IsBodyHtml = true;
                msg.Body = mess;     
                smtp.Send(msg);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}