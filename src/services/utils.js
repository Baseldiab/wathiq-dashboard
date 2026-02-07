import { store } from "@/Redux/store/store";
// import jwt from "jsonwebtoken";
// import { Height } from "@mui/icons-material";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET;

export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const saudiPhoneRegex = /^5\d{8}$/;
export const saudiidentityNumberRegex = /^1\d{9}$/;
// export const generateToken = (data) => {
//   return jwt.sign(data, SECRET_KEY, {
//     expiresIn: "1m",
//   });
// };

export const buildQueryParams = (params) => {
  const query = Object.entries(params)
    .filter(([key, value]) => {
      // Include if value is non-empty, non-null, or an object with an id property
      return (
        value !== undefined &&
        value !== null &&
        (typeof value !== "object" || "_id" in value)
      );
    })
    .map(([key, value]) => {
      // If the value is an object with an id, use the id; otherwise, use the value directly
      if (typeof value === "object" && "_id" in value) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value._id)}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&"); // Join them with '&'
  return query;
};

export const isEmpty = (object = {}) => Object.keys(object).length === 0;
export const hideAllExceptLastFour = (number = "") =>
  number
    ? number.toString().slice(-3).padStart(number.toString().length, "")
    : "";

export const isEmptyObject = (data, messages) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;

  const errors = Object.keys(data).reduce((acc, key) => {
    if (
      data[key] === "" ||
      data[key] === null ||
      data[key]?.length === 0 ||
      (Object.keys(data[key])?.length === 0 &&
        data[key]?.constructor === Object)
    ) {
      if (messages[key]) acc[key] = messages[key];
      console.log(acc[key]);
    }

    // Validate password if the key is 'password'
    if (key === "password") {
      if (!data[key] || data[key].trim() === "") {
        acc[key] = messages.password; // Show required message first
      } else if (!passwordRegex.test(data[key])) {
        acc[key] =
          "يجب أن تكون كلمة المرور مكونة من 9 أحرف على الأقل وتتضمن أحرفاً وأرقاماً ورموزاً خاصة.";
      }
    }

    // Validate phone if the key is 'phone'
    if (key === "phone" && !saudiPhoneRegex.test(data[key])) {
      acc[key] = "يجب أن يكون رقم الجوال  مكونًا من 9 أرقام ويبدأ بـ '5'.";
    }
    // Validate identityNumber if the key is 'identityNumber'
    if (key === "identityNumber") {
      if (!data[key] || data[key].trim() === "") {
        acc[key] = messages.identityNumber;
      } else if (!saudiidentityNumberRegex.test(data[key])) {
        acc[key] = "يجب أن يكون رقم الهويه مكونًا من 10 أرقام ويبدأ بـ 1.";
      }
    }

    // Validate email if the key is 'email'
    if (key === "email" && !emailRegex.test(data[key])) {
      acc[key] = "يجب ان يكون بريد الكتروني صالح";
    }

    return acc;
  }, {});

  return errors;
};
export const setStatusStyle = (status) => {
  let borderColor;
  let style = {
    width: "80px",
    borderRadius: "4px",
    padding: "4px",
    fontWeight: 700,
    fontSize: "0.8rem",
    textAlign: "center",
    borderRadius: "100px",
  };
  switch (status) {
    case "نشط":
    case "مقبولة":
    case "قيد التنفيذ":
      return {
        ...style,
        color: "#219653",
        background: "rgba(33, 150, 83, 0.1)",
        // border: "1px solid #009499 ",
      };
    case "تحت الإجراء":
      return {
        ...style,
        color: "#9E5C21",
        background: "rgba(242, 153, 74, 0.1)",
        // border: "1px solid #BD7611 ",
      };
    case "قيد الانشاء":
    case "قيد المراجعه":
      return {
        ...style,
        color: "#9E5C21",
        background: "rgba(242, 153, 74, 0.1)",
      };
    case "محظور":
    case "محظورة":

    case "مرفوض":
    case "مرفوضة":
      return {
        ...style,
        color: "rgba(194, 24, 24, 1)",
        background: "rgba(194, 24, 24, 0.1)",
        border: "1px solid #E34935 ",
      };
    case "منتهي":
      return { ...style, color: "#E34935", background: "#FFEDED" };
    case "معلق":
      return {
        ...style,
        color: "#7A7B7A",
        background: "#FFFFFF",
        width: "100px",
      };
    case "تم التصديق":
      return {
        ...style,
        width: "150px",
        color: "#9E5C21",
        background: "rgba(242, 153, 74, 0.1)",
      };
    default:
      break;
  }
};
export const setLargeStatusStyle = (status) => {
  console.log("status", status);
  let style = {
    borderRadius: "12px",
    padding: "12px 14px",
    fontWeight: 700,
    fontSize: "1.125rem",
    height: "48px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    lineHeight: "24px",
    cursor: "pointer",
  };
  switch (status) {
    case "إلغاء الحظر":
      return { ...style, color: "#0E8340", background: "#EEF9E8" };
    case "مرفوض":
      return { ...style, color: "#135C58", background: "#FFF7E8" };
    case "حظر":
    case "cancaled":
      return { ...style, color: "#E34935", background: "#FFEDED" };
    case "مستقبلي":
      return {
        ...style,
        color: "#9E5C21",
        background: "rgba(242, 153, 74, 0.10)",
        border: "1px solid #9E5C21",
        fontSize: "1rem",
        fontWeight: "400",
      };
    case "قائم":
      return {
        ...style,
        color: "#2E9C95",
        background: "rgba(34, 160, 107, 0.05)",
        border: "1px solid #2E9C95",
        fontSize: "1rem",
        fontWeight: "400",
        padding: "14px 30px",
      };
    case "منتهي":
      return {
        ...style,
        color: "#E51B1B",
        background: "#FCE8E8",
        border: "1px solid #F7B8B8",
        fontSize: "1rem",
        fontWeight: "400",
        padding: "14px 30px",
      };
    default:
      break;
  }
};

export const formatDate = (dateValue = new Date()) => {
  const date = new Date(dateValue);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedHours = hours % 12 || 12;
  const period = hours < 12 ? "صباحًا" : "مساءً";

  return `${day}/${month}/${year} - ${formattedHours}.${minutes} ${period}`;
};

export const truncateFileName = (input, maxLength = 8) => {
  let fileName;

  if (typeof input === "string") {
    try {
      const url = new URL(input);
      fileName = url.pathname.split("/").pop();
    } catch {
      return null;
    }
  } else if (input instanceof File) {
    fileName = input.name;
  } else {
    return null;
  }

  const [name, extension] = fileName.split(/\.(?=[^.]+$)/);

  if (name.length > maxLength) {
    return name.substring(0, maxLength) + ".." + extension;
  }

  return fileName;
};

export const hasRole = (requiredRoles) => {
  const permissions = store?.getState()?.profile?.data?.data?.role?.permissions;

  if (!permissions || permissions.length === 0) return true; // Allow if no permissions are set

  if (Array.isArray(requiredRoles)) {
    return requiredRoles.some((role) => permissions.includes(role)); // Check if any required role exists
  }

  return permissions.includes(requiredRoles); // If a single string is passed, check directly
};

export const appendToFormData = (formData, data, parentKey = "") => {
  for (let dataKey in data) {
    const fullKey = parentKey ? `${parentKey}[${dataKey}]` : dataKey;

    if (data[dataKey] instanceof File) {
      // If the value is a file, append it directly
      formData.append(fullKey, data[dataKey]);
    } else if (typeof data[dataKey] === "object" && data[dataKey] !== null) {
      // If the value is an object, recurse
      appendToFormData(formData, data[dataKey], fullKey);
    } else {
      // Otherwise, append the key-value pair
      formData.append(fullKey, data[dataKey]);
    }
  }
};

export const getFileType = (file) => {
  if (!file) return null;

  let fileName = "";

  // التحقق إذا كان الملف كائنًا محليًا (مثل ملف محمل من المستخدم)
  if (file instanceof File) {
    fileName = file.name;
  } else if (typeof file === "string") {
    // التعامل مع الروابط التي تحتوي على استعلامات أو هاش
    fileName = file.split("?")[0].split("#")[0];
  } else {
    return "file"; // نوع افتراضي إذا لم يكن الرابط نصًا أو ملفًا
  }

  // استخراج الامتداد من اسم الملف
  const extension = fileName.split(".").pop()?.toLowerCase();

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const pdfExtensions = ["pdf"];

  if (pdfExtensions.includes(extension)) {
    return "pdf";
  } else if (imageExtensions.includes(extension)) {
    return "img";
  } else {
    return "file"; // نوع افتراضي لباقي الملفات
  }
};

export function determineAuctionStatuses(auctionData) {
  let reviewStatus = "";
  let auctionStatus = "";
  let statusReviewFromApi = auctionData?.auctionReviewStatus?.status;
  let auctionStatusValue = auctionData?.status;
  let createdByAdmin = auctionData?.createdByAdmin;
  console.log("auctionStatusValue", auctionStatusValue);
  console.log("statusReviewFromApi", statusReviewFromApi);
  switch (statusReviewFromApi) {
    case "pending":
      reviewStatus = "قيد الانشاء";
      break;
    case "approved":
      switch (auctionStatusValue) {
        case "pending":
          if (createdByAdmin === true) {
            reviewStatus = "قيد التنفيذ";
          } else {
            reviewStatus = "مقبولة";
          }
          break;
        case "in_progress":
          reviewStatus = "مزادات ع المنصة";
          auctionStatus = "مستقبلي";
          break;
        case "on_going":
          reviewStatus = "مزادات ع المنصة";
          auctionStatus = "قائم";
          break;
        case "completed":
          reviewStatus = "مزادات ع المنصة";
          auctionStatus = "منتهي";
          break;

        case "canceled":
          reviewStatus = "مزادات ع المنصة";
          auctionStatus = "متوقف";
          break;
        default:
          reviewStatus = "test";
      }
      break;
    case "need_to_review":
      if (auctionStatusValue === "pending") {
        reviewStatus = "قيد المراجعه";
      }
      break;
    case "rejected":
      if (auctionStatusValue === "pending" && createdByAdmin === false) {
        reviewStatus = "مرفوضة";
      }
      break;
    default:
      reviewStatus = "test";
  }
  console.log("auctionStatus from function", auctionStatus);
  return { reviewStatus, auctionStatus };
}
export const getMainTabValue = (reviewStatus, status, createdByAdmin) => {
  const actionKey = `${reviewStatus}-${status}-${createdByAdmin}`;

  switch (actionKey) {
    case "pending-pending-true":
      return 1;
    case "need_to_review-pending-true":
      return 2;
    case "approved-pending-true":
      return 3;
    case "need_to_review-pending-false":
    case "approved-pending-false":
    case "rejected-pending-false":
      return 4;
    case "approved-in_progress-false":
    case "approved-in_progress-true":
    case "approved-completed-false":
    case "approved-completed-true":
    case "approved-on_going-false":
    case "approved-on_going-true":
    case "approved-canceled-true":
    case "approved-canceled-false":
      return 5;
    default:
      return 0;
  }
};
export const convertIso8601ToDate = (isoDateStr) => {
  const date = new Date(isoDateStr);

  // Check if the date is valid
  if (isNaN(date)) {
    throw new Error("Invalid ISO date format");
  }

  // Extract month, day, and year
  const month = date.getUTCMonth() + 1; // Months are zero-based
  const day = date.getUTCDate();
  const year = date.getUTCFullYear() % 100; // Get last two digits of the year

  // Format as MM/DD/YY (zero-padded)
  return `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year.toString().padStart(2, "0")}`;
};
export const formatNumber = (value) => {
  if (typeof value !== "number") return value; // handle unexpected input safely
  return value.toLocaleString("en-US");
};
export const AuctionTypeFunction = (type) => {
  let auctionType;
  if (type == "online") {
    auctionType = "الكتروني";
  } else if (type == "hybrid") {
    auctionType = "هجين";
  } else {
    auctionType = "حضوري";
  }
  return auctionType;
};
export const handleFormattedNumberChange = (
  inputValue,
  fieldName,
  formik = null,
  setRawValue = null,
  setFormattedValue = null
) => {
  const raw = inputValue.replace(/,/g, "");

  if (!/^\d*\.?\d*$/.test(raw)) return;

  const numeric = raw === "" ? "" : Number(raw);

  if (formik) {
    formik.setFieldValue(fieldName, numeric);
    formik.setFieldValue(
      `${fieldName}Formatted`,
      numeric === "" ? "" : formatNumber(numeric)
    );
  } else if (setRawValue && setFormattedValue) {
    setRawValue(numeric);
    setFormattedValue(numeric === "" ? "" : formatNumber(numeric));
  }
};
export const HtmlRenderer = ({ html }) => {
  return (
    <div
      className="ck-content"
      style={{ whiteSpace: "pre-line" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
export const isAdmin = () => {
  const state = store?.getState();
  console.log("state?.profile?.data?.type ", state?.profile?.data?.data?.type);
  console.log(
    "state?.profile?.data?.employeeType",
    state?.profile?.data?.data?.employeeType
  );
  return (
    state?.profile?.data?.data?.type === "admin" ||
    state?.profile?.data?.data?.employeeType === "admin_staff"
  );
};
export const getUserType = () => {
  const profileData = store.getState()?.profile?.data?.data;

  if (!profileData) return null;

  return (
    profileData?.type ||
    (profileData?.employeeType?.includes("admin")
      ? "admin"
      : profileData?.employeeType?.includes("provider")
      ? "providers"
      : null)
  );
};
