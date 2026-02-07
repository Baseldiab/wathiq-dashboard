import constants from "@/services/constants";

// Light green color palette
const lightGreen = "#4caf50"; // main light green color
const lightGreenBorder = "#a5d6a7"; // lighter green for borders
const lightGreenBg = "#e8f5e9";
export const pdfStyle = {
  // very light green background if needed

  tableStyle: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 35,
    fontSize: "12px",
    border: `1px solid black`,
  },

  clientTableStyle: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 35,
    fontSize: "12px",
    border: `1px solid black`, // outer border in light green
  },

  clientThTdStyle: {
    padding: "8px",
    textAlign: "right",
    borderLeft: `1px solid black`,
    // color: lightGreen,
  },

  sectionHeaderStyle: {
    // color: lightGreen,
    marginBottom: 10,
    backgroundColor: "#f9fff9",
    fontWeight: "bold",
    fontSize: 14,
    // borderBottom: `2px solid ${lightGreen}`,
    paddingBottom: 4,
  },
  tableCellStyle: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
    fontSize: "14px",
  },
  thTdStyle: {
    border: `1px solid black`,
    padding: "8px",
    textAlign: "right",
    fontSize: "14px",
  },

  tableTitle: {
    fontSize: "16px",
    color: constants.colors.dark_green,
    marginBottom: 20,
    fontWeight: "300",
  },
};
export const footerHTML = `
  <div style="width:100%; display:flex; align-items:flex-end; justify-content:space-between; padding:30px 0 0 0; color:#b1b7c1; font-size:12px; font-family:LamaSans; font-weight:300; min-height:90px;">
    <div style="display:flex; align-items:flex-center; gap:14px;">
      <img src="/images/logo.svg" style="height:60px;"/>
      <div style="display:flex; flex-direction:column; gap:3px;">
       <span style="color:#b1b7c1; font-size:12px; font-weight:300;">جدة حي الرويس شارع حائل 23213</span>
      <span style="color:#b1b7c1; font-size:12px; font-weight:300;">Jeddah, Al-Ruwais District,
       <br/> Hail Street 23213</span> 
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:3px; align-items:flex-end;">
        <a href="https://broker.sa" style="color:#b1b7c1; text-decoration:none; font-size:12px; font-weight:300;">https://broker.sa</a>
        <span style="color:#b1b7c1; font-size:12px; font-weight:300;">info@broker.sa</span>
        <span style="color:#b1b7c1; font-size:12px; font-weight:300;">920008806</span>
    </div>
  </div>
`;
export const sar = `
  <img
    src="/icons/sar-black.svg"
    style="height:12px; display:inline-block; margin-right:4px;"
  />`;
