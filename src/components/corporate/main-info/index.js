import { useTranslation } from "next-i18next";
import React from "react";
import SectionHead from "./section-head";
import { Box, Typography } from "@mui/material";
import LabelData from "./label-data";
import { formatDate, getFileType } from "@/services/utils";
import File from "@/components/file";
import { styles } from "../style";
import constants from "@/services/constants";
export default function CorMainInfo({ info, request }) {
  const { t } = useTranslation();
  return (
    <div>
      <SectionHead
        title={t("components_corporate_main-info_index.المعلومات_الرئيسية")}
        customStyle={{
          bgcolor: "#fff",
          borderRadius: "20px",
          padding: { xs: "12px", md: "16px 0px" },
        }}
        childrenStyle={{
          bgcolor: constants.colors.light_grey,
          border: "1px solid #E1E1E2",
          borderRadius: { xs: "16px", md: "24px" },
          padding: { xs: "16px", md: " 20px" },
        }}
      >
        <Box
          sx={{
            ...styles.rowBox,
            bgcolor: "inherit",
          }}
        >
          <LabelData label={t("components_corporate_main-info_index.اسم_الشركة")} value={info?.companyName} />
          <LabelData
            label={t("components_corporate_main-info_index.تابع_لإنفاذ")}
            value={info?.approvedByNafath == true ? t("components_corporate_main-info_index.نعم") : t("components_corporate_main-info_index.لا")}
          />
          <LabelData
            label=" هل ترغب بتقديم طلب الاعتماد"
            value={info?.accreditationRequest == true ? t("components_corporate_main-info_index.نعم") : t("components_corporate_main-info_index.لا")}
          />

          <LabelData
            label={t("components_corporate_main-info_index.رقم_رخصة_فال_للمزادات")}
            value={info?.valAuctionsLicense?.number}
          />
        </Box>

        <Box sx={{ ...styles.rowBox, bgcolor: "inherit" }}>
          <LabelData
            label={t("components_corporate_main-info_index.رقم_السجل_التجاري")}
            value={info?.commercialRegistration?.number}
          />
          <LabelData
            label={t("components_corporate_main-info_index.تاريخ_الإصدار")}
            value={formatDate(info?.commercialRegistration?.startDate)}
          />
          <LabelData
            label={t("components_corporate_main-info_index.تاريخ_الانتهاء")}
            value={formatDate(info?.commercialRegistration?.endDate)}
          />
        </Box>
        <Box
          sx={{
            ...styles.rowBox,
            justifyContent: "space-between",
            bgcolor: "inherit",
          }}
        >
          <LabelData label={t("components_corporate_main-info_index.الضريبة")} value={info?.tax?.type} />
          {info?.tax?.type == t("components_corporate_main-info_index.خاضع_للضريبة") && (
            <LabelData label={t("components_corporate_main-info_index.الرقم_الضريبي")} value={info?.tax?.number} />
          )}

          <LabelData
            label={t("components_corporate_main-info_index.رقم_الجوال")}
            value={info?.companyPhoneNumber?.number}
          />
        </Box>
        <Box sx={{ ...styles.rowBox, bgcolor: "inherit" }}>
          <LabelData label="البريد الاليكتروني " value={info?.companyEmail} />
          <Box
            sx={{
              flex: 2,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            {info?.tax?.type == t("components_corporate_main-info_index.خاضع_للضريبة") && (
              <File
                href={info?.tax?.taxAttachment}
                type={getFileType(info?.tax?.taxAttachment)}
                title={t("components_corporate_main-info_index.شهادة_التسجيل_الضريبي")}
              />
            )}
            <File
              href={info?.valAuctionsLicense?.valAttachment}
              type={getFileType(info?.valAuctionsLicense?.valAttachment)}
              title={t("components_corporate_main-info_index.رخصة_فال_للمزادات")}
            />
            <File
              href={info?.commercialRegistration?.commercialAttachment}
              type={getFileType(
                info?.commercialRegistration?.commercialAttachment
              )}
              title={t("components_corporate_main-info_index.السجل_التجاري")}
            />
          </Box>
        </Box>
      </SectionHead>

      <SectionHead
        title={t("components_corporate_main-info_index.معلومات_المفوض")}
        customStyle={{
          bgcolor: "#fff",
          borderRadius: "20px",
          padding: "16px",
        }}
        childrenStyle={{
          bgcolor: constants.colors.light_grey,
          border: "1px solid #E1E1E2",
          borderRadius: { xs: "16px", md: "24px" },
          padding: { xs: "16px", md: " 20px" },
        }}
      >
        <Box
          sx={{
            ...styles.rowBox,
            bgcolor: "inherit",
          }}
        >
          <LabelData
            label={t("components_corporate_main-info_index.الأسم")}
            value={request ? info?.user?.name : info?.name}
          />
          <LabelData
            label={t("components_corporate_main-info_index.البريد_الاليكتروني")}
            value={request ? info?.user?.email : info?.email}
          />
          <LabelData
            label={t("components_corporate_main-info_index.رقم_الهوية")}
            value={request ? info?.user?.identityNumber : info?.identityNumber}
          />
        </Box>
        <Box
          sx={{
            ...styles.rowBox,
            bgcolor: "inherit",
          }}
        >
          <LabelData
            label={t("components_corporate_main-info_index.رقم_الجوال")}
            value={
              request
                ? info?.user?.phoneNumber?.number
                : info?.phoneNumber?.number
            }
          />
          <Box
            sx={{
              flex: 2,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <File
              href={
                request
                  ? info?.user?.commissionerAttachments?.identityAttachment
                  : info?.commissionerAttachments?.identityAttachment
              }
              type={getFileType(
                request
                  ? info?.user?.commissionerAttachments?.identityAttachment
                  : info?.commissionerAttachments?.identityAttachment
              )}
              title={t("components_corporate_main-info_index.مرفق_هوية_المفوض")}
            />
            <File
              href={
                request
                  ? info?.user?.commissionerAttachments?.articlesOfAssociation
                  : info?.commissionerAttachments?.articlesOfAssociation
              }
              type={getFileType(
                request
                  ? info?.user?.commissionerAttachments?.articlesOfAssociation
                  : info?.commissionerAttachments?.articlesOfAssociation
              )}
              title={t("components_corporate_main-info_index.مرفق_عقد_التأسيس")}
            />
            <File
              href={
                request
                  ? info?.user?.commissionerAttachments?.letterOfAuthorization
                  : info?.commissionerAttachments?.letterOfAuthorization
              }
              type={getFileType(
                request
                  ? info?.user?.commissionerAttachments?.letterOfAuthorization
                  : info?.commissionerAttachments?.letterOfAuthorization
              )}
              title={t("components_corporate_main-info_index.مرفق_خطاب_التفويض")}
            />
          </Box>
        </Box>
      </SectionHead>
      <SectionHead
        title={t("components_corporate_main-info_index.البيانات_المالية")}
        customStyle={{
          bgcolor: "#fff",
          borderRadius: "20px",
          padding: "16px",
        }}
        childrenStyle={{
          bgcolor: constants.colors.light_grey,
          border: "1px solid #E1E1E2",
          borderRadius: { xs: "16px", md: "24px" },
          padding: { xs: "16px", md: " 20px" },
        }}
      >
        <Box
          sx={{
            ...styles.rowBox,
            bgcolor: "inherit",
          }}
        >
          <LabelData
            label={t("components_corporate_main-info_index.رقم_الايبان")}
            value={info?.bankAccountInformation?.accountNumber}
          />
          <LabelData
            label={t("components_corporate_main-info_index.إسم_البنك")}
            value={info?.bankAccountInformation?.bankName}
          />
          <File
            href={info?.bankAccountInformation?.bankCertificate}
            type={getFileType(info?.bankAccountInformation?.bankCertificate)}
            title={t("components_corporate_main-info_index.الشهادة_المصرفية")}
          />
        </Box>
      </SectionHead>
    </div>
  );
}
// import React from "react";
// import SectionHead from "./section-head";
// import { Box } from "@mui/material";
// import LabelData from "./label-data";
// import { formatDate, getFileType } from "@/services/utils";
// import File from "@/components/file";
// import { styles } from "../style";

// export default function CorMainInfo({ info, request, reverse }) {
//   const commissionerSection = (
//     <SectionHead title={!reverse ? t("components_corporate_main-info_index.معلومات_المفوض") : t("components_corporate_main-info_index.معلومات_الموظف")}>
//       <Box sx={{ ...styles.rowBox }}>
//         <LabelData
//           label={t("components_corporate_main-info_index.الأسم")}
//           value={request ? info?.user?.name : info?.name}
//         />
//         <LabelData
//           label={t("components_corporate_main-info_index.البريد_الاليكتروني")}
//           value={request ? info?.user?.email : info?.email}
//         />
//         <LabelData
//           label={t("components_corporate_main-info_index.رقم_الهوية")}
//           value={request ? info?.user?.identityNumber : info?.identityNumber}
//         />
//       </Box>
//       <Box sx={{ ...styles.rowBox }}>
//         {/* {reverse && (
//           <>
//             <LabelData
//               label={t("components_corporate_main-info_index.تاريخ_الميلاد")}
//               value={request ? info?.user?.birthDate : info?.birthDate}
//             />
//           </>
//         )} */}
//         <LabelData
//           label={t("components_corporate_main-info_index.رقم_الجوال")}
//           value={
//             request
//               ? info?.user?.phoneNumber?.number
//               : info?.phoneNumber?.number
//           }
//         />
//         {!reverse && (
//           <>
//             <Box
//               sx={{
//                 flex: 2,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 flexDirection: {
//                   xs: "column",
//                   sm: "row",
//                 },
//               }}
//             >
//               <File
//                 href={
//                   request
//                     ? info?.user?.commissionerAttachments?.identityAttachment
//                     : info?.commissionerAttachments?.identityAttachment
//                 }
//                 type={getFileType(
//                   request
//                     ? info?.user?.commissionerAttachments?.identityAttachment
//                     : info?.commissionerAttachments?.identityAttachment
//                 )}
//                 title={t("components_corporate_main-info_index.مرفق_هوية_المفوض")}
//               />
//               <File
//                 href={
//                   request
//                     ? info?.user?.commissionerAttachments?.articlesOfAssociation
//                     : info?.commissionerAttachments?.articlesOfAssociation
//                 }
//                 type={getFileType(
//                   request
//                     ? info?.user?.commissionerAttachments?.articlesOfAssociation
//                     : info?.commissionerAttachments?.articlesOfAssociation
//                 )}
//                 title={t("components_corporate_main-info_index.مرفق_عقد_التأسيس")}
//               />
//               <File
//                 href={
//                   request
//                     ? info?.user?.commissionerAttachments?.letterOfAuthorization
//                     : info?.commissionerAttachments?.letterOfAuthorization
//                 }
//                 type={getFileType(
//                   request
//                     ? info?.user?.commissionerAttachments?.letterOfAuthorization
//                     : info?.commissionerAttachments?.letterOfAuthorization
//                 )}
//                 title={t("components_corporate_main-info_index.مرفق_خطاب_التفويض")}
//               />
//             </Box>
//           </>
//         )}
//       </Box>
//     </SectionHead>
//   );

//   const mainInfoSection = (
//     <SectionHead title={t("components_corporate_main-info_index.المعلومات_الرئيسية")}>
//       <Box sx={{ ...styles.rowBox }}>
//         <LabelData label={t("components_corporate_main-info_index.اسم_الشركة")} value={info?.companyName} />
//         <LabelData label={t("components_corporate_main-info_index.النشاط_العقاري")} value={info?.realEstateActivity} />
//         <LabelData
//           label={t("components_corporate_main-info_index.رقم_رخصة_فال_للمزادات")}
//           value={info?.valAuctionsLicense?.number}
//         />
//       </Box>
//       <Box sx={{ ...styles.rowBox }}>
//         <LabelData
//           label={t("components_corporate_main-info_index.رقم_السجل_التجاري")}
//           value={info?.commercialRegistration?.number}
//         />
//         <LabelData
//           label={t("components_corporate_main-info_index.تاريخ_الإصدار")}
//           value={formatDate(info?.commercialRegistration?.startDate)}
//         />
//         <LabelData
//           label={t("components_corporate_main-info_index.تاريخ_الانتهاء")}
//           value={formatDate(info?.commercialRegistration?.endDate)}
//         />
//       </Box>
//       <Box sx={{ ...styles.rowBox, justifyContent: "space-between" }}>
//         <LabelData label={t("components_corporate_main-info_index.الضريبة")} value={info?.tax?.type} />
//         {info?.tax?.type === t("components_corporate_main-info_index.خاضع_للضريبة") && (
//           <LabelData label={t("components_corporate_main-info_index.الرقم_الضريبي")} value={info?.tax?.number} />
//         )}
//         <LabelData
//           label={t("components_corporate_main-info_index.رقم_الجوال")}
//           value={info?.companyPhoneNumber?.number}
//         />
//       </Box>
//       <Box sx={{ ...styles.rowBox }}>
//         <LabelData label="البريد الاليكتروني " value={info?.companyEmail} />
//         <Box
//           sx={{
//             flex: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             flexDirection: {
//               xs: "column",
//               sm: "row",
//             },
//           }}
//         >
//           {info?.tax?.type === t("components_corporate_main-info_index.خاضع_للضريبة") && (
//             <File
//               href={info?.tax?.taxAttachment}
//               type={getFileType(info?.tax?.taxAttachment)}
//               title={t("components_corporate_main-info_index.شهادة_التسجيل_الضريبي")}
//             />
//           )}
//           <File
//             href={info?.valAuctionsLicense?.valAttachment}
//             type={getFileType(info?.valAuctionsLicense?.valAttachment)}
//             title={t("components_corporate_main-info_index.رخصة_فال_للمزادات")}
//           />
//           <File
//             href={info?.commercialRegistration?.commercialAttachment}
//             type={getFileType(
//               info?.commercialRegistration?.commercialAttachment
//             )}
//             title={t("components_corporate_main-info_index.السجل_التجاري")}
//           />
//         </Box>
//       </Box>
//     </SectionHead>
//   );

//   const financialDataSection = (
//     <SectionHead title={t("components_corporate_main-info_index.البيانات_المالية")}>
//       <Box sx={{ ...styles.rowBox }}>
//         <LabelData
//           label={t("components_corporate_main-info_index.رقم_الايبان")}
//           value={info?.bankAccountInformation?.accountNumber}
//         />
//         <LabelData
//           label={t("components_corporate_main-info_index.إسم_البنك")}
//           value={info?.bankAccountInformation?.bankName}
//         />
//         <File
//           href={info?.bankAccountInformation?.bankCertificate}
//           type={getFileType(info?.bankAccountInformation?.bankCertificate)}
//           title={t("components_corporate_main-info_index.الشهادة_المصرفية")}
//         />
//       </Box>
//     </SectionHead>
//   );

//   return (
//     <div>
//       {reverse ? (
//         <>
//           {commissionerSection}
//           {mainInfoSection}
//           {financialDataSection}
//         </>
//       ) : (
//         <>
//           {mainInfoSection}
//           {financialDataSection}
//           {commissionerSection}
//         </>
//       )}
//     </div>
//   );
// }
