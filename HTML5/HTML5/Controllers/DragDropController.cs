using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HTML5.Controllers
{
    public class DragDropController : HTML5Controller
    {
        //
        // GET: /DragDrop/

        public override ActionResult Index()
        {
            return View();
        }

        public ActionResult MoveContent()
        {
            return View();
        }

        public ActionResult ExplorerDrop()
        {
            return View();
        }

        [HttpPost]
        public ActionResult FormSubmit(HttpPostedFileBase file, string settings)
        {
            if (file != null && file.ContentLength > 0)
            {
                var stream = file.InputStream;
                //use spreadsheet gear to read in the inputstream into an excel workbook object and manipulate. 
                

                //saving to server would require special permissions and not really necessary
            }

            return Json("success!");
        }
    }
}
