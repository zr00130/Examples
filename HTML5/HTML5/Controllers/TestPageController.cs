using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HTML5.Controllers
{
    public class TestPageController : HTML5Controller
    {
        //
        // GET: /TestPage/

        public override ActionResult Index()
        {
            return View();
        }

    }
}
