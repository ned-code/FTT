using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocumentConverter
{
    public class DocumentFactory
    {
        public static DocumentItem CreateDocument(HttpContext context)
        {
            DocumentItem doc = null;
            string extension = DocumentItem.GetExtension(context.Request.Params["source"]);
            switch (extension)
            {
                case ".ppt":
                case ".pptx":
                case ".pptm":
                case ".pps":
                case ".ppsx":
                case ".ppsm":
                case ".pot":
                case ".potx":
                case ".potm":
                case ".odp":
                    doc = new PowerPointDocument(context);
                    break;
                case ".doc":
                case ".docx":
                case ".docm":
                case ".dot":
                case ".dotx":
                case ".dotm":
                case ".html":
                case ".htm":
                case ".txt":
                case ".rtf":
                case ".odt":
                    doc = new WordDocument(context);
                    break;
                case ".xls":
                case ".xlsx":
                case ".xlsm":
                case ".xlsb":
                case ".xlam":
                case ".xltx":
                case ".xltm":
                case ".xml":
                case ".xla":
                case ".xlm":
                case ".xlw":
                case ".odc":
                case ".ods":
                    doc = new ExcelDocument(context);
                    break;
                default:
                    doc = new DocumentItem(context);
                    break;
            }

            return doc;
        }
    }
}
