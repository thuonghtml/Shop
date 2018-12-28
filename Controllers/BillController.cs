using Shop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using System.Web.Mvc;


namespace Shop.Controllers
{
    public class BillController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        // GET: Bill
        public ActionResult Index()
        {
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
                                                                            l.PhoneNumber.ToLower().Contains(searchvalue.ToLower())==true    ||
                                                                            l.Email.ToLower().Contains(searchvalue.ToLower())==true);
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
    }
}