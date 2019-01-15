using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Shop.Models;
using System.Linq.Dynamic;
using System.Data.Entity;
using Newtonsoft.Json;

namespace Shop.Controllers
{
    public class ProductController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        // GET: Product
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
        public ActionResult AddProduct(FormCollection form)
        {
            try
            {
                int gender = int.Parse(form["radio"]);
                int categoryId = int.Parse(form["ValueParentCategory"]);
                string productName = Convert.ToString(form["ProductName"]);
                string productInfo = Convert.ToString(form["Description"]);
                double productPrice = double.Parse(form["NewPrice"]);
                int statusProduct = int.Parse(form["statusProduct"]);
                Product product = new Product
                {
                    CategoryId = categoryId,
                    ProductName = productName,
                    Description = productInfo,
                    NewPrice = productPrice,
                    DateCreate = DateTime.Now,
                    Status = statusProduct
                };
                db.Products.Add(product);
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    HttpPostedFileBase file = Request.Files[i];
                    if (file.FileName != "" && file.FileName != null)
                    {
                        var fileName = DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + Path.GetFileName(file.FileName);
                        var orginalDirectory = new DirectoryInfo(Server.MapPath("~/Upload/Image"));
                        string pathString = Path.Combine(orginalDirectory.ToString(), "");
                        var path = string.Format("{0}\\{1}", pathString, fileName);
                        file.SaveAs(path);
                        FileAttach fileimg = new FileAttach
                        {
                            ProductId = product.Id,
                            ImageLink = "Upload/Image/" + fileName.ToString(),
                            DateCreate = DateTime.Now,
                            Status = 1
                        };
                        db.FileAttaches.Add(fileimg);
                    }
                }
                db.SaveChanges();
                return Json(new { success = true, mess = "Thêm sản phẩm " + productName + " thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpPost]
        public ActionResult LoadDataTable(int? gender, int? category)
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
            var listProduct = db.GetListProduct(null, gender, category).ToList();

            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<GetListProduct_Result> listSearch = listProduct.FindAll(l => l.ProductName.ToLower().Contains(searchvalue.ToLower()) == true);
                listProduct = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listProduct = listProduct.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listProduct.Count();
            var data = listProduct.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetInfoProductById(int id)
        {
            try
            {
                var product = db.GetListProduct(id, null, null);
                return Json(product, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult UpdateProduct(FormCollection form)
        {
            try
            {
                int Id = int.Parse(form["Id"]);
                string productName = Convert.ToString(form["ProductName"]);
                string productInfo = Convert.ToString(form["Description"]);
                double productPrice = double.Parse(form["NewPrice"]);
                int statusProduct = int.Parse(form["statusProduct_change"]);
                var listimg = form["listimgdelete"].ToString();
                var listimgdelete = JsonConvert.DeserializeObject<dynamic>(listimg);
                Product product = db.Products.Single(p => p.Id == Id);
                product.ProductName = productName;
                product.OldPrice = product.NewPrice;
                product.NewPrice = productPrice;
                product.Description = productInfo;
                product.Status = statusProduct;
                product.DateUpdate = DateTime.Now;
                foreach (int item in listimgdelete)
                {
                    FileAttach fi = new FileAttach { Id = item };
                    db.Entry(fi).State = EntityState.Deleted;

                }
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    HttpPostedFileBase file = Request.Files[i];

                    var fileName = DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + Path.GetFileName(file.FileName);
                    var orginalDirectory = new DirectoryInfo(Server.MapPath("~/Upload/Image"));
                    string pathString = Path.Combine(orginalDirectory.ToString(), "");
                    var path = string.Format("{0}\\{1}", pathString, fileName);
                    file.SaveAs(path);
                    FileAttach fileimg = new FileAttach
                    {
                        ProductId = product.Id,
                        ImageLink = "Upload/Image/" + fileName.ToString(),
                        DateCreate = DateTime.Now,
                        Status = 1
                    };
                    db.FileAttaches.Add(fileimg);
                }
                db.SaveChanges();
                return Json(new { success = true, mess = "Cập nhật thông tin sản phẩm " + productName + " thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public ActionResult DeleteProduct(int id)
        {
            try
            {
                var product = db.Products.Single(p => p.Id == id && p.Status==1);
                if (product != null)
                {
                    bool ckeckkho = true;
                    foreach (var item in product.Warehouses)  // Xóa line trong kho
                    {
                        if (item.NumberOrder > 0)
                        {
                            ckeckkho = false;
                        }
                    }
                    if(ckeckkho== false && User.IsInRole("Employee"))
                    {
                        return Json(new { success = false, mess = "Sản phẩm đang được order đơn hàng nên không thể xóa" }, JsonRequestBehavior.AllowGet);
                    }
                    product.Status = 0;
                    foreach (var item in product.FileAttaches) // Xóa file 
                    {
                        item.Status = 0;
                    }
                    foreach (var item in product.Warehouses)  // Xóa line trong kho
                    {
                        item.Status = 0;
                    }
                    db.SaveChanges();
                    return Json(new { success = true, mess = "Đã xóa thành công " + product.ProductName }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false,mess= "Không còn tồn tại sản phẩm" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

    }
}