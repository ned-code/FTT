using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Threading;

namespace DocumentConverter
{
    public class DocumentTable : SynchronizedKeyedCollection<string, DocumentItem>
    {
        public DocumentTable(object syncRoot) : base(syncRoot) { }
        protected override string GetKeyForItem(DocumentItem item)
        {
            return item.Id.ToString();
        }
    }

    public class ConversionEngine
    {
        public static ConversionEngine Instance
        {
            get
            {
                if (m_instance == null)
                    m_instance = new ConversionEngine();
                return m_instance;
            }
        }
        protected ConversionEngine()
        {
            m_syncRoot = new Object();
            m_toBeProcessedList = new SynchronizedCollection<DocumentItem>(m_syncRoot);
            m_documentTable = new DocumentTable(m_syncRoot);
            m_addEvent = new AutoResetEvent(false);
            m_conversionThread = new Thread(ConversionProc);
            m_conversionThread.Start();
        }

        #region Methods
        public void Add(DocumentItem doc)
        {
            lock (m_syncRoot)
            {
                m_toBeProcessedList.Add(doc);
                m_documentTable.Add(doc);     
                m_addEvent.Set();
            }
        }
        public DocumentItem.State GetDocumentStatus(string id)
        {
            try { lock (m_syncRoot) { return m_documentTable[id].Status; } }
            catch { return DocumentItem.State.Unknown; }
        }
        public bool CanDeletePdf(string id)
        {
            return GetDocumentStatus(id) == DocumentItem.State.Processed;
        }
        public bool DeletePdf(string id)
        {
            try
            {
                lock (m_syncRoot)
                {
                    if (CanDeletePdf(id))//Do not delete files while conversion process is ongoing...
                    {
                        Trace.Write("deleting : " + m_documentTable[id].OutputPath);
                        using (new Impersonation())//for delete permissions
                        {
                            File.Delete(m_documentTable[id].OutputPath);
                        }
                        m_documentTable.Remove(id);
                        return true;
                    }
                    else
                    {
                        Trace.TraceWarning("pdf deletion forbidden");
                        return false;
                    }
                }
            }
            catch (Exception e)
            {
                Trace.TraceWarning("Failed to delete pdf document : " + e.Message);
                return false;
            }
        }

        public bool Purge(int minOldness)
        {
            bool success = true;
            try
            {
                success = PurgeDirectory(InputDir, minOldness);
                success = PurgeDirectory(OutDir, minOldness) && success; 
            }
            catch (Exception e)
            {
                Debug.WriteLine("Failed to purge documents : " + e.Message);
                success = false;
            }

            return success;
        }

        #endregion

        #region Class
        public static string InputDir { get { return Path.Combine(HttpRuntime.AppDomainAppPath, "input"); } }
        public static string OutDir { get { return Path.Combine(HttpRuntime.AppDomainAppPath, "output"); } }
        #endregion

        #region Helpers
        private bool PurgeDirectory(string dir, int minOldness)
        {
            FileInfo[] files = new DirectoryInfo(dir).GetFiles();
            foreach (FileInfo file in files)
            {
                string id = file.Name.Replace(file.Extension, "");
                TimeSpan oldness = DateTime.Now - file.CreationTime;
                DocumentItem.State status = GetDocumentStatus(id);
                if (oldness.TotalHours > minOldness && (status == DocumentItem.State.Unknown || status == DocumentItem.State.Processed || status == DocumentItem.State.Failed))
                {
                    try
                    {
                        using (new Impersonation())//for delete permissions
                        {
                            file.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        Debug.WriteLine("Failed to delete document " + file.FullName + " : " + e.Message);
                        return false;
                    }
                }
            }
            return true;
        }
        #endregion
        
        #region Thread
        private void ConversionProc()
        {
            WaitHandle[] events = { m_addEvent };
            while (true)
            {
                int eventIndex = WaitHandle.WaitAny(events);

                if (eventIndex == 0)
                {
                    while (m_toBeProcessedList.Count != 0)
                    {
                        DocumentItem item = m_toBeProcessedList[0];
                        item.Process();
                        m_toBeProcessedList.Remove(item);
                    }
                }
            }
        }
        #endregion

        #region Members
        private static ConversionEngine m_instance = null;
        private SynchronizedCollection<DocumentItem> m_toBeProcessedList;
        private DocumentTable m_documentTable;
        private Thread m_conversionThread;
        private AutoResetEvent m_addEvent;
        private Object m_syncRoot;
        #endregion
    }
}
