using Shop.Models;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Shop.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        public ActionResult Index()
        {
            dynamic modelMain = new ExpandoObject();
            modelMain.GetProductInMain = db.GetProductInMain();
            modelMain.Blog = 2;
            return View(modelMain);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult ShopingCart()
        {
            return View();
        }
        public ActionResult Blog()
        {
            return View();
        }
        public ActionResult Blog_Detail()
        {
            return View();
        }
        [HttpGet]
        public ActionResult GetProductByIdModal(int? id) // Render Content Product Home use partialview
        {
            try
            {
                var product = db.GetInfoProductById(id).First();
                 ViewBag.Data = product;
                return PartialView();
            }
            catch (Exception ex)
            {
                return Json(new { success = false, result = ex }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
// Nguyễn Minh Thương 111