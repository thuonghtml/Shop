using Shop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Net.Configuration;
using System.Configuration;
using System.Net.Mail;
using System.Net;
using System.Web.Configuration;
using System.Data.Entity.SqlServer;
using System.Data.SqlClient;
using System.Data;

namespace Shop.Controllers
{
    public class ReportController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        // GET: Report
        public ActionResult Revenue()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            else if (!User.IsInRole("Admin")||!User.IsInRole("Manager"))
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        public ActionResult DataChart(string date, int type)
        {
            try
            {
                DateTime day = Convert.ToDateTime(date);
                var data = db.Revenue(day, type);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}