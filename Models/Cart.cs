using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shop.Models
{
    public class Cart
    {
        public int Key { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public string Photo { get; set; }
        public string Size { get; set; }        
        public string Color { get; set; }
        public int Number { get; set; } 
        public double IntoMoney { get; set; }
    }
}