using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Diagnostics;
using Microsoft.Office.Interop.Excel;

namespace DocumentConverter
{
    public class ExcelDocument : DocumentItem
    {
        static ExcelDocument()
        {
            using (new Impersonation())
            {
                TerminateExcel();
            }
        }

        public ExcelDocument(HttpContext context) : base(context) { }

        #region Helpers
        protected override void ConvertToPdf()
        {
            Trace.WriteLine("Generating pdf file : " + OutputPath + "...");

            Status = State.Converting;
            Workbooks docSet = null;
            Workbook doc = null;
            Object missingParam = Type.Missing;
            using (new Impersonation())
            {
                try
                {
                    if (!Directory.Exists(ConversionEngine.OutDir))
                        Directory.CreateDirectory(ConversionEngine.OutDir);

                    if (ExcelApp == null)
                    {
                        ExcelApp = new Application();
                        ExcelApp.DisplayAlerts = false;
                    }
                    
                    docSet = ExcelApp.Workbooks;
                    doc = docSet.Open(InputPath, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing,
                                      Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing);

                    doc.ExportAsFixedFormat(XlFixedFormatType.xlTypePDF, OutputPath, XlFixedFormatQuality.xlQualityStandard,
                                            true, false, Type.Missing, Type.Missing, false, Type.Missing);
                }
                catch (System.Runtime.InteropServices.COMException e)
                {
                    TerminateExcel();
                    doc = null;
                    docSet = null;
                    ExcelApp = null;
                    throw new Exception("Office component failed to open/convert document", e);
                }
                catch { throw; }
                finally
                {
                    if (doc != null)
                    {
                        doc.Close(false, Type.Missing, Type.Missing);
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(doc);
                        doc = null;
                    }
                    if (docSet != null)
                    {
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(docSet);
                        docSet = null;
                    }
                    //if (ExcelApp != null)
                    //{
                    //    ExcelApp.Quit();
                    //    System.Runtime.InteropServices.Marshal.FinalReleaseComObject(ExcelApp);
                    //    ExcelApp = null;
                    //}
                }
            }
            Status = State.Processed;
        }
        #endregion

        private static void TerminateExcel()
        {
            Process[] processes = System.Diagnostics.Process.GetProcessesByName("EXCEL");
            foreach (Process p in processes)
            {
                try { p.Kill(); }
                catch (Exception e) { Trace.TraceWarning("Failed to kill Word process : " + e.Message); }
            }
        }

        private static Microsoft.Office.Interop.Excel.Application ExcelApp = null;

    }
}
