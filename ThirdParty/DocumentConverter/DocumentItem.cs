using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Diagnostics;

namespace DocumentConverter
{
    public class DocumentItem
    {
        public enum State { Queued, Downloading, Downloaded, Converting, Processed, Failed, Unknown }

        #region Initialization
        public DocumentItem(HttpContext context)
        {
            m_sourceUrl   = context.Request.Params["source"];
            m_clientUrl = context.Request.Params["clientUrl"];
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

            m_appRootUrl = "http://" + IPAdd + context.Request.ApplicationPath;
            try { m_shortLivingSource = Convert.ToBoolean(context.Request.Params["shortLiving"]); }
            catch (FormatException) { m_shortLivingSource = false; }

            m_id = Guid.NewGuid();
            m_syncRoot = new Object();
            Status = State.Queued;

            if (m_shortLivingSource)
                DownloadDocument();
        }
        #endregion

        #region Public Methods
        public void Process()
        {
            try
            {
                Debug.WriteLine("getting " + m_sourceUrl + " ...");
                if(Status == State.Queued)
                    DownloadDocument();
                ConvertToPdf();
                AdviseClient();
                File.Delete(InputPath);
            }
            catch (ArgumentNullException)
            {
                Status = State.Failed;
                Debug.WriteLine("DocumentItem Error : No source document provided!"); 
            }
            catch (UriFormatException e) 
            {
                Status = State.Failed;
                Debug.WriteLine("DocumentItem Error : Invalid source document - exception = " + e.Message); 
            }
            catch (Exception e) 
            {
                Status = State.Failed;
                Debug.WriteLine("DocumentItem Exception occured : " + e.Message); 
            }
            finally { }
        }
        #endregion

        #region Properties
        public Guid Id { get { return m_id; } }
        private string Extension
        {
            get
            {
                string extension = GetExtension(m_sourceUrl);
                if (extension.Length == 0) throw new UriFormatException(); //not a valid input document
                return extension;
            }
        }
        private string PdfFileName { get { return Id + ".pdf"; } }
        public string InputPath 
        {
            get 
            {
               return Path.Combine(ConversionEngine.InputDir, Id + Extension);
            }
        }
        public string OutputPath
        {
            get
            {
                return Path.Combine(ConversionEngine.OutDir, PdfFileName);
            }
        }
        public State Status 
        {
            get { lock (m_syncRoot) { return m_state;} }
            set { lock (m_syncRoot) { m_state = value;} }
        }
        #endregion

        #region Helpers
        private void DownloadDocument()
        {
            Status = State.Downloading;
            HttpWebResponse response = null;
            BinaryReader readStream = null;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(m_sourceUrl);
                response = (HttpWebResponse)request.GetResponse();
                Stream receiveStream = response.GetResponseStream();
                readStream = new BinaryReader(receiveStream);

                Debug.WriteLine("downloading src document to " + InputPath + "...");

                if (!Directory.Exists(ConversionEngine.InputDir))
                    Directory.CreateDirectory(ConversionEngine.InputDir);

                using (BinaryWriter bw = new BinaryWriter(File.Open(InputPath, FileMode.Create)))
                {

                    byte[] buff = new byte[256];
                    int count = readStream.Read(buff, 0, 256);
                    while (count > 0)
                    {
                        bw.Write(buff, 0, count);
                        count = readStream.Read(buff, 0, 256);
                    }
                }
                Status = State.Downloaded;
            }
            catch (Exception e) { throw new Exception("DocumentItem Failed to Download document", e); }
            finally
            {
                if (response != null) response.Close();
                if (readStream != null) readStream.Close();
            }
        }
        protected virtual void ConvertToPdf()
        {
            Debug.WriteLine("Generating pdf file : " + OutputPath + "...");

            Status = State.Converting;
            Microsoft.Office.Interop.PowerPoint.Application app = null;
            Microsoft.Office.Interop.PowerPoint.Presentation doc = null;
            try
            {
                if (!Directory.Exists(ConversionEngine.OutDir))
                    Directory.CreateDirectory(ConversionEngine.OutDir);

                app = new Microsoft.Office.Interop.PowerPoint.Application();
                doc = app.Presentations.Open(InputPath, Microsoft.Office.Core.MsoTriState.msoCTrue, Microsoft.Office.Core.MsoTriState.msoCTrue, Microsoft.Office.Core.MsoTriState.msoFalse);
                doc.SaveAs(OutputPath, Microsoft.Office.Interop.PowerPoint.PpSaveAsFileType.ppSaveAsPDF, Microsoft.Office.Core.MsoTriState.msoCTrue);
            }
            catch (System.Runtime.InteropServices.COMException e) { throw new Exception("Office component failed to open/convert document", e); }
            finally 
            { 
                if (doc != null) doc.Close();
                if (app != null) app.Quit();
            }
            Status = State.Processed;
        }
        private void AdviseClient()
        {
            HttpWebResponse response = null;
            try
            {
                string pdfUrl = Path.Combine(m_appRootUrl + "/output/", PdfFileName);
                string requestUrl = m_clientUrl + "?id=" + Id + "&pdfUrl=" + pdfUrl;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);

                response = (HttpWebResponse)request.GetResponse();
            }
            catch (Exception e)
            {
                Debug.WriteLine("Failed to advise client : " + e.Message);
            }
            finally
            {
                if (response != null) response.Close();
            }
        }
        #endregion

        #region Class
        public static string GetExtension(string sourceUrl)
        {
            Uri uri = new Uri(sourceUrl);

            string[] segments = uri.Segments;
            string srcDocumentName = uri.Segments[segments.Length - 1];
            return Path.GetExtension(srcDocumentName).ToLower();
        }
        #endregion

        #region Members
        private string m_sourceUrl;
        private string m_clientUrl;
        private string m_appRootUrl;
        bool m_shortLivingSource;
        private Guid m_id;
        private State m_state;
        private Object m_syncRoot;
        #endregion

    }
}
