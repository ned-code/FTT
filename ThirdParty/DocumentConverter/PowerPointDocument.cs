using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Diagnostics;

namespace DocumentConverter
{
    public class PowerPointDocument : DocumentItem
    {
        static PowerPointDocument()
        {
            using (new Impersonation())
            {
                TerminatePowerPoint();
            }
        }

        public PowerPointDocument(HttpContext context):base(context)
        {
        }

        #region Helpers
        protected override void ConvertToPdf()
        {
            Debug.WriteLine("Generating pdf file : " + OutputPath + "...");

            Status = State.Converting;
            Microsoft.Office.Interop.PowerPoint.Presentation doc = null;
            Microsoft.Office.Interop.PowerPoint.Presentations docSet = null;
            using (new Impersonation())
            {
                try
                {
                    if (!Directory.Exists(ConversionEngine.OutDir))
                        Directory.CreateDirectory(ConversionEngine.OutDir);


                    if (PowerPointApp == null)
                        PowerPointApp = new Microsoft.Office.Interop.PowerPoint.Application();

                    docSet = PowerPointApp.Presentations;
                    doc = docSet.Open(InputPath, Microsoft.Office.Core.MsoTriState.msoCTrue, Microsoft.Office.Core.MsoTriState.msoCTrue, Microsoft.Office.Core.MsoTriState.msoFalse);
                    doc.SaveAs(OutputPath, Microsoft.Office.Interop.PowerPoint.PpSaveAsFileType.ppSaveAsPDF, Microsoft.Office.Core.MsoTriState.msoCTrue);
                }
                catch (System.Runtime.InteropServices.COMException e)
                {
                    TerminatePowerPoint();
                    doc = null;
                    docSet = null;
                    PowerPointApp = null;
                    throw new Exception("Office component failed to open/convert document", e);
                }
                catch { throw; }
                finally
                {
                    if (doc != null)
                    {
                        doc.Close();
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(doc);
                        doc = null;
                    }
                    if (docSet != null)
                    {
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(docSet);
                        docSet = null;
                    }
                    //if (PowerPointApp != null)
                    //{
                    //    PowerPointApp.Quit();
                    //    System.Runtime.InteropServices.Marshal.FinalReleaseComObject(PowerPointApp);
                    //    PowerPointApp = null;
                    //}
                }
            }
            Status = State.Processed;
        }
        #endregion

        private static void TerminatePowerPoint()
        {
            Process[] processes = System.Diagnostics.Process.GetProcessesByName("POWERPNT");
            foreach (Process p in processes)
            {
                try { p.Kill(); }
                catch (Exception e) { Debug.WriteLine("Failed to kill PowerPoint process : " + e.Message); }
            }
        }
        private static Microsoft.Office.Interop.PowerPoint.Application PowerPointApp = null;
    }
}
