import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import constants from "@/services/constants"

const InvoicePreview = ({ invoiceData, download, setDownload }) => {
  const invoiceRef = useRef();

  // Light green color palette
  const lightGreen = "#4caf50"; // main light green color
  const lightGreenBorder = "#a5d6a7"; // lighter green for borders
  const lightGreenBg = "#e8f5e9"; // very light green background if needed

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 35,
    fontSize: "12px",
    border: `1px solid black`,
  };

  const thTdStyle = {
    border: `1px solid black`,
    padding: "8px",
    textAlign: "right",
    // color: lightGreen,
  };

  const clientTableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 35,
    fontSize: "12px",
    border: `1px solid black`, // outer border in light green
  };

  const clientThTdStyle = {
    padding: "8px",
    textAlign: "right",
    borderLeft: `1px solid black`,
    // color: lightGreen,
  };

  const sectionHeaderStyle = {
    // color: lightGreen,
    marginBottom: 10,
    backgroundColor: "#f9fff9",
    fontWeight: "bold",
    fontSize: 14,
    // borderBottom: `2px solid ${lightGreen}`,
    paddingBottom: 4,
  };

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    // const canvas = await html2canvas(element, { scale: 2 });
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true, // Handle external fonts/images
      backgroundColor: null, // Transparent background
      scrollY: 0, // <-- fix for cropped bottom borders
    });
    const imgData = canvas.toDataURL("image/png");
    // const pdf = new jsPDF("p", "mm", "a4");
    // const imgProps = pdf.getImageProperties(imgData);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    // pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight(); // force fixed A4 height

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("invoice.pdf");
    setDownload(false);
  };

  useEffect(() => {
    if (download && invoiceRef.current) {
      downloadPDF();
    }
  }, [download]);

  return (
    <div
      ref={invoiceRef}
      style={{
        direction: "rtl",
        padding: 30,
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        // color: lightGreen,
        border: `1px solid black`,
        margin: 15,
        // backgroundColor: "#f9fff9",
        border: `1px solid black`, // outer border in light green
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <img src="/images/logo.svg" alt="Logo" style={{ height: 60 }} />
        </div>
      </div>

      <hr style={{ margin: "20px 0", border: `1px solid ${lightGreen}` }} />

      {/* Client Info Section Title */}
      {/* <h2 style={sectionHeaderStyle}>معلومات العميل</h2> */}
      {/* Client Info */}
      <table style={clientTableStyle}>
        <tbody>
          <tr>
            <td style={{ ...clientThTdStyle }} colSpan={2}>
              <strong>اسم العميل:</strong> {invoiceData?.data?.Body?.To}
            </td>
            <td style={{ ...clientThTdStyle }}>
              <strong>اسم المفوتر:</strong> {invoiceData?.data?.Body?.From}
            </td>
          </tr>
          <tr>
            <td style={{ ...clientThTdStyle }} colSpan={2}>
              {/* <strong>رقم الجوال :</strong> 0576487565 */}
            </td>
            <td style={{ ...clientThTdStyle }}>
              <strong>رقم هاتف الدعم:</strong> 920008806
            </td>
          </tr>
          <tr>
            <td style={{ ...clientThTdStyle }} colSpan={2}>
              {/* <strong>العنوان:</strong> الرياض، الحي، اسم الشارع */}
            </td>
            <td style={{ ...clientThTdStyle }}>
              <strong>الرقم الضريبي:</strong> 4030545821
            </td>
          </tr>
          <tr>
            <td style={{ ...clientThTdStyle }} colSpan={2}>
              {/* <strong>العنوان:</strong> الرياض، الحي، اسم الشارع */}
            </td>
            <td style={{ ...clientThTdStyle }} colSpan={2}>
              <strong>العنوان:</strong> جدة حي الرويس شارع حائل 23213
            </td>
          </tr>
        </tbody>
      </table>

      {/* Invoice Info Section Title */}
      {/* <h2 style={sectionHeaderStyle}>معلومات الفاتورة</h2> */}
      {/* Invoice Info */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>رقم العقد</th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>حالة العقد</th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              رقم الفاتورة
            </th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              تاريخ استحقاق الفاتورة{" "}
            </th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              تاريخ إصدار الفاتورة
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={thTdStyle}>{invoiceData?.data?.Body.InvoiceNo}</td>
            <td style={thTdStyle}>{invoiceData?.data?.Body.Status}</td>
                        <td style={thTdStyle}>{invoiceData?.data?.Body?.Bills[0]?.BillNo}</td>

            <td style={thTdStyle}>{invoiceData?.data.Body.DueDate}</td>
            <td style={thTdStyle}>{invoiceData?.data.Body.IssueDate}</td>
          </tr>
        </tbody>
      </table>

      {/* Products Section Title */}
      {/* <h2 style={sectionHeaderStyle}>جدول المنتجات</h2> */}
      {/* Products Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>#</th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>اسم المنتج</th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>الكمية</th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>السعر ({constants.symbol({ width: { xs: "12px", md: "14px" } })}
)</th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              نسبة الضريبة
            </th>
            <th style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              المبلغ الاجمالي ({constants.symbol({ width: { xs: "12px", md: "14px" } })}
) (شامل ضريبة القيمة المضافة)
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceData?.data.Body.Bills.map((item, idx) => (
            <tr key={idx}>
              <td style={thTdStyle}>{idx + 1}</td>
              <td style={thTdStyle}>{item.name ?? "-"}</td>
              <td style={thTdStyle}>{item.quantity ?? 1}</td>
              <td style={thTdStyle}>{item.Amount} {constants.symbol({ width: { xs: "12px", md: "14px" } })}
 </td>
              <td style={thTdStyle}>{item.tax ?? "-"}</td>
              <td style={thTdStyle}>{item.Amount} {constants.symbol({ width: { xs: "12px", md: "14px" } })}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section Title */}
      {/* <h2 style={sectionHeaderStyle}>ملخص الفاتورة</h2> */}
      {/* Summary */}
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={thTdStyle}>
              <strong>المبلغ الإجمالي الفرعي</strong>
            </td>
            <td style={thTdStyle}>
              {invoiceData?.data.Body?.TotalAmount ?? "0.00"} {constants.symbol({ width: { xs: "12px", md: "14px" } })}

            </td>
          </tr>
          <tr>
            <td style={thTdStyle}>
              <strong>الاجمالي الخاضع للضريبة</strong>
            </td>
            <td style={thTdStyle}>
              {invoiceData?.data.Body?.TotalAmount ?? "0.00"} {constants.symbol({ width: { xs: "12px", md: "14px" } })}

            </td>
          </tr>
          <tr>
            <td style={thTdStyle}>
              <strong>مجموع ضريبة القيمة المضافة</strong>
            </td>
            <td style={thTdStyle}>
              {invoiceData?.data.Body?.total ?? "0.00"} {constants.symbol({ width: { xs: "12px", md: "14px" } })}

            </td>
          </tr>
          <tr>
            <td style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              <strong>المبلغ الاجمالي</strong>
            </td>
            <td style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              {invoiceData?.data.Body?.TotalAmount ?? "0.00"} {constants.symbol({ width: { xs: "12px", md: "14px" } })}

            </td>
          </tr>
          <tr>
            <td style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              <strong>المبلغ الاجمال المستحق</strong>
            </td>
            <td style={{ ...thTdStyle, ...sectionHeaderStyle }}>
              {invoiceData?.data.Body?.TotalAmount ?? "0.00"} {constants.symbol({ width: { xs: "12px", md: "14px" } })}

            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer with QR Code */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 30,
          // color: lightGreen,
          fontSize: 11,
          lineHeight: "1.8",
          textAlign: "right",
        }}
      >
        <div
        // style={{
        //   marginBottom: 30,
        // }}
        >
          طرق الدفع المتاحة- سداد- مدى- فيزا- ماستر كارد
          <br />
          الشروط: لا
          <br />
          هذه الفاتورة صالحة من تاريخ{" "}
          {moment(invoiceData?.data?.Body?.IssueDate).format("YYYY/MM/DD")}
          {/* من
          الساعة {moment(invoiceData?.data?.Body?.from_date).format("hh:mm A")}{" "} */}
          إلى تاريخ{" "}
          {moment(invoiceData?.data?.Body?.DueDate).format("YYYY/MM/DD")}
          {/* حتى
          الساعة {moment(invoiceData?.data?.Body?.to_date).format("hh:mm A")} */}
          <br />
          رقم المفوتر في سداد إيداعات: {invoiceData?.data?.Body?.biller_number}
          <br />
          رقم فاتورة سداد:{invoiceData?.data?.Body?.InvoiceNo}
          <br />
          {/* رقم الفاتورة: {invoiceData?.data?.Body?.InvoiceNo} */}
          <br />
        </div>
        <div>
          <img
            src="/images/notification-icon.svg"
            alt="QR Code"
            style={{ width: 100, height: 100 }}
          />
        </div>
      </div>
      <span
        style={{ textAlign: "center", display: "block", marginBottom: "12px" }}
      >
        هذه الفاتورة صادرة من نظام إيداعات
      </span>
    </div>
  );
};

export default InvoicePreview;
