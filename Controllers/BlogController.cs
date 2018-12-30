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
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace Shop.Controllers
{
    public class BlogController : Controller
    {
        // GET: Blog
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        public ActionResult Index()
        {
            ViewBag.Tag = new SelectList(db.MasterDatas.Where(u => u.Table.Equals("Blog")).ToList(), "Id", "Description");
            return View();
        }
        [HttpPost,ValidateInput(false)]
        public ActionResult Create (FormCollection form)
        {
            try
            {

                string blogname = Convert.ToString(form["BlogName"]);
                string content = Convert.ToString(form["Content"]);
                int tag = int.Parse(form["Tag"]);
                Blog blog = new Blog
                {
                    BlogName = blogname,
                    Content = content,
                    Tag = tag,
                    TimeCreate = DateTime.Now,
                    Status = 1
                };
                if (User.Identity.IsAuthenticated)
                {
                    string userid = User.Identity.GetUserId();
                    var emp = db.Employees.SingleOrDefault(e => e.UserId == userid);
                    blog.EmpployeeCreate = emp.Id;
                }
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
                        blog.Photo = "Upload/Image/" + fileName.ToString();
                    }
                }
                db.Blogs.Add(blog);
                db.SaveChanges();
                return Json(new { success = true, mess = "Thêm blog thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

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
            var listBlog = db.GetListBlog(null,1).ToList();

            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<GetListBlog_Result> listSearch = listBlog.FindAll(l => l.BlogName.ToLower().Contains(searchvalue.ToLower()) == true);
                listBlog = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listBlog = listBlog.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listBlog.Count();
            var data = listBlog.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Delete(int id)
        {
            try
            {
                var blog = db.Blogs.Single(p => p.Id == id);
                if (blog != null)
                {
                    blog.Status = 0;    
                    db.SaveChanges();
                    return Json(new { success = true, mess = "Đã xóa thành công " + blog.BlogName }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public ActionResult GetInfoBlog(int Id)
        {
            try
            {
                var listBlog = db.GetListBlog(Id, 1).Single(m=>m.Id == Id);
                return Json(listBlog, JsonRequestBehavior.AllowGet);
            }
            catch  (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost, ValidateInput(false)]
        public ActionResult UpdateBlog(FormCollection form)
        {
            try
            {
                int Id = int.Parse(form["Id"]);
                string blogName = Convert.ToString(form["BlogName"]);
                int tag = int.Parse(form["Tag"]);
                string content = Convert.ToString(form["content_change"]);
                
                Blog blog = db.Blogs.Single(p => p.Id == Id);
                blog.BlogName = blogName;
                blog.Content = content;
                blog.Tag = tag;
               
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    HttpPostedFileBase file = Request.Files[i];

                    var fileName = DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + Path.GetFileName(file.FileName);
                    var orginalDirectory = new DirectoryInfo(Server.MapPath("~/Upload/Image"));
                    string pathString = Path.Combine(orginalDirectory.ToString(), "");
                    var path = string.Format("{0}\\{1}", pathString, fileName);
                    file.SaveAs(path);


                    blog.Photo = "Upload/Image/" + fileName.ToString();
                       
                    
                }
                db.SaveChanges();
                return Json(new { success = true, mess = "Cập nhật thông tin sản phẩm " + blogName + " thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}