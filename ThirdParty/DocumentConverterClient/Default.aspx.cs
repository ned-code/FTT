using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.IO;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace DocumentConverterClient
{
    public partial class _Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            IPAddress[] adds = Dns.GetHostEntry(Dns.GetHostName()).AddressList;
            string IPAdd = "";
            foreach (IPAddress add in adds)
            {
                if (add.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    IPAdd = add.ToString();
                    break;
                }
            }

            if ((Page as _Default).ClientIPAddress.Text == "")
                m_appRootUrl = "http://" + IPAdd + Context.Request.ApplicationPath;
            else
                m_appRootUrl = "http://" + ClientIPAddress.Text + Context.Request.ApplicationPath;

            if ((Page as _Default).SourceUrlTextBox.Text == "")
                SourceUrlTextBox.Text = m_defaultSourceUrl;

            if ((Page as _Default).ConverterUrlTextBox.Text == "")
                ConverterUrlTextBox.Text = m_ConverterAddress;
            else m_ConverterAddress = ConverterUrlTextBox.Text;
        }

        protected void OnButtonConvertClick(object sender, EventArgs e)
        {
            PdfIdLabel.Text = "";
            string requestUrl = ConverterUrl + "?source=" + SourceUrlTextBox.Text;
            requestUrl += "&shortLiving=" + ShortLivingCheckBox.Checked.ToString();
            requestUrl += "&clientUrl=" + Path.Combine(m_appRootUrl, "PdfReady.aspx");
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            PdfIdLabel.Text = response.Headers["pdfId"];
            if (response != null) response.Close();
            RefreshStatus();
        }

        protected void ButtonStatus_Click(object sender, EventArgs e)
        {
            RefreshStatus();
        }

        private void RefreshStatus()
        { 
            string requestUrl = StatusUrl + "?pdfId=" + PdfIdLabel.Text; 
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            StatusLabel.Text = response.Headers["PdfStatus"];
            if (response != null)
                response.Close();
        }

        protected void OnPurge(object sender, EventArgs e)
        {
            string requestUrl = DeleteUrl + "?purgeAllDocuments=True";
            requestUrl += "&minOldness="+ OldnessTextBox.Text;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            if (response != null) response.Close();
        }

        public static string ConverterRoot { get { return m_ConverterAddress; } }
        public static string ConverterUrl { get { return m_ConverterAddress + "/PdfConverter.aspx"; } }
        public static string DeleteUrl { get { return m_ConverterAddress + "/DeletePdf.aspx"; } }
        public static string    StatusUrl { get { return m_ConverterAddress + "/Status.aspx"; } }
        private string m_appRootUrl;
        private static string m_ConverterAddress = "http://localhost/DocumentConverter";
        private const string m_defaultSourceUrl = "http://www.diaporamas-a-la-con.com/PPS/Fonctionnaires/08-Le%20planning%20d%27un%20administratif.pps";

    }
}
