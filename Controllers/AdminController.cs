using Shop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Linq.Dynamic;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
namespace Shop.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        //public ActionResult Index()
        //{
        //        return View();    
           
        //}
        public ActionResult UserProfile()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            else if (User.IsInRole("Customers"))
            {
                return RedirectToAction("Index", "Home");
            }
            string userId = User.Identity.GetUserId();
            var emp = db.Employees.SingleOrDefault(i => i.UserId.Equals(userId));
            ViewBag.Employee = emp;
            ViewBag.UserId = userId;
            ViewBag.IdEmp = emp.Id;
            return View();
        }

        public ActionResult Product()
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
        public ActionResult Warehouse()
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
        public ActionResult Bill()
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
        public ActionResult Report()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            else if (!User.IsInRole("Manager")||User.IsInRole("Admin"))
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        public ActionResult Blog()
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

    }
}