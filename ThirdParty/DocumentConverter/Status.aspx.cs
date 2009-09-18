using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DocumentConverter
{
    public partial class Status : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string pdfId = Context.Request.Params["pdfId"];
            DocumentItem.State status = ConversionEngine.Instance.GetDocumentStatus(pdfId);
            Response.AppendHeader("PdfStatus", status.ToString());
        }
    }
}
