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
using Microsoft.AspNet.Identity;
//using System.Dynamic.ExpandoObject;
namespace Shop.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();

        public ActionResult Index()
        {
            ViewBag.CartCount = 0;
            if (Session["Cart"] != null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
            dynamic modelMain = new ExpandoObject();
            ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
            modelMain.GetProductInMain = db.GetProductInMain(1);
            modelMain.Blog = 2;
            return View(modelMain);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            ViewBag.CartCount = 0;
            ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
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
            ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
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
            ViewBag.UserLogin = User.Identity.IsAuthenticated;
            ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
            List<Cart> lstCart = Session["Cart"] as List<Cart>;
            if (lstCart != null)
            {
                ViewBag.CartCount = lstCart.Count;
            }
            ViewBag.ShopCart = lstCart;
            return View();
        }
        public ActionResult Blog()
        {
            ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
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
            ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
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
        public ActionResult Shop(int type)
        {
            ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
            ViewBag.CartCount = 0;
            if (Session["Cart"] != null)
            {
                List<Cart> list = Session["Cart"] as List<Cart>;
                ViewBag.CartCount = list.Count;
            }
            var lstFeatured = db.GetFeaturedProducts(type);
            ViewBag.Featured = lstFeatured;
            ViewBag.Type = type;
            return View();
        }
        public ActionResult Details(int id)
        {
            try
            {
                ViewBag.Menu = db.MasterDatas.Where(m => m.Table == "Category");
                ViewBag.CartCount = 0;
                if (Session["Cart"] != null)
                {
                    List<Cart> list = Session["Cart"] as List<Cart>;
                    ViewBag.CartCount = list.Count;
                }
                var product = db.GetInfoProductById(id).First();
                return View(product);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public ActionResult GetProductCategoryId(int? categoryId, int? page)
        {
            IQueryable<GetProductInMain_Result> listproduct = db.GetProductInMain(categoryId).AsQueryable();
            int pageSize = 12;
            int pageNumber = page ?? 1;
            ViewBag.Type = categoryId;
            return PartialView(listproduct.ToList().ToPagedList(pageNumber, pageSize));
        }
        public ActionResult AddToCart(int productId, string color, string size, int number)
        {
            List<Cart> lstCart = new List<Cart>();
            var Info_Product = db.GetInfoProductCart(productId, size, color).First();

            if (Session["Cart"] == null) // Nếu giỏ hàng chưa có sản phẩm
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
                lstCart = Session["Cart"] as List<Cart>;
                if (lstCart.Count == 0)
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
        [HttpPost]
        public ActionResult UpdateCart(List<Cart> list)      // kiểm tra số lượng của product id trong kho
        {
            try
            {
                string thongbao = "";
                if(list != null)
                {
                    foreach (Cart item in list)
                    {
                        string color = item.Color == "" ? null : item.Color;
                        string size = item.Size == "" ? null : item.Size;
                        var warehouse = db.Warehouses.Single(w => w.ProductId == item.ProductId && w.Size == size && w.Color == color && w.Status == 1);
                        if (warehouse != null)
                        {
                            if (warehouse.NumberOfRemaining < item.Number)
                            {
                                thongbao += "Số lượng sản phẩm: " + item.ProductName + ", Size: " + item.Size + ", Color: " + item.Color + " chỉ còn lại " + warehouse.NumberOfRemaining.ToString() + " sản phẩm ";
                            }

                        }
                        else
                        {
                            thongbao += "Sản phẩm: " + item.ProductName + " không còn tồn tại trong kho <br/>";
                        }

                    }
                }  
                if (thongbao.Length > 0)
                {
                    thongbao += ". Bạn vui lòng cập nhât lại giỏ hàng cho phù hợp!";
                    return Json(new { success = false, mess = thongbao }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Session["Cart"] = list;
                    if (list != null)
                    {
                        return Json(new { success = true, listbegin = list, listchange = list, count = list.Count }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = true, count = 0 }, JsonRequestBehavior.AllowGet);
                    }
                } 
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public ActionResult getInfoCustomer()
        {

            var UserId = User.Identity.GetUserId();
            if (User.IsInRole("Customers"))
            {
                db.Configuration.ProxyCreationEnabled = false;
                var customer = db.Customers.Single(e => e.Status == 1 && e.UserId == UserId);
                db.Configuration.ProxyCreationEnabled = true;
                if (customer != null)
                {
                    return Json(new { success = true, type = "Customer", data = customer }, JsonRequestBehavior.AllowGet);
                }
                else return Json(new { success = false }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                db.Configuration.ProxyCreationEnabled = false;
                var emp = db.Employees.Single(e => e.Status == 1 && e.UserId == UserId);
                db.Configuration.ProxyCreationEnabled = true;
                if (emp != null)
                {
                    return Json(new { success = true, type = "Employee", data = emp }, JsonRequestBehavior.AllowGet);
                }
                else return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }
        [HttpPost]
        public ActionResult Buy(FormCollection form)
        {
            try
            {
                string fullname = Convert.ToString(form["CustomerName"]);
                string phone = Convert.ToString(form["PhoneNumber"]);
                string address = Convert.ToString(form["Address"]);
                string email = Convert.ToString(form["Email"]);
                string note = Convert.ToString(form["Note"]);
                string UserId = User.Identity.GetUserId();
                string CouponCode = Convert.ToString(form["CouponCode"]);
                double priceCoupon = Convert.ToDouble(form["PriceCoupon"]);
                Bill bill = new Bill
                {
                    //CustomerId = customer.Id,
                    CustomerName = fullname,
                    PhoneNumber = phone,
                    Address = address,
                    Email = email,
                    Note = note,
                    DateCreate = DateTime.Now,
                    Status = 1
                    
                };
                List<Cart> list = Session["Cart"] as List<Cart>;
                double total = 0; int number = 0;
                foreach (Cart item in list)
                {
                    number += item.Number;
                    total += item.IntoMoney;
                    BillDetail billDetail = new BillDetail
                    {
                        ProductId = item.ProductId,
                        ProductName = item.ProductName,
                        Size = item.Size,
                        Color = item.Color,
                        Quantity = item.Number,
                        Price = item.Price,
                        ToMoney = item.IntoMoney,
                        Status = 1
                    };
                    bill.BillDetails.Add(billDetail);
                }
                bill.Total = total;
                bill.NumberOfProduct = number;
                // trừ số lượng coupon
                Coupon coupon = db.Coupons.FirstOrDefault(c => c.CouponCode.Equals(CouponCode) && c.Status == 1);
                if(coupon!= null && coupon.QuantityRemaining > 1)
                {
                    coupon.QuantityRemaining -= 1;
                    bill.CouponCode = CouponCode;
                    bill.Total = total - priceCoupon;
                } 
                if (User.IsInRole("Customers"))// Nếu là khách hàng thì update thông tin khách hàng
                {
                    var customer = db.Customers.Single(c => c.UserId == UserId);
                    bill.CustomerId = customer.Id;
                }
                else
                {
                    var empoyee = db.Employees.Single(c => c.UserId == UserId);
                    bill.EmployeeId = empoyee.Id;
                }
                db.Bills.Add(bill);
                db.SaveChanges();
                Warehouse warehouse;
                foreach (Cart item in list)
                {
                    warehouse = null;
                    string color = item.Color == "" ? null : item.Color;
                    string size = item.Size == "" ? null : item.Size;
                    warehouse = db.Warehouses.Single(w => w.ProductId == item.ProductId && w.Size == size && w.Color == color && w.Status == 1);
                    warehouse.NumberOfRemaining -= item.Number;
                    warehouse.NumberOrder += item.Number;
                    db.SaveChanges();
                }

                Session["Cart"] = null;
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        [HttpPost]
        public ActionResult GetCoupon(string code)
        {
            try
            {
                Coupon coupon = db.Coupons.FirstOrDefault(c => c.CouponCode.Equals(code) && c.Status==1 && c.DateBegin<=DateTime.Now && c.DateEnd>= DateTime.Now);
                if(coupon != null)
                {
                      if(coupon.QuantityRemaining > 0)
                    {
                        return Json(new { success = true, price = coupon.Price, couponCode = code });
                    }
                      else
                    {
                        return Json(new { success = false, mess="Số lượng coupon đã hết!" });
                    }
                }
                else
                {
                    return Json(new { success = false, mess = "Mã coupon không đúng!" });
                }
            }
            catch  (Exception ex)
            {
                throw ex;
            }
        }
    }
}
// Nguyễn Minh Thương 111