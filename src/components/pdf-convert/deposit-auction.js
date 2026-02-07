




import React, { useEffect, useRef, forwardRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { footerHTML, pdfStyle } from "./pdf-style";
import { formatDate, formatNumber } from "@/services/utils";
import constants from "@/services/constants";

const DepositAuction = forwardRef(
  ({  Data,selectedOrigin, auctionData, download, setDownload, awardedUser }, ref) => {
    const invoiceRef = useRef();
console.log(Data);

    useEffect(() => {
      if (download && invoiceRef.current) {
        setTimeout(() => {
          generatePDF();
        }, 300);
      }
    }, [download]);

    const styleObjectToString = (styleObj) =>
      Object.entries(styleObj)
        .map(([key, value]) =>
          `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}:${value}`
        )
        .join(";");

    const thStyle = styleObjectToString({
      ...pdfStyle.thTdStyle,
      backgroundColor: "#f0f0f0",
    });
    const tdStyle = styleObjectToString({
      ...pdfStyle.thTdStyle,
    });
    const tableTitle = styleObjectToString({
      ...pdfStyle.tableTitle,
    });

    const entryDeposit = Number(selectedOrigin?.entryDeposit || 0);
    const userName = awardedUser?.name || "—";
    const identityNumber = awardedUser?.identityNumber || "—";
    const phone =`966${awardedUser?.phoneNumber?.number }+` || "—";


    const combinedAuctionInfo = [
      { label: "اسم المزاد", value: auctionData?.title || "—" },
      { label: "رقم الصك", value: selectedOrigin?.deedNumber || "—" },
      { label: "العربون", value: formatNumber(entryDeposit) },
      // { label: "المبلغ", value: formatNumber(entryDeposit) },
      {
        label: "تاريخ الدفع",
        value:
            formatDate(Data?.createdAt, "YYYY-MM-DD HH:mm:ss")
      },
    ];

    const awardedUserInfo = [
      { label: "الاسم", value: userName },
      { label: "السجل المدني", value: identityNumber },
      { label: "رقم الجوال", value: phone },
    ];

    const generatePDF = async () => {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const combinedAuctionHTML = combinedAuctionInfo
        .map(
          (item) => `
<tr>
  <td style="${thStyle};width:30%;">${item.label}</td>
  <td style="${tdStyle};width:70%;">${item.value}</td>
</tr>`
        )
        .join("");

      const awardedUserHTML = awardedUserInfo
        .map(
          (item) => `
<tr>
  <td style="${thStyle};width:30%;">${item.label}</td>
  <td style="${tdStyle};width:70%;">${item.value}</td>
</tr>`
        )
        .join("");

      const page = document.createElement("div");
      page.style.width = "210mm";
      page.style.minHeight = "297mm";
      page.style.padding = "30px";
      page.style.fontFamily = "LamaSans";
      page.style.fontSize = "13px";
      page.style.direction = "rtl";
      page.style.background = "#fff";
      page.style.position = "absolute";
      page.style.top = "-9999px";
// page.innerHTML = `
//   <div style="position:relative; min-height:297mm;">
//     <div style="padding-bottom: 60px;">
//       <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
//         <h2>سند استلام عربون</h2>
//         <img src="/images/logo.svg" style="height:60px;" />
//       </div>
//       <hr style="border:1px solid ${constants.colors.dark_green}; margin:20px 0;" />

//       <h3 style="${tableTitle}">بيانات المزاد</h3>
//       <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 30px">
//         <tbody>
//           ${combinedAuctionHTML}
//         </tbody>
//       </table>

//       <h3 style="${tableTitle}">المعلومات</h3>
//       <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 30px">
//         <tbody>
//           ${awardedUserHTML}
//         </tbody>
//       </table>
//     </div>

//     ${footerHTML}
//   </div>
// `;
page.innerHTML = `
  <div style="position:relative; min-height:297mm; padding-bottom: 80px;">
    <!-- Header -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <h2>سند استلام عربون</h2>
      <img src="/images/logo.svg" style="height:60px;" />
    </div>

    <!-- Divider -->
    <hr style="border:1px solid ${constants.colors.dark_green}; margin:20px 0;" />

    <!-- Auction Info -->
    <h3 style="${tableTitle}">بيانات المزاد</h3>
    <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 30px">
      <tbody>
        ${combinedAuctionHTML}
      </tbody>
    </table>

    <!-- User Info -->
    <h3 style="${tableTitle}">المعلومات</h3>
    <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 30px">
      <tbody>
        ${awardedUserHTML}
      </tbody>
    </table>

    <!-- Fixed Footer -->
    <div style="position:absolute; bottom:30px; left:30px; right:30px;">
      ${footerHTML}
    </div>
  </div>
`;

      document.body.appendChild(page);
      const canvas = await html2canvas(page, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      document.body.removeChild(page);

      pdf.save(`سند-عربون-${auctionData?.title || "مزاد"}.pdf`);
      setDownload(false);
    };

    return <div ref={invoiceRef}></div>;
  }
);

export default DepositAuction;
