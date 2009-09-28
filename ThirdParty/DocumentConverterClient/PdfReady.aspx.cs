using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.IO;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DocumentConverterClient
{
    public partial class PdfReady : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            m_pdfId = Context.Request.Params["id"];
            m_pdfUrl = Context.Request.Params["pdfUrl"];
            m_applicationPath = Context.Request.PhysicalApplicationPath; 
            string requestUrl = Path.Combine(_Default.ConverterRoot, m_pdfUrl);

            HttpWebResponse response = null;
            BinaryReader readStream = null;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
                response = (HttpWebResponse)request.GetResponse();
                Stream receiveStream = response.GetResponseStream();
                readStream = new BinaryReader(receiveStream);
                
                string outDir = Path.Combine(m_applicationPath, "output");
                if (!Directory.Exists(outDir))
                    Directory.CreateDirectory(outDir);
                string outPath = Path.Combine(outDir, m_pdfId + ".pdf");

                Debug.WriteLine("downloading pdf document to " + outPath + "...");

                using (BinaryWriter bw = new BinaryWriter(File.Open(outPath, FileMode.Create)))
                {

                    byte[] buff = new byte[256];
                    int count = readStream.Read(buff, 0, 256);
                    while (count > 0)
                    {
                        bw.Write(buff, 0, count);
                        count = readStream.Read(buff, 0, 256);
                    }
                }
            }
            catch(Exception ex)
            {
                Debug.WriteLine("Failed to download pdf document : " + ex.Message);
                return;
            }
            finally
            {
                if (response != null) response.Close();
                if (readStream != null) readStream.Close();
            }

            //delete pdf file
            Debug.WriteLine("Request deletion of " + m_pdfUrl + "...");
            string requestUrl2 = _Default.DeleteUrl + "?pdfId=" + m_pdfId;
            HttpWebRequest request2 = (HttpWebRequest)WebRequest.Create(requestUrl2);
            HttpWebResponse response2 = (HttpWebResponse)request2.GetResponse();
            if (response2 != null) response2.Close();
        }

        private string m_pdfId;
        private string m_pdfUrl;
        private static string m_applicationPath;
    }
}
