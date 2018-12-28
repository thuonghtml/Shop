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
        public ActionResult Index()
        {
            //if (User.IsInRole("Admin"))
            var A = User.Identity.GetUserId();
                return View();    
           
        }
        public ActionResult UserProfile()
        {                                  
            return View();
        }

        public ActionResult Product()
        {
            return View();
        }
        public ActionResult Warehouse()
        {
            return View();
        }
        public ActionResult Bill()
        {
            return View();
        }
        public ActionResult Report()
        {
            return View();
        }
        public ActionResult Blog()
        {
            return View();
        }

    }
}