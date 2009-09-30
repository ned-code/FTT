using System;
using System.Runtime.InteropServices;
using System.Security.Principal;

namespace DocumentConverter
{
    public class Impersonation : IDisposable 
    {
        [DllImport("advapi32", SetLastError = true)]
        private static extern bool LogonUser(string userName, string domain, string passWord, int logonType, int logonProvider, out IntPtr token);

        [DllImport("Kernel32", CharSet = CharSet.Auto)]
        private static extern bool CloseHandle(IntPtr pHandle);


        public Impersonation(): this(DefaultUser, DefaultPassword, DefaultDomain)  { }
        public Impersonation(string userId, string passWord, string domain)
        {
            m_userId = userId;
            m_password = passWord;
            m_domain = domain;
            Impersonate();
        }

        private void Impersonate()
        {
            IntPtr handle = new IntPtr(0);
            if (!LogonUser(m_userId, m_domain, m_password, 3, 0, out handle))
                throw new Exception("authentication Error");
            m_impContext = new WindowsIdentity(handle).Impersonate();
            CloseHandle(handle);
        }

        private void Close()
        {
            if(m_impContext != null)
                m_impContext.Undo();
        }

        private string m_userId;
        private string m_password;
        private string m_domain;

        private static string     DefaultUser = "DocumentConverter";
        private static string DefaultPassword = "_acuniboard08";
        private static string   DefaultDomain = "";

        private WindowsImpersonationContext m_impContext;


        #region IDisposable Members

        public void Dispose()
        {
            Close();
        }

        #endregion
    }
}
