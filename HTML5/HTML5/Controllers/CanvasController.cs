using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HTML5.Controllers
{
    public class CanvasController : HTML5Controller
    {
        public override ActionResult Index()
        {
            return View();
        }

        public ActionResult Lines()
        {
            return View("Lines"); //since view is named the same as the action, this isn't necessary
        }
    }
}
