using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace HTML5.Extensions
{
    /// <summary>
    /// Extension methods for @Html
    /// </summary>
    public static class HtmlExtensions
    {
        /// <summary>
        /// Turns the .NET object into a JSON object for use client side
        /// </summary>
        /// <remarks>
        /// stackoverflow.com/questions/8502146/convert-net-object-to-json-object-in-the-view
        /// usage: @import HTML5.Extensions 
        ///        var javascriptObject = @(Html.ToJson(object))
        /// </remarks>
        public static MvcHtmlString ToJson(this HtmlHelper html, object obj)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return MvcHtmlString.Create(serializer.Serialize(obj));
        }
    }
}