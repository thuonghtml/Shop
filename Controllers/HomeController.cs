using Shop.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using PagedList;
using PagedList.Mvc;
namespace Shop.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        public ActionResult Index()
        {
            ViewBag.CartCount = 0;
            if(Session["Cart"]!= null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
            dynamic modelMain = new ExpandoObject();
            modelMain.GetProductInMain = db.GetProductInMain(null);
            modelMain.Blog = 2;
            return View(modelMain);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            ViewBag.CartCount = 0;
            if (Session["Cart"] != null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            ViewBag.CartCount = 0;
            if (Session["Cart"] != null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
            return View();
        }
        public ActionResult ShopingCart()
        {
            ViewBag.CartCount = 0;      
            List<Cart> lstCart = Session["Cart"] as List<Cart>;
            if(lstCart != null)
            {
                ViewBag.CartCount = lstCart.Count;
            }
            ViewBag.ShopCart = lstCart;
            return View();
        }
        public ActionResult Blog()
        {
            ViewBag.CartCount = 0;
            if (Session["Cart"] != null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
            return View();
        }
        public ActionResult Blog_Detail()
        {
            ViewBag.CartCount = 0;
            if (Session["Cart"] != null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
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
        public ActionResult Shop()
        {
            ViewBag.CartCount = 0;
            if (Session["Cart"] != null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
            return View();
        }
        public ActionResult GetProductCategoryId(int? categoryId, int?page)
        {
            IQueryable<GetProductInMain_Result> listproduct = db.GetProductInMain(categoryId).AsQueryable();
            int pageSize = 12;
            int pageNumber = page ?? 1;
            return PartialView(listproduct.ToList().ToPagedList(pageNumber,pageSize));
        }
        public ActionResult AddToCart(int productId, string color, string size, int number)
        {
            List<Cart> lstCart = new List<Cart>();
            var Info_Product = db.GetInfoProductCart(productId, size, color).First();
            
            if (Session["Cart"] == null ) // Nếu giỏ hàng chưa có sản phẩm
            {     
                if(Info_Product.NumberOfRemaining - number < 0)// Nếu số lượng trong kho không đủ cho số lượng order
                {
                    return Json(new { success = false, mess = "Model còn lại số lượng là "+Info_Product.NumberOfRemaining.ToString()+" nên chỉ có thể order nhỏ hơn hoặc bằng !" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    lstCart.Add(new Cart
                    {
                        Key = 1,
                        ProductId = productId,
                        Price = Info_Product.NewPrice.Value,
                        Photo = Info_Product.ImageLink,
                        Color = color,
                        Size = size,
                        ProductName = Info_Product.ProductName,
                        Number = number,
                        IntoMoney = number * Info_Product.NewPrice.Value
                    });
                    Session["Cart"] = lstCart;
                    return Json(new { success = true, mess = "Đã thêm vào giỏ hàng!", count = lstCart.Count }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                lstCart = Session["Cart"] as List<Cart>;
                if(lstCart.Count == 0)
                {
                    if (Info_Product.NumberOfRemaining - number < 0)// Nếu số lượng trong kho không đủ cho số lượng order
                    {
                        return Json(new { success = false, mess = "Model còn lại số lượng là " + Info_Product.NumberOfRemaining.ToString() + " nên chỉ có thể order nhỏ hơn hoặc bằng !" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        lstCart.Add(new Cart
                        {
                            Key = 1,
                            ProductId = productId,
                            Price = Info_Product.NewPrice.Value,
                            Photo = Info_Product.ImageLink,
                            Color = color,
                            Size = size,
                            ProductName = Info_Product.ProductName,
                            Number = number,
                            IntoMoney = number * Info_Product.NewPrice.Value
                        });
                        Session["Cart"] = lstCart;
                        return Json(new { success = true, mess = "Đã thêm vào giỏ hàng!", count = lstCart.Count }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    bool CheckTrung = false;
                    for (int i = 0; i < lstCart.Count; i++)
                    {
                        if (productId == lstCart[i].ProductId && color == lstCart[i].Color && size == lstCart[i].Size)
                        {
                            CheckTrung = true;
                            break;
                        }
                    }
                    if (CheckTrung) // Nếu đã tồn tại sản phầm trong giỏ hàng
                    {
                        return Json(new { success = false, mess = "Sản phẩm đã tồn tại trong giỏ hàng" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        if (Info_Product.NumberOfRemaining - number < 0)// Nếu số lượng trong kho không đủ cho số lượng order
                        {
                            return Json(new { success = false, mess = "Model còn lại số lượng là " + Info_Product.NumberOfRemaining.ToString() + " nên chỉ có thể order nhỏ hơn hoặc bằng !" }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            int key = lstCart[lstCart.Count - 1].Key + 1;
                            lstCart.Add(new Cart
                            {
                                Key = key,
                                ProductId = productId,
                                Price = Info_Product.NewPrice.Value,
                                Photo = Info_Product.ImageLink,
                                Color = color,
                                Size = size,
                                ProductName = Info_Product.ProductName,
                                Number = number,
                                IntoMoney = number * Info_Product.NewPrice.Value
                            });
                            Session["Cart"] = lstCart;
                            return Json(new { success = true, mess = "Đã thêm vào giỏ hàng!", count = lstCart.Count }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
                
            }
        }

        public ActionResult ViewCartRight()
        {
            try
            {
                List<Cart> lstCart = Session["Cart"] as List<Cart>;
                ViewBag.Cart = lstCart;
                return View();
            }
            catch (Exception ex)
            {
                return Json(new { success = false, result = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteRowCart(int key)
        {
            try
            {
                List<Cart> lstCart = Session["Cart"] as List<Cart>;
                lstCart.Remove(lstCart.Single(row => row.Key == key));
                double total = lstCart.Sum(item => item.Number * item.Price);
                return Json(new { success = true, count = lstCart.Count, total = total.ToString("#,##0") }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
           
        }
    }
}
// Nguyễn Minh Thương 111