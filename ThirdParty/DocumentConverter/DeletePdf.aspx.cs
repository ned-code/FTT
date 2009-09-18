using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DocumentConverter
{
    public partial class DeletePdf : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string pdfId  = Context.Request.Params["pdfId"];
            if (pdfId == null)
            {
                bool purgeAllDocuments = false;
                int minOldness = 24;
                try 
                { 
                    purgeAllDocuments = Convert.ToBoolean(Context.Request.Params["purgeAllDocuments"]); 
                    minOldness = Convert.ToInt32(Context.Request.Params["minOldness"]);
                }
                catch (FormatException) {}

                if (purgeAllDocuments)
                {
                    if (!ConversionEngine.Instance.Purge(minOldness))
                        Response.StatusCode = 403; //HTTP_STATUS_FORBIDDEN
                }

            }
            else
            {
                if (!ConversionEngine.Instance.DeletePdf(pdfId))
                    Response.StatusCode = 403; //HTTP_STATUS_FORBIDDEN
            }
        }
    }
}
