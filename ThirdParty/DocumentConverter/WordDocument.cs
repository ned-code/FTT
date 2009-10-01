using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Diagnostics;
using Microsoft.Office.Interop.Word;

namespace DocumentConverter
{
    public class WordDocument : DocumentItem
    {
        static WordDocument()
        {
            using (new Impersonation())
            {
                TerminateWord();
            }
        }

        public WordDocument(HttpContext context):base(context){}

        #region Helpers
        protected override void ConvertToPdf()
        {
            Trace.WriteLine("Generating pdf file : " + OutputPath + "...");

            Status = State.Converting;
            Documents docSet = null;
            Document doc = null;
            Object missingParam = Type.Missing;
            using (new Impersonation())
            {
                try
                {
                    if (!Directory.Exists(ConversionEngine.OutDir))
                        Directory.CreateDirectory(ConversionEngine.OutDir);

                    if (WordApp == null)
                        WordApp = new Application();

                    Object isVisible = false;
                    Object inPath = InputPath;
                    docSet = WordApp.Documents;
                    doc = docSet.Open(ref inPath, ref missingParam, ref missingParam, ref missingParam, ref missingParam,
                                             ref missingParam, ref missingParam, ref missingParam, ref missingParam, ref missingParam,
                                             ref missingParam, ref isVisible, ref missingParam, ref missingParam, ref missingParam, ref missingParam);

                    Object outPath = OutputPath;
                    Object format = WdSaveFormat.wdFormatPDF;
                    doc.SaveAs(ref outPath, ref format, ref missingParam, ref missingParam, ref missingParam, ref missingParam,
                               ref missingParam, ref missingParam, ref missingParam, ref missingParam, ref missingParam,
                               ref missingParam, ref missingParam, ref missingParam, ref missingParam, ref missingParam);

                }
                catch (System.Runtime.InteropServices.COMException e)
                {
                    TerminateWord();
                    doc = null;
                    docSet = null;
                    WordApp = null;
                    throw new Exception("Office component failed to open/convert document", e);
                }
                catch { throw; }
                finally
                {
                    if (doc != null)
                    {
                        doc.Close(ref missingParam, ref missingParam, ref missingParam);
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(doc);
                        doc = null;
                    }
                    if (docSet != null)
                    {
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(docSet);
                        docSet = null;
                    }
                    //if (WordApp != null)
                    //{
                    //    WordApp.Quit(ref missingParam, ref missingParam, ref missingParam);
                    //    System.Runtime.InteropServices.Marshal.FinalReleaseComObject(WordApp);
                    //    WordApp = null;
                    //}
                }
            }
            Status = State.Processed;
        }
        #endregion

        private static void TerminateWord()
        {
            Process[] processes = System.Diagnostics.Process.GetProcessesByName("WINWORD");
            foreach (Process p in processes)
            {
                try { p.Kill(); }
                catch (Exception e) { Trace.TraceWarning("Failed to kill Word process : " + e.Message); }
            }
        }

        private static Microsoft.Office.Interop.Word.Application WordApp = null;

    }
}
