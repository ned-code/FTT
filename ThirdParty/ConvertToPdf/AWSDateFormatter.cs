// This software code is made available "AS IS" without warranties of any        
// kind.  You may copy, display, modify and redistribute the software            
// code either by itself or as incorporated into your code; provided that        
// you do not remove any proprietary notices.  Your use of this software         
// code is at your own risk and you waive any claim against Amazon               
// Digital Services, Inc. or its affiliates with respect to your use of          
// this software code. (c) 2006 Amazon Digital Services, Inc. or its             
// affiliates.          

using System;

namespace AmazonWebServices
{
    class AWSDateFormatter
    {
        private static string TIMESTAMP_FORMAT = "yyyy-MM-dd\\THH:mm:ss.fff\\Z";

        /// <summary>
        /// Converts the date to an ISO-8601, resolved to milliseconds.
        /// </summary>
        public static string FormatAsISO8601(DateTime dateTime)
        {
            return dateTime.ToUniversalTime().ToString(TIMESTAMP_FORMAT,
                                System.Globalization.CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Gets time in the DateTime format, resolved to milliseconds.
        /// </summary>
        public static DateTime GetCurrentTimeResolvedToMillis()
        {
            DateTime dateTime = DateTime.Now;
            // NOTE: THIS IS .NET VERSION SPECIFIC:
            //
            // For .NET 2.x, please ensure that you have DateTimeKind.Local at
            // the end of this method.
            //
            // For .NET 1.x, DateTimeKind does not exist and will generate
            // a compile-time error.; simply comment that line out.
            //
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day,
                                 dateTime.Hour, dateTime.Minute, dateTime.Second,
                                 dateTime.Millisecond
                                 , DateTimeKind.Local   // COMMENT OUT THIS LINE FOR .NET 1.1
                               );
        }
    }
}
