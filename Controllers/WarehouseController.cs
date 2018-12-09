using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Shop.Models;

namespace Shop.Controllers
{
    public class WarehouseController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        // GET: Warehouse
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {
            return View();
        }
        public JsonResult GetProductByCategoryId(int id)
        {
            var result = db.Products.Where(p => p.CategoryId == id && p.Status == 1).Select(p => new { id = p.Id, text = p.ProductName }).ToList();
            //JsonSerializerSettings jss = new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore };
            //var result = JsonConvert.SerializeObject(data, Formatting.Indented, jss);
            //return Json(result, JsonRequestBehavior.AllowGet);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AddWarehouse(FormCollection form)
        {
            try
            {
                int productId = int.Parse(form["ProductId"]);
                string size = Convert.ToString(form["Size"]);
                double price = Convert.ToDouble(form["InputPrice"]);
                int numberImport = int.Parse(form["NumberOfImport"]);
                int numberOfRemaining = int.Parse(form["NumberOfRemaining"]);
                var product = db.Products.Where(p => p.Id == productId && p.Status == 1).Select(p => new { p.Id, p.ProductName }).ToList();
                if (product.Count == 0)
                {
                    return Json(new { success = false, mess = "Sản phẩm không tồn tại hoặc đã xóa!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Warehouse ware = db.Warehouses.FirstOrDefault(w => w.ProductId == productId && w.Size.Contains(size));
                    if (ware == null) // nếu chưa tồn tại sản phẩm có cùng size
                    {
                        Warehouse warehouse_add = new Warehouse
                        {
                            ProductId = productId,
                            Size = size,
                            InputPrice = price,
                            NumberOfImport = numberImport,
                            NumberOfRemaining = numberOfRemaining,
                            Status = 1,
                            DateCreate = DateTime.Now
                        };
                        db.Warehouses.Add(warehouse_add);
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Nhập kho sản phẩm: "+ product[0].ProductName+" thành công!!!" }, JsonRequestBehavior.AllowGet);
                    }
                    else // Đã tồn tại sản phẩm có cùng size
                    {
                        return Json(new { success = false, mess = "Sản phẩm: " + product[0].ProductName + " trong kho đã có size "+ size+". Bạn vui lòng cập nhật sản phẩm ở phần cập nhật kho! " }, JsonRequestBehavior.AllowGet);
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ActionResult LoadDataTable(int? gender, int? categoryId)
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
            var listWarehouse = db.GetListWarehouse(null,null,categoryId,gender).ToList();

            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<GetListWarehouse_Result> listSearch = listWarehouse.FindAll(l => l.ProductName.ToLower().Contains(searchvalue.ToLower()) == true);
                listWarehouse = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listWarehouse = listWarehouse.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listWarehouse.Count();
            var data = listWarehouse.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }

    }

}