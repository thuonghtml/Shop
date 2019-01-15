using Shop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Linq.Dynamic;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Data.Entity;
using System.IO;

namespace Shop.Controllers
{
    public class CouponController : Controller
    {
        // GET: Coupon
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
            else if (User.IsInRole("Employee"))
            {
                return RedirectToAction("Index", "Bill");
            }
            return View();
        }
        [HttpPost]
        public ActionResult LoadDataTable()
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
            db.Configuration.ProxyCreationEnabled = false;
            var listCoupon = db.Coupons.Where(e => e.Status == 1).ToList();
            db.Configuration.ProxyCreationEnabled = true;

            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<Coupon> listSearch = listCoupon.FindAll(l => l.CouponCode.ToLower().Contains(searchvalue.ToLower()) == true);
                listCoupon = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listCoupon = listCoupon.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listCoupon.Count();
            var data = listCoupon.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult CreateOrUpdate(FormCollection form)
        {
            try
            {
                int Id = -1;
                if (Convert.ToString(form["Id"]) != "")
                {
                    Id = int.Parse(form["Id"]);
                }

                int typeChange = int.Parse(form["typeChange"]);
                string couponcode = Convert.ToString(form["CouponCode"]);
                DateTime datebegin = Convert.ToDateTime(form["DateBegin"]);
                DateTime dateend = Convert.ToDateTime(form["DateEnd"]);
                int quantity = int.Parse(form["Quantity"]);
                int quantityRemainiing = int.Parse(form["QuantityRemaining"]);
                double price = Convert.ToDouble(form["Price"]);
                if (typeChange == 1)
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    var cou = db.Coupons.SingleOrDefault(e => e.CouponCode.Equals(couponcode) && e.Status == 1);
                    db.Configuration.ProxyCreationEnabled = true;
                    if (cou == null)
                    {
                        Coupon coupon = new Coupon
                        {
                            CouponCode = couponcode,
                            DateBegin = datebegin,
                            DateEnd = dateend,
                            Quantity = quantity,
                            QuantityRemaining = quantityRemainiing,
                            Status = 1,
                            DateCreate = DateTime.Now,
                            Price = price
                        };
                        db.Coupons.Add(coupon);
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã thêm coupon thành công!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, mess = "Coupon đã tồn tại!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    Coupon coupon = db.Coupons.Single(c => c.CouponCode.Equals(couponcode) && c.Id == Id && c.Status == 1);
                    if (coupon != null)
                    {
                        coupon.DateBegin = datebegin;
                        coupon.DateEnd = dateend;
                        coupon.Quantity = quantity;
                        coupon.QuantityRemaining = quantityRemainiing;
                        coupon.Price = price;
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã cập nhật coupon thành công!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, mess = "Coupon không còn tồn tại!" }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult GetInfoCoupon(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var coupon = db.Coupons.SingleOrDefault(e => e.Id == id);
                db.Configuration.ProxyCreationEnabled = true;
                return Json(coupon, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult Delete(int id)  
        {
            try
            {

                var coupon = db.Coupons.Single(e => e.Id == id && e.Status == 1);
                if (coupon != null)
                {        
                    coupon.Status = 0;
                    db.SaveChanges();
                    return Json(new { success = true, mess = "Đã xóa thành công " + coupon.CouponCode }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, mess = "Coupon không còn tồn tại!" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

}