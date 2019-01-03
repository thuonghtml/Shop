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
    public class EmpAndCusController : Controller
    {
        // GET: EmpAndCus
        private STORE_DATABASEEntities db = new STORE_DATABASEEntities();
        [HttpPost]
        public ActionResult LoadTableEmployee()
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
            var listEmp = db.Employees.Where(e => e.Status == 1).ToList();
            db.Configuration.ProxyCreationEnabled = true;

            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<Employee> listSearch = listEmp.FindAll(l => l.EmployeeName.ToLower().Contains(searchvalue.ToLower()) == true);
                listEmp = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listEmp = listEmp.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listEmp.Count();
            var data = listEmp.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult LoadTableCustomer()
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
            var listEmp = db.Customers.Where(e => e.Status == 1).ToList();
            db.Configuration.ProxyCreationEnabled = true;
            if (!(string.IsNullOrEmpty(searchvalue)))
            {
                List<Customer> listSearch = listEmp.FindAll(l => l.CustomerName.ToLower().Contains(searchvalue.ToLower()) == true);
                listEmp = listSearch;
            }
            if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDir)))
            {
                listEmp = listEmp.OrderBy(sortColumn + " " + sortColumnDir).ToList();
            }
            recordsTotal = listEmp.Count();
            var data = listEmp.Skip(skip).Take(pageSize).ToList();

            return Json(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetInfoEmpOrCust(int? type, int id) // 1- Emp 2 - Cust
        {
            try
            {
                if (type == 1)
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    var emp = db.Employees.Single(e => e.Id == id);
                    db.Configuration.ProxyCreationEnabled = true;
                    return Json(emp, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    db.Configuration.ProxyCreationEnabled = true;
                    var cus = db.Customers.Single(e => e.Id == id);
                    db.Configuration.ProxyCreationEnabled = true;
                    return Json(cus, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult UpdateEmpOrCus(FormCollection form)
        {
            try
            {
                int Id = -1;
                if (Convert.ToString(form["Id"]) != "")
                {
                    Id = int.Parse(form["Id"]);
                }

                int typeChange = int.Parse(form["typeChange"]);
                string name = Convert.ToString(form["EmployeeName"]);
                string date = Convert.ToString(form["BirthDay"]);
                var arrday = date.Split('/');
                DateTime birthday = new DateTime(int.Parse(arrday[2]), int.Parse(arrday[1]), int.Parse(arrday[0]));
                byte gender = Convert.ToByte(form["radio"]);
                string phone = Convert.ToString(form["PhoneNumber"]);
                string address = Convert.ToString(form["Address"]);
                string email = Convert.ToString(form["Email"]);
                if (typeChange == 1)   // Change Emp
                {
                    Employee emp = db.Employees.Single(e => e.Id == Id && e.Status == 1);
                    if (emp != null)
                    {
                        emp.EmployeeName = name;
                        emp.Birthday = birthday;
                        emp.Gender = Convert.ToBoolean(gender);
                        emp.PhoneNumber = phone;
                        emp.Address = address;
                        emp.Email = email;
                        emp.TimeUpdate = DateTime.Now;
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã cập nhật nhân viên thành công!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, mess = "Nhân viên không còn tồn tại!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else if (typeChange == 2)// Change Cus
                {
                    Customer cus = db.Customers.Single(c => c.Id == Id && c.Status == 1);
                    if (cus != null)
                    {
                        cus.CustomerName = name;
                        cus.Birthday = birthday;
                        cus.Gender = Convert.ToBoolean(gender);
                        cus.PhoneNumber = phone;
                        cus.Address = address;
                        cus.Email = email;
                        cus.TimeUpdate = DateTime.Now;
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã cập nhật khách hàng thành công!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, mess = "Nhân viên khách hàng không còn tồn tại!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else if (typeChange == 3)   // create Emp
                {
                    try
                    {
                        Employee emp = new Employee
                        {
                            EmployeeName = name,
                            Birthday = birthday,
                            Gender = Convert.ToBoolean(gender),
                            PhoneNumber = phone,
                            Address = address,
                            Email = email,
                            Status = 1,
                            TimeCreate = DateTime.Now
                        };
                        db.Employees.Add(emp);
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã thêm nhân viên thành công!" }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }

                }
                else if (typeChange == 4)// Create Cus
                {
                    try
                    {
                        Customer cus = new Customer
                        {
                            CustomerName = name,
                            Birthday = birthday,
                            Gender = Convert.ToBoolean(gender),
                            PhoneNumber = phone,
                            Address = address,
                            Email = email,
                            Status = 1,
                            TimeCreate = DateTime.Now

                        };
                        db.Customers.Add(cus);
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã thêm khách hàng thành công!" }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                else return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public ActionResult Delete(int id, int type)   //1-emp 2 - cus
        {
            try
            {
                if( type == 1)
                {
                    var em = db.Employees.Single(e => e.Id == id);
                    if (em != null)
                    {
                        em.Status = 0;
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã xóa thành công nhân viên " + em.EmployeeName }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, mess = "Nhân viên không còn tồn tại!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var cus = db.Customers.Single(e => e.Id == id);
                    if (cus != null)
                    {
                        cus.Status = 0;
                        db.SaveChanges();
                        return Json(new { success = true, mess = "Đã xóa thành công nhân viên " + cus.CustomerName }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, mess = "Khách hàng không còn tồn tại!" }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}