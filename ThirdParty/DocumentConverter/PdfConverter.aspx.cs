using System;
using System.Collections;
using System.Diagnostics;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

namespace DocumentConverter
{
    public partial class PdfConverter : System.Web.UI.Page
    {
        public PdfConverter()
        {
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                DocumentItem doc = DocumentFactory.CreateDocument(Context);
                Response.AppendHeader("PdfId", doc.Id.ToString());
                ConversionEngine.Instance.Add(doc);
            }
            catch (Exception ex)//unabled to download short living resource
            {
                Debug.WriteLine("Failed to create Document : " + ex.Message);
                Response.StatusCode = 403; //HTTP_STATUS_FORBIDDEN
            }
        }
    }
}
