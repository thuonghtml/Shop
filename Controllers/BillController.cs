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
    public class BillController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        // GET: Bill
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
            ViewBag.BillStatus = db.MasterDatas.Where(m => m.Table == "Bill");
            return View();
        }
        [HttpPost]
        public ActionResult LoadDataTable(int? status)
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
            var listBill = db.GetListBill(status).ToList();

            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<GetListBill_Result> listSearch = listBill.FindAll(l => l.CustomerName.ToLower().Contains(searchvalue.ToLower()) == true ||
                                                                            l.PhoneNumber.ToLower().Contains(searchvalue.ToLower()) == true ||
                                                                            l.Email.ToLower().Contains(searchvalue.ToLower()) == true);
                listBill = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listBill = listBill.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listBill.Count();
            var data = listBill.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Create()
        {
            return View();
        }

        public ActionResult GetProdutByGender(int gender)
        {
            try
            {
                var result = db.Products.Where(p => p.Status == 1 && p.Category.Gender == gender && p.Category.Status == 1).Join(db.Warehouses.Where(w => w.Status == 1), p => p.Id, w => w.ProductId, (p, w) => p).Select(p => new { id = p.Id, text = p.ProductName }).Distinct().ToList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult GetSizeAndColor(int productid)
        {
            try
            {
                var size = db.Warehouses.Where(p => p.Status == 1 && p.ProductId == productid).Select(p => new { size = p.Size }).Distinct();
                var color = db.Warehouses.Where(p => p.Status == 1 && p.ProductId == productid).Select(p => new { color = p.Color }).Distinct();
                return Json(new { size = size, color = color }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ActionResult AddBillDetails(int productid, string size, string color, int number, int key)
        {
            var Info_Product = db.GetInfoProductCart(productid, size, color).First();
            if (Info_Product != null)
            {
                if (Info_Product.NumberOfRemaining - number < 0)// Nếu số lượng trong kho không đủ cho số lượng order
                {
                    return Json(new { success = false, mess = "Model còn lại số lượng là " + Info_Product.NumberOfRemaining.ToString() + " nên chỉ có thể order nhỏ hơn hoặc bằng !" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var cart = new Cart
                    {
                        Key = key,
                        ProductId = productid,
                        ProductName = Info_Product.ProductName,
                        Size = size,
                        Color = color,
                        Number = number,
                        Price = Info_Product.NewPrice.Value,
                        IntoMoney = Info_Product.NewPrice.Value * number
                    };
                    return Json(new { success = true, billdetails = cart, mess = "Thêm thành công" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new { success = false, mess = "Model không có trong kho vì màu hoặc size không phù hợp nhau!" }, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult BillDetail(int id)
        {
            ViewBag.BillStatus = db.MasterDatas.Where(m => m.Table == "Bill");
            Bill bill = db.Bills.SingleOrDefault(b => b.Id == id);
            return View(bill);
        }

        public ActionResult UpdateBillStaus(int id, int status)
        {
            try
            {   
                var bill = db.Bills.SingleOrDefault(b => b.Id == id);
                if (status == 0)       // Hủy đơn hàng
                {
                    foreach (BillDetail details in bill.BillDetails)
                    {
                        Warehouse warehouse = db.Warehouses.Single(w => w.ProductId == details.ProductId && w.Size == details.Size && w.Color == details.Color && w.Status == 1);
                        if (warehouse != null)
                        {
                            warehouse.NumberOrder -= details.Quantity;
                            warehouse.NumberOfRemaining += details.Quantity;
                            db.SaveChanges();
                        }
                    }
                    bill.Status = status;
                    db.SaveChanges();
                    return Json(new { success = true, mess = "Đã hủy đơn hàng thành công!" }, JsonRequestBehavior.AllowGet);
                }
                else if (status == 2)// Xác nhận đơn hàng
                {
                    foreach (BillDetail details in bill.BillDetails)
                    {
                        Warehouse warehouse = db.Warehouses.SingleOrDefault(w => w.ProductId == details.ProductId && w.Size == (details.Size==""?null:details.Size) && w.Color == (details.Color==""?null:details.Color) && w.Status == 1);
                        if (warehouse != null)
                        {
                            warehouse.NumberOrder = warehouse.NumberOrder - details.Quantity;
                            db.SaveChanges();
                        }
                    }
                    bill.Status = status;
                    if (User.Identity.IsAuthenticated)
                    {
                        var userid = User.Identity.GetUserId();
                        var emp = db.Employees.SingleOrDefault(e => e.UserId == userid);
                        bill.EmployeeConfirm = emp.Id;
                    }
                    bill.DateConfirmed = DateTime.Now;
                    db.SaveChanges();
                    Mailer(bill.Email, id);
                    return Json(new { success = true, mess = "Đã xác nhận đơn hàng thành công!" }, JsonRequestBehavior.AllowGet);
                }
                else if (status == 3)
                {
                    bill.Status = status;
                    db.SaveChanges();
                    return Json(new { success = true, mess = "Đã cập nhật đơn hàng đã giao thành công!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, mess = "Trạng thái cập nhật không hợp lệ!" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public void Mailer(string Email, int id)
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
                msg.Subject = "Thông tin đơn hàng !";
                msg.IsBodyHtml = true;
                //msg.Body += "<h1>Trung tâm quản lý người dùng.</h1>";
                ////msg.Body += "<h3> http://" + WebConfigurationManager.AppSettings["domain"].ToString() + "</h3>";
                //msg.Body += "Bạn vừa đăng ký sử dụng hệ thống web GIS.<br/>";
                //msg.Body += "<br/>Tên đăng nhập của bạn là: <b>" + TaiKhoan + "</b>";
                //msg.Body += "<br/><br/>Mật khẩu của bạn là: <b>" + MatKhau + "</b><br/>";
                //msg.Body += "<hr/>Bạn nên đổi mật khẩu.";
                msg.Body = db.BodyMailBill(id).Single().ToString();

                smtp.Send(msg);  
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}

