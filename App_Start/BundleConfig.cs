using System.Web;
using System.Web.Optimization;

namespace Shop
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
            bundles.Add(new StyleBundle("~/assets/css").Include(
                      "~/assets/plugins/bootstrap/dist/css/bootstrap.min.css",
                      "~/assets/icon/themify-icons/themify-icons.css",
                      "~/assets/icon/icofont/css/icofont.css",
                      "~/assets/pages/flag-icon/flag-icon.min.css",
                      "~/assets/pages/menu-search/css/component.css",
                      "~/assets/pages/dashboard/amchart/css/amchart.css",
                      "~/assets/pages/dashboard/horizontal-timeline/css/style.css",
                      "~/assets/css/style.css",
                      "~/assets/css/linearicons.css",
                      "~/assets/css/simple-line-icons.css",
                      "~/assets/css/jquery.mCustomScrollbar.css"));
            bundles.Add(new ScriptBundle("~/assets/js").Include(
                       "~/assets/plugins/jquery/dist/jquery.min.js",
                       "~/assets/plugins/jquery-ui/jquery-ui.min.js",
                       "~/assets/plugins/tether/dist/js/tether.min.js",
                       "~/assets/plugins/bootstrap/dist/js/bootstrap.min.js",
                       "~/assets/plugins/jquery-slimscroll/jquery.slimscroll.js",
                       "~/assets/plugins/modernizr/modernizr.js",
                       "~/assets/plugins/modernizr/feature-detects/css-scrollbars.js",
                       "~/assets/plugins/classie/classie.js",
                       "~/assets/plugins/d3/d3.js",
                       "~/assets/plugins/rickshaw/rickshaw.js",
                       "~/assets/plugins/raphael/raphael.min.js",
                       "~/assets/plugins/morris.js/morris.js",
                       "~/assets/pages/dashboard/horizontal-timeline/js/main.js",
                       "~/assets/pages/dashboard/amchart/js/amcharts.js",
                       "~/assets/pages/dashboard/amchart/js/serial.js",
                       "~/assets/pages/dashboard/amchart/js/light.js",
                       "~/assets/pages/dashboard/amchart/js/custom-amchart.js",
                       "~/assets/plugins/i18next/i18next.min.js",
                       "~/assets/plugins/i18next-xhr-backend/i18nextXHRBackend.min.js",
                       "~/assets/plugins/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js",
                       "~/assets/plugins/jquery-i18next/jquery-i18next.min.js",
                       "~/assets/pages/dashboard/custom-dashboard.js",
                       "~/assets/js/script.js",
                       "~/assets/js/pcoded.min.js",
                       "~/assets/js/demo-12.js",
                       "~/assets/js/jquery.mCustomScrollbar.concat.min.js",
                       "~/assets/js/jquery.mousewheel.min.js"));
        }
    }
}
