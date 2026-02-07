import React, { useEffect, useRef, forwardRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { footerHTML, pdfStyle, sar } from "./pdf-style";
import { formatDate, formatNumber } from "@/services/utils";
import constants from "@/services/constants";
import SAR from "../sar";

const EnrollmentData = forwardRef(
  (
    {
      biddingBoard,
      selectedOrigin,
      auctionData,
      download,
      setDownload,
      awardedUser,
    },
    ref
  ) => {
    const invoiceRef = useRef();
    const lightGreen = "#4caf50";
    console.log("*********winnerUser in pdf***");
    const winnerUser = selectedOrigin?.winnerUser;

    useEffect(() => {
      if (download && invoiceRef.current) {
        setTimeout(() => {
          generatePDF();
        }, 300);
      }
    }, [download]);

    const styleObjectToString = (styleObj) =>
      Object.entries(styleObj)
        .map(
          ([key, value]) =>
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

    const generatePDF = async () => {
      const pageSize = 24;
      const pages = Math.ceil(biddingBoard.length / pageSize);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const auctionInfoHTML = auctionInfo
        .map(
          (item) => `
    <tr>
      <td style="${thStyle};width:30%;">${item.label}</td>
      <td style="${tdStyle};width:70%;">${item.value}</td>
    </tr>`
        )
        .join("");
      const priceInfoHTML = priceInfo
        ?.map(
          (item) => `
    <tr>
      <td style="${thStyle};width:70%;">${item.label}</td>
      <td style="${tdStyle};width:30%;">${item.value}</td>
    </tr>`
        )
        .join("");

      const awardedUserInfoHTML = awardedUserInfo
        .map(
          (item) => `
      <tr>
        <td style="${thStyle};width:30%;">${item.label}</td>
        <td style="${tdStyle};width:70%;">${item.value}</td>
      </tr>`
        )
        .join("");
      const beneficiaryInfoHTML = beneficiaryInfo
        .map(
          (item) => `
      <tr>
        <td style="${thStyle};width:30%;">${item.label}</td>
        <td style="${tdStyle};width:70%;">${item.value}</td>
      </tr>`
        )
        .join("");

      const firstPage = document.createElement("div");
      firstPage.style.width = "210mm";
      firstPage.style.minHeight = "297mm";
      firstPage.style.padding = "30px";
      firstPage.style.direction = "rtl";
      firstPage.style.fontFamily = "LamaSans";
      firstPage.style.fontSize = "13px";
      firstPage.style.background = "#fff";
      firstPage.style.position = "absolute";
      firstPage.style.top = "-9999px";

      firstPage.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <h2>تقرير مخرجات المزاد</h2>
      <img src="/images/logo.svg" style="height:60px;" />
    </div>
    <hr style="border:1px solid ${
      constants.colors.dark_green
    }; margin:20px 0;" />
    <h3 style="${tableTitle}">ملخص المزاد</h3>
        <br/>
<p style="font-size:14px;mb:10px">تم اقامة مزاد " ${
        auctionData?.title
      } " - صفقة "${selectedOrigin?.title}" 
       ${
         auctionData?.provider?.companyName
           ? `<span style="font-size:14px; margin-bottom:20px;font-weight:300"> - عبر وكيل بيع " ${auctionData.provider.companyName} "</س>`
           : ""
       }
      </p>
    <br/>


    <h3 style="${tableTitle}">بيانات المزاد</h3>
    <br/>
    <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 50px">
      <tbody>${auctionInfoHTML}</tbody>
    </table>`;

      // 1. ملخص المزاد
      document.body.appendChild(firstPage);
      const canvas1 = await html2canvas(firstPage, { scale: 2 });
      const img1 = canvas1.toDataURL("image/jpeg", 1.0);
      pdf.addImage(img1, "JPEG", 0, 0, pdfWidth, pdfHeight);
      document.body.removeChild(firstPage);

      // 2. صفحات المزايدات
      for (let i = 0; i < biddingBoard.length; i += pageSize) {
        const chunk = biddingBoard.slice(i, i + pageSize);
        const biddingPage = document.createElement("div");
        biddingPage.style.width = "210mm";
        biddingPage.style.minHeight = "297mm";
        biddingPage.style.padding = "30px";
        biddingPage.style.fontFamily = "LamaSans";
        biddingPage.style.fontSize = "13px";
        biddingPage.style.direction = "rtl";
        biddingPage.style.background = "#fff";
        biddingPage.style.position = "absolute";
        biddingPage.style.top = "-9999px";

        let footerForThisPage = "";
        if (!awardedUser && i + pageSize >= biddingBoard.length) {
          footerForThisPage = `
    <div style="position:absolute; bottom:60px; width:90%; text-align:center;">

        ${footerHTML}
      </div>
    `;
        }

        biddingPage.innerHTML = `
    <h3 style="${tableTitle}">ملخص المزايدات</h3>
    <br/>
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="${thStyle};text-align:center">رقم المزايدة</th>
          <th style="${thStyle};text-align:center">صاحب المزايدة - المشارك</th>
          <th style="${thStyle};text-align:center">التاريخ والوقت</th>
          <th style="${thStyle};text-align:center">سعر السوم</th>
        </tr>
      </thead>
      <tbody>
        ${chunk
          .map(
            (bid, index) => `
          <tr>
            <td style="${tdStyle};text-align:center">${i + index + 1}</td>
            <td style="${tdStyle};text-align:center">${
              bid?.user?.name || "—"
            }</td>
            <td style="${tdStyle};text-align:center">${formatDate(
              bid?.bidAt
            )}</td>
            <td style="${tdStyle};text-align:center">${formatNumber(
              bid?.bidAmount
            )}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
    ${footerForThisPage}
  `;

        document.body.appendChild(biddingPage);
        const canvas = await html2canvas(biddingPage, { scale: 2 });
        const img = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addPage();
        pdf.addImage(img, "JPEG", 0, 0, pdfWidth, pdfHeight);
        document.body.removeChild(biddingPage);
      }

      // 3. البيانات السعرية (لو فيه فائز)
      if (awardedUser) {
        const pricePage = document.createElement("div");
        pricePage.style.width = "210mm";
        pricePage.style.minHeight = "297mm";
        pricePage.style.padding = "30px";
        pricePage.style.fontFamily = "LamaSans";
        pricePage.style.fontSize = "13px";
        pricePage.style.direction = "rtl";
        pricePage.style.background = "#fff";
        pricePage.style.position = "absolute";
        pricePage.style.top = "-9999px";

        pricePage.innerHTML = `
   <br/>
    <h3 style="${tableTitle}">البيانات السعرية</h3>
        <br/>
    <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 50px">
      <tbody>
        ${priceInfoHTML}
      </tbody>
    </table>
     <h3 style="${tableTitle};margin-top:20px;">بيانات المزايد</h3>
     <br/>
  <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 30px">
    <tbody>
      ${awardedUserInfoHTML}
    </tbody>
  </table>
  <h3 style="${tableTitle}">المستفيد</h3>
    <br/>
    <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom: 40px">
      <tbody>
        ${beneficiaryInfoHTML}
      </tbody>
    </table>
   ${footerHTML}
  `;

        document.body.appendChild(pricePage);
        const priceCanvas = await html2canvas(pricePage, { scale: 2 });
        const priceImg = priceCanvas.toDataURL("image/jpeg", 1.0);
        pdf.addPage();
        pdf.addImage(priceImg, "JPEG", 0, 0, pdfWidth, pdfHeight);
        document.body.removeChild(pricePage);
      }

      pdf.save(`تقرير مخرجات المزاد (${selectedOrigin?.title})`);
      setDownload(false);
    };

    const getDescriptionForArea = (selectedOrigin) => {
      const boundaries = selectedOrigin?.details.find(
        (item) => item.title === "الحدود والمساحة"
      );

      if (boundaries) {
        const area = boundaries.auctionDetails.find(
          (detail) => detail.title === "المساحة"
        );

        if (area) {
          return +area.description;
        }
      }
      return "لا يوجد مساحه متاحة";
    };

    const area = getDescriptionForArea(selectedOrigin);
    const auctionInfo = [
      { label: "اسم المزاد", value: auctionData?.title },
      { label: "اسم الصفقة", value: selectedOrigin?.title },
      { label: "رقم الصك", value: selectedOrigin?._id },
      { label: "المساحة", value: area },
      {
        label: "العربون",
        value: `${formatNumber(selectedOrigin?.entryDeposit)} ${sar}`,
      },
      { label: "آيبان المزاد", value: "_" },
      { label: "اسم البنك", value: "_" },
      {
        label: "تاريخ ووقت بداية المزاد",
        value: formatDate(auctionData?.startDate),
      },
      {
        label: "تاريخ ووقت نهاية المزاد",
        value: formatDate(auctionData?.endDate),
      },
      { label: "عدد المزايدات", value: biddingBoard?.length },
      { label: "اسم رئيس اللجنة", value: "_" },
      {
        label: "هل تمت الترسية",
        value:
          selectedOrigin?.awardStatus === "pending" ||
          selectedOrigin?.awardStatus === "canceled"
            ? "لا"
            : "نعم",
      },
    ];
    const bidAmount = Number(awardedUser?.bidAmount) || 0;
    const entryDeposit = Number(selectedOrigin?.entryDeposit) || 0;
    const userName = awardedUser?.user?.name || "—";

    const vatWith =
      bidAmount * 0.05 + bidAmount * 0.025 + bidAmount * 0.025 * 0.25;
    const totalBid = bidAmount + vatWith;

    const priceInfo = [
      { label: "صاحب المزايدة - المشارك", value: userName },
      {
        label: "التاريخ و الوقت",
        value: formatDate(awardedUser?.bidAt) || "—",
      },
      { label: "سعر الترسية", value: `${formatNumber(bidAmount)} ${sar}` },
      { label: "سعر البيع", value: `${formatNumber(bidAmount)} ${sar}` },
      {
        label: "السعي شاملا ضريبة القيمة المضافة",
        value: `${formatNumber(vatWith)} ${sar}`,
      },
      {
        label: "الإجمالي الفرعي",
        value: `${formatNumber(totalBid)} ${sar}`,
      },
      {
        label: "المبلغ المحجوز من المنصة",
        value: `${formatNumber(entryDeposit)} ${sar}`,
      },
      {
        label: `المتبقي "ماينبغي تحويله ممن تمت ترسية المزاد عليه"`,
        value: `${formatNumber(totalBid - entryDeposit)} ${sar}`,
      },
    ];

    const awardedUserInfo = [
      { label: "اسم المزايد", value: userName },
      {
        label: "رقم الجوال",
        value: winnerUser?.phoneNumber?.number || "—",
      },
      {
        label: "الهوية الوطنية",
        value: awardedUser?.user?.identityNumber || "—",
      },
      { label: "الصفة", value: "—" },
      {
        label: "العربون المخصوم",
        value: `${formatNumber(entryDeposit)} ${sar}`,
      },
      {
        label: "طريقة تحصيل العربون",
        value: "شحن محفظة رقمیة عبر خدمة سداد",
      },
      { label: "وقت دفع العربون", value: "_" },
      { label: "رقم المضرب ", value: awardedUser?.participantNumber },
    ];
    const beneficiaryInfo = [
      { label: "نوع الإفراغ", value: "أصالة عن نفس" },
      {
        label: "الاسم",
        value: userName || "—",
      },
      {
        label: "النسبة",
        value: "100",
      },
    ];
    return (
      <div
        ref={invoiceRef}
        style={{
          direction: "rtl",
          padding: 30,
          fontFamily: "LamaSans",
          fontSize: 13,
          border: "1px solid black",
          margin: 15,
        }}
      >
        ""
      </div>
    );
  }
);

export default EnrollmentData;
