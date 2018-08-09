﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Shop.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
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
    }
}
// Nguyễn Minh Thương 111