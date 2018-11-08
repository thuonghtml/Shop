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
            #region Assets_Admin
            bundles.Add(new StyleBundle("~/assets/css").Include(
                      "~/assets/plugins/bootstrap/dist/css/bootstrap.min.css",
                      "~/assets/icon/themify-icons/themify-icons.css",
                      "~/assets/icon/icofont/css/icofont.css",
                      "~/assets/pages/flag-icon/flag-icon.min.css",
                      "~/assets/pages/menu-search/css/component.css",
                      "~/assets/pages/dashboard/amchart/css/amchart.css",
                      "~/assets/pages/dashboard/horizontal-timeline/css/style.css",
                      "~/assets/plugins/ekko-lightbox/dist/ekko-lightbox.css",
                      "~/assets/plugins/lightbox2/dist/css/lightbox.css",
                      "~/assets/css/style.css",
                      "~/assets/plugins/animate.css/animate.css",
                      "~/assets/css/linearicons.css",
                      "~/assets/css/simple-line-icons.css",
                      "~/assets/pages/notification/notification.css",
                      "~/assets/css/ionicons.css",
                      "~/assets/css/jquery.mCustomScrollbar.css",
                      "~/assets/plugins/jstree/themes/default/style.min.css",
                      "~/assets/plugins/toastr/toastr.min.css",
                      "~/assets/plugins/DataTables/datatables.min.css"
                      ));
            bundles.Add(new ScriptBundle("~/assets/js").Include(
                       "~/assets/plugins/jquery/dist/jquery.min.js",
                       "~/assets/plugins/jquery-ui/jquery-ui.min.js",
                       "~/assets/plugins/tether/dist/js/tether.min.js",
                       "~/assets/plugins/bootstrap/dist/js/bootstrap.min.js",
                       "~/assets/plugins/jquery-slimscroll/jquery.slimscroll.js",
                       "~/assets/plugins/modernizr/modernizr.js",
                       "~/assets/js/bootstrap-growl.min.js",
                       "~/assets/plugins/modernizr/feature-detects/css-scrollbars.js",
                       "~/assets/plugins/classie/classie.js",
                       "~/assets/plugins/d3/d3.js",
                       //"~/assets/plugins/rickshaw/rickshaw.js",
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
                       //"~/assets/pages/dashboard/custom-dashboard.js",
                       "~/assets/plugins/ekko-lightbox/dist/ekko-lightbox.js",
                       "~/assets/plugins/lightbox2/dist/js/lightbox.js",
                       "~/assets/js/script.js",
                       "~/assets/js/pcoded.min.js",
                       "~/assets/js/demo-12.js",
                       "~/assets/js/jquery.mCustomScrollbar.concat.min.js",
                       "~/assets/js/jquery.mousewheel.min.js",
                       "~/assets/plugins/toastr/toastr.min.js",
                       "~/assets/plugins/jstree/jstree.min.js"));
            bundles.Add(new ScriptBundle("~/asset/page/login/js").Include(
                       "~/assets/plugins/jquery/dist/jquery.min.js",
                       "~/assets/plugins/jquery-ui/jquery-ui.min.js",
                       "~/assets/plugins/tether/dist/js/tether.min.js",
                       "~/assets/plugins/bootstrap/dist/js/bootstrap.min.js",
                       "~/assets/plugins/jquery-slimscroll/jquery.slimscroll.js",
                       "~/assets/plugins/modernizr/modernizr.js",
                       "~/assets/plugins/modernizr/feature-detects/css-scrollbars.js",
                       "~/assets/js/script.js",
                       "~/assets/js/bootstrap-growl.min.js",
                       "~/assets/pages/notification/notification.js",
                       "~/assets/js/common-pages.js"));
            bundles.Add(new ScriptBundle("~/assets/page/warehouse/js").Include(
                        "~/assets/pages/warehouse/warehouse.js"
                ));
            bundles.Add(new StyleBundle("~/assets/page/category/css").Include(
                    //"~/assets/plugins/DataTables/datatables.min.css"
                ));
            bundles.Add(new ScriptBundle("~/assets/page/category/js").Include(
                        //"~/assets/plugins/DataTables.min.js",
                        //"~/assets/plugins/DataTables/dataTables.altEditor.free.js",
                        "~/assets/pages/category/category.js"
                ));
            //bundles.Add(new StyleBundle("~/assets/page/product/css").Include(
                    
            //    ));
            bundles.Add(new ScriptBundle("~/assets/page/product/js").Include(
                    "~/assets/pages/product/product.js"
                ));
            #endregion Assets_Admin
            #region Assets_Client
            bundles.Add(new StyleBundle("~/assets_client/css").Include(
                       "~/assets_client/vendor/bootstrap/css/bootstrap.min.css",
                       "~/assets_client/fonts/font-awesome-4.7.0/css/font-awesome.min.css",
                       "~/assets_client/fonts/iconic/css/material-design-iconic-font.min.css",
                       "~/assets_client/fonts/linearicons-v1.0.0/icon-font.min.css",
                       "~/assets_client/vendor/animate/animate.css",
                       "~/assets_client/vendor/css-hamburgers/hamburgers.min.css",
                       "~/assets_client/vendor/animsition/css/animsition.min.css",
                       "~/assets_client/vendor/select2/select2.min.css",
                       "~/assets_client/vendor/daterangepicker/daterangepicker.css",
                       "~/assets_client/vendor/slick/slick.css",
                       "~/assets_client/vendor/MagnificPopup/magnific-popup.css",
                       "~/assets_client/vendor/perfect-scrollbar/perfect-scrollbar.css",
                       "~/assets_client/css/util.css",
                       "~/assets_client/css/main.css"));
            bundles.Add(new ScriptBundle("~/assets_client/js").Include(
                       "~/assets_client/vendor/jquery/jquery-3.2.1.min.js",
                       "~/assets_client/vendor/animsition/js/animsition.min.js",
                       "~/assets_client/vendor/bootstrap/js/popper.js",
                       "~/assets_client/vendor/bootstrap/js/bootstrap.min.js",
                       "~/assets_client/vendor/select2/select2.min.js",
                       "~/assets_client/vendor/daterangepicker/moment.min.js",
                       "~/assets_client/vendor/daterangepicker/daterangepicker.js",
                       "~/assets_client/vendor/slick/slick.min.js",
                       "~/assets_client/js/slick-custom.js",
                       "~/assets_client/vendor/parallax100/parallax100.js",
                       "~/assets_client/vendor/MagnificPopup/jquery.magnific-popup.min.js",
                       "~/assets_client/vendor/isotope/isotope.pkgd.min.js",
                       "~/assets_client/vendor/sweetalert/sweetalert.min.js",
                       "~/assets_client/vendor/perfect-scrollbar/perfect-scrollbar.min.js",
                       "~/assets_client/js/main.js",
                       "~/assets_client/page/home/index.js"));
            #endregion Asset_Client

            #region User Profile
            bundles.Add(new StyleBundle("~/assets/page/user_profile/css").Include(
                    "~/assets/pages/advance-elements/css/bootstrap-datetimepicker.css"
                ));
            bundles.Add(new ScriptBundle("~/assets/page/user_profile/js").Include(
                    "~/assets/pages/advance-elements/moment-with-locales.min.js",
                    "~/assets/pages/advance-elements/bootstrap-datetimepicker.min.js",
                    "~/assets/pages/user-profile.js"
                ));
            #endregion
        }
    }
}
