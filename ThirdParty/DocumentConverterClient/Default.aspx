<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="DocumentConverterClient._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
    <style type="text/css">
        .style1
        {
            width: 4px;
        }
        .style2
        {
            width: 991px;
        }
        .style3
        {
            width: 991px;
            height: 60px;
        }
        .style4
        {
            width: 4px;
            height: 60px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <p align="center" style="font-size: xx-large">
        Document Converter Client</p>
    <p>
        <br />
        <table style="width: 95%;">
            <tr>
                <td class="style3">
                    <asp:TextBox ID="ConverterUrlTextBox" runat="server" Width="504px"></asp:TextBox>
                    <asp:Label ID="Label2" runat="server" Text="Document Converter Server address"></asp:Label>
                </td>
                <td class="style4">
                </td>
            </tr>
            <tr>
                <td class="style2">
                    &nbsp;</td>
                <td class="style1">
                    &nbsp;</td>
            </tr>
            <tr>
                <td class="style2">
                    <asp:TextBox ID="SourceUrlTextBox" runat="server" 
                        Width="794px" EnableViewState="False"></asp:TextBox>
                    <asp:CheckBox ID="ShortLivingCheckBox" runat="server" AutoPostBack="True" 
                        Text="Short Living Document" />
                </td>
                <td class="style1">
                    <asp:Button ID="ButtonConvert" runat="server" onclick="OnButtonConvertClick" 
                        Text="Convert To Pdf" Width="130px" />
                </td>
            </tr>
            <tr>
                <td class="style2">
                    Pdf Id =
                    <asp:Label ID="PdfIdLabel" runat="server"></asp:Label>
                </td>
                <td class="style1">
                    &nbsp;</td>
            </tr>
            <tr>
                <td class="style2">
                    Status =                     <asp:Label ID="StatusLabel" runat="server"></asp:Label>
                </td>
                <td class="style1">
                    <asp:Button ID="ButtonStatus" runat="server" onclick="ButtonStatus_Click" 
                        Text="Get Status" />
                </td>
            </tr>
        </table>
    </p>
    <asp:Button ID="ButtonPurge" runat="server" onclick="OnPurge" Text="Clean" />
    <asp:Label ID="Label1" runat="server" 
        Text="Purge documents older than (hours)  "></asp:Label>
    <asp:TextBox ID="OldnessTextBox" runat="server" AutoCompleteType="Disabled" 
        Width="29px">24</asp:TextBox>
    </form>
</body>
</html>
