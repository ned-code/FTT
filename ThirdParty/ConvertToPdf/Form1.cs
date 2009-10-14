using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.IO;
using System.Net;
using System.Windows.Forms;
using System.Threading;
using System.Diagnostics;
using AmazonWebServices;
using com.amazon.s3;

namespace ConvertToPdf
{
    public partial class Converter : Form
    {
        public Converter()
        {
            InitializeComponent();
        }

        private void buttonConvert_Click(object sender, EventArgs e)
        {
            buttonConvert.Enabled = false;
            buttonBrowse.Enabled = false;
            buttonOpen.Enabled = false;
            textBoxUrl.Enabled = false;
            m_id = "";
            labelStatus.Text = "";
            textBoxPdfPath.Text = "";

            ThreadPool.QueueUserWorkItem(new WaitCallback(DoConvert));
        }
        private void Converter_Load(object sender, EventArgs e)
        {
            textBoxServerUrl.Text = DefaultConverterAddress;
            m_ConverterAddress = textBoxServerUrl.Text;
        }

        private void buttonBrowse_Click(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            if(dlg.ShowDialog()== DialogResult.OK)
            {
                textBoxUrl.Text = dlg.FileName;
            }
        }
        private void buttonOpen_Click(object sender, EventArgs e)
        {
            OpenPdf();
        }

        private void textBoxServerUrl_TextChanged(object sender, EventArgs e)
        {
            m_ConverterAddress = textBoxServerUrl.Text;
        }

        private string PutFileOnS3(AWSAuthConnection conn)
        {
            conn.createBucket(bucketName, null);
            string filePath = textBoxUrl.Text;
            m_fileName = Path.GetFileName(filePath);
            byte[] obj = readByteArrayFromFile(filePath);
            string s3Name = Guid.NewGuid() + Path.GetExtension(m_fileName);

            conn.put(bucketName, s3Name, obj, null, null);

            AccessControlPolicy policy = conn.getACL(bucketName, s3Name);

            // Copy the grants from before, and add the anonymous group grant.
            Grant[] grants = new Grant[policy.AccessControlList.Length + 1];
            int i = 0;
            foreach (Grant g in policy.AccessControlList)
            {
                grants[i] = g;
                ++i;
            }
            Group groupGrant = new Group();
            groupGrant.URI = "http://acs.amazonaws.com/groups/global/AllUsers";
            grants[i] = new Grant();
            grants[i].Grantee = groupGrant;
            grants[i].Permission = Permission.READ;
            conn.putACL(bucketName, s3Name, grants);

            return s3Name;
        }
        private byte[] readByteArrayFromFile(string fileName)
        {
            byte[] buff = null;

            try
            {
                FileStream fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                BinaryReader br = new BinaryReader(fs);
                long numBytes = new FileInfo(fileName).Length;
                buff = br.ReadBytes((int)numBytes);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

            return buff;
        }
        private void ProcessDocument(string publicUrl)
        {
            string requestUrl = ConverterUrl + "?source=" + publicUrl;
            requestUrl += "&shortLiving=false";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            m_id = response.Headers["pdfId"];
            if (response != null) response.Close();
        }

        private void DoConvert(Object stateInfo)
        {
            AWSAuthConnection conn = null;
            string s3Name = "";
            try
            {
                UpdateText(labelStatus, "Uploading to S3");
                conn = new AWSAuthConnection(awsAccessKeyId, awsSecretAccessKey);
                s3Name = PutFileOnS3(conn);
                string publicUrl = "http://s3.amazonaws.com/" + bucketName + "/" + s3Name;
                ProcessDocument(publicUrl);

                string status;
                while (true)
                {
                    status = RefreshStatus();
                    if (status == "Failed" || status == "Processed" || status == "Unknown")
                        break;

                    Thread.Sleep(500);
                }

                if (status == "Processed")
                {
                    bool res = DownloadPdf();
                    UpdateText(labelStatus, res ? "Done" : "Failed");
                }

            }
            catch
            {
                UpdateText(labelStatus, "Failed");
            }
            finally
            {
                if(s3Name.Length != 0 && conn != null)
                    conn.delete(bucketName, s3Name);

                EnableCallback enable = new EnableCallback(EnableButton);
                Invoke(enable, buttonConvert, true);
                Invoke(enable, buttonOpen, true);
                Invoke(enable, buttonBrowse, true);
                Invoke(enable, textBoxUrl, true);
            }
        }
        private string RefreshStatus()
        {
            string status;
            string requestUrl = StatusUrl + "?pdfId=" + m_id;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            status = response.Headers["PdfStatus"];
            if (status == "Downloading")
                status = "Uploading to Document Converter Server";
            UpdateText(labelStatus, status);
            if (response != null)
                response.Close();
            return status;
        }
        delegate void EnableCallback(Control control, bool b);
        delegate void SetTextCallback(Control control, string text);
        private void UpdateText(Control control, string text)
        {
            SetTextCallback callBack = new SetTextCallback(SetText);
            Invoke(callBack, control, text);
        }
        private void SetText(Control control, string text)
        {
            control.Text = text;
        }
        private void EnableButton(Control control, bool enabled)
        {
            control.Enabled = enabled;
        }

        private bool DownloadPdf()
        {
            UpdateText(labelStatus, "Downloading Pdf");

            string requestUrl = Path.Combine(ConverterRoot, @"output/" + m_id + ".pdf");

            HttpWebResponse response = null;
            BinaryReader readStream = null;
            string outPath = "";
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
                response = (HttpWebResponse)request.GetResponse();
                Stream receiveStream = response.GetResponseStream();
                readStream = new BinaryReader(receiveStream);

                string outDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Pdf Converter");
                if (!Directory.Exists(outDir))
                    Directory.CreateDirectory(outDir);
                outPath = Path.Combine(outDir, Path.GetFileNameWithoutExtension(m_fileName) + ".pdf");

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
                UpdateText(textBoxPdfPath, outPath);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Failed to download pdf document : " + ex.Message);
                return false;
            }
            finally
            {
                if (response != null) response.Close();
                if (readStream != null) readStream.Close();

            }

            if (checkBoxOpen.Checked)
                OpenPdf();

            //delete pdf file
            string requestUrl2 = DeleteUrl + "?pdfId=" + m_id;
            HttpWebRequest request2 = (HttpWebRequest)WebRequest.Create(requestUrl2);
            HttpWebResponse response2 = (HttpWebResponse)request2.GetResponse();
            if (response2 != null) response2.Close();

            return true;
        }
        private void OpenPdf()
        {
            if (File.Exists(textBoxPdfPath.Text))
            {
                Process p = new Process();
                p.StartInfo.FileName = textBoxPdfPath.Text;
                p.Start();
            }
        }
        private string m_fileName;
        private string m_id;
        private string m_ConverterAddress;
        public string ConverterRoot { get { return m_ConverterAddress; } }
        public string ConverterUrl { get { return m_ConverterAddress + "/PdfConverter.aspx"; } }
        public string DeleteUrl { get { return m_ConverterAddress + "/DeletePdf.aspx"; } }
        public string StatusUrl { get { return m_ConverterAddress + "/Status.aspx"; } }
        private string DefaultConverterAddress = "http://ec2-79-125-61-107.eu-west-1.compute.amazonaws.com/DocumentConverter";
        private const string m_defaultClientIPAddress = "85.218.33.126";

        //S3
        private static readonly string awsAccessKeyId = "AKIAJSQQ2RDIXG2UOZ5Q";
        private static readonly string awsSecretAccessKey = "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";
        private static readonly string bucketName = "uniboard-misc";



    }
}
