using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Shop.Models;
using System.Linq.Dynamic;
using DataTables.Mvc;

namespace Shop.Controllers
{
    public class CategoryController : Controller
    {
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        // GET: Category
        public ActionResult Category()
        {
            return View();
        }
        public ActionResult GetCategories(int? gender )
        {
            var catagories = db.GetCategoryWithGender(gender);
            if (catagories != null)
            {
                return Json(catagories, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }
        [HttpPost]
        public ActionResult LoadDataTable(int? gender )
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
            var listCategory = db.GetCategoryTable(gender).ToList();
        
            if(!(string.IsNullOrEmpty(searchvalue)))
            {
                List<GetCategoryTable_Result> listSearch = listCategory.FindAll(l => l.CategoryName.ToLower().Contains(searchvalue.ToLower()) == true );
                listCategory = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listCategory = listCategory.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listCategory.Count();
            var data = listCategory.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AddCategory(string parentId,string categoryName, int? gender)
        {
            try
            {
                Category cate = new Category
                {
                    CategoryName = categoryName
                    , ParentId = parentId
                    , Gender = gender
                    , Status = 1
                    , Products = null
                };
                db.Categories.Add(cate);
                db.SaveChanges();
                return Json("Thêm loại: "+categoryName+" thành công!!!" , JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json( ex , JsonRequestBehavior.AllowGet);
            }
           
        }

        [HttpGet]
        public ActionResult DeleteCategory(int categoryId)
        {
            try
            {
                var category = db.Categories.SingleOrDefault(c => c.Id == categoryId);
                if (category != null)
                {
                    category.Status = 0;
                    List<Category> lstChild = db.Categories.Where(c => c.ParentId == categoryId.ToString()).ToList();
                    if (lstChild.Count > 0)
                    {
                        for (int i = 0; i < lstChild.Count; i++)
                        {
                            lstChild[i].Status = 0;
                        }
                    }
                    db.SaveChanges();
                }
                return Json("Xóa thành công:" + category.CategoryName + " !", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("Xóa thất bại! -- Lỗi:" +ex+ " !", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetCategoryById(int CategoryId)
        {
            try
            {
                var category = db.GetInfoCategoryById(CategoryId);
                return Json(category, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public ActionResult UpdateCategoryById (int Id, string parentId, string categoryName, int? gender)
        {
            try
            {
                Category cate = db.Categories.First(c=>c.Id== Id);
                if (cate != null)
                {
                    cate.ParentId = parentId;
                    cate.CategoryName = categoryName;
                    cate.Gender = gender;
                    db.SaveChanges();
                    return Json(new { success = true, obj = cate }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}