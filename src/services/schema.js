// Validation Schema using Yup
import * as Yup from "yup";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Extend dayjs with the isSameOrAfter plugin
dayjs.extend(isSameOrAfter);

export const providerValidationSchema = (taxType) => {
  console.log("TAXTYPE", taxType);

  return Yup.object().shape({
    companyName: Yup.string().trim().required("إسم الشركة مطلوب"),
    companyPhoneNumber: Yup.object().shape({
      number: Yup.string()
        .matches(
          /^5[0-9]{8}$/,
          "رقم الجوال يجب أن يتكون من 9 أرقام ويبدأ بـ 5 "
        )
        .required("رقم الجوال مطلوب"),
    }),
    bankAccountInformation: Yup.object().shape({
      accountNumber: Yup.string()
        .matches(/\d{22}$/, "رقم الآيبان يجب أن  يتكون من  22 رقمًا")
        .required("رقم الحساب مطلوب"),
      bankName: Yup.string().required("اسم البنك مطلوب"),
    }),
    bankCertificate: Yup.string().required("مطلوب"),
    companyEmail: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "البريد الإلكتروني غير صالح"
      )
      .required("مطلوب"),
    valAuctionsLicense: Yup.object().shape({
      number: Yup.string()
        .matches(/^\d{10}$/, "رقم الرخصه يجب ان يكون 10 ارقام فقط")
        .required("رقم الرخصه مطلوب"),
    }),
    valAttachment: Yup.string().required("مطلوب"),
    commercialRegistration: Yup.object().shape({
      number: Yup.string()
        .matches(
          /^[0-9]{10}$/,
          "رقم السجل التجاري يجب ان يكون مكون من 10 ارقام"
        )
        .required("مطلوب"),
      startDate: Yup.date()
        .nullable()
        .test(
          "startDate-test",
          "تاريخ الإصدار يجب أن يكون أصغر من تاريخ الانتهاء",
          function (startDate) {
            const { endDate } = this.parent;
            return (
              !startDate ||
              !endDate ||
              dayjs(startDate).isBefore(dayjs(endDate))
            );
          }
        )
        .required("مطلوب"),
      endDate: Yup.date()
        .nullable()
        .test(
          "endDate-test",
          "تاريخ الانتهاء يجب أن يكون أكبر من تاريخ الإصدار",
          function (endDate) {
            const { startDate } = this.parent;
            return (
              !startDate || !endDate || dayjs(endDate).isAfter(dayjs(startDate))
            );
          }
        )
        .required("تاريخ الانتهاء مطلوب"),
    }),
    tax: Yup.object().shape({
      type: Yup.string().required("مطلوب"),
      number:
        taxType === "خاضع للضريبة"
          ? Yup.string()
              .matches(
                /^3\d{14}$/,
                "رقم الضريبة يجب أن يبدأ بـ 3 ويتكون من 15 رقمًا"
              )
              .required("مطلوب")
          : Yup.string().notRequired(),
    }),
    // realEstateActivity: Yup.string().required("النشاط العقاري مطلوب"),
    /**الرخصه */
    // tax: Yup.object().shape({
    //   number: Yup.string()
    //     .matches(/^3\d{14}$/, "رقم الضريبة يجب أن يبدأ بـ 3 ويتكون من 15 رقمًا")
    //     .required("مطلوب"),
    //   type: Yup.string().required("مطلوب"),
    // }),
    // tax: Yup.object()
    //   .shape({
    //     number: Yup.string().matches(
    //       /^3\d{14}$/,
    //       "رقم الضريبة يجب أن يبدأ بـ 3 ويتكون من 15 رقمًا"
    //     ),
    //   })
    //   .when([], {
    //     is: () => taxType === "خاضع للضريبة",
    //     then: (schema) =>
    //       schema.shape({
    //         number: Yup.string()
    //           .matches(
    //             /^3\d{14}$/,
    //             "رقم الضريبة يجب أن يبدأ بـ 3 ويتكون من 15 رقمًا"
    //           )
    //           .required("مطلوب"),
    //       }),
    //     type: Yup.string().required("مطلوب"),
    //     otherwise: (schema) => schema.notRequired(),
    //   }),
    /**بيانات المفوض */
    name: Yup.string().required(" مطلوب"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "البريد الإلكتروني غير صالح"
      )
      .required("مطلوب"),
    identityNumber: Yup.string()
      .matches(
        /^[12]\d{9}$/,
        "رقم الهوية يجب أن يبدأ بـ 1 ورقم الإقامة يجب أن يبدأ بـ 2، وكلاهما مكون من 10 أرقام"
      )
      .required("رقم الهوية أو الإقامة مطلوب"),
    phoneNumber: Yup.object().shape({
      number: Yup.string()
        .matches(
          /^5[0-9]{8}$/,
          "رقم الجوال يجب أن يتكون من 9 أرقام ويبدأ بـ 5 "
        )
        .required("مطلوب"),
    }),
    identityAttachment: Yup.string().required("مطلوب"),
    articlesOfAssociation: Yup.string().required("مطلوب"),
    letterOfAuthorization: Yup.string().required("مطلوب"),
    commercialAttachment: Yup.string().required("مطلوب"),

    // taxAttachment: Yup.string().required("مطلوب"),
    taxAttachment:
      taxType === "خاضع للضريبة"
        ? Yup.string().required("مطلوب")
        : Yup.string().notRequired(),
  });
};
export const createProviderSchema = (taxType) => {
  const schema = providerValidationSchema(taxType).shape({
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        " كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير ورقم"
      )
      .required("كلمة المرور مطلوبة"),
  });
  return schema;
};
export const auctionSchema = (selectedTab) => {
  console.log("selectedTab", selectedTab);
  return Yup.object().shape({
    specialToSupportAuthority: Yup.boolean().required("مطلوب"),
    title: Yup.object().shape({
      ar: Yup.string().required("مطلوب"),
    }),
    type: Yup.string().oneOf(["hybrid", "online", "on_site"]).required("مطلوب"),

    startDate: Yup.string()
      .required("تاريخ ووقت بدأ المزاد مطلوب")
      .test(
        "is-valid-start",
        "تاريخ ووقت بدأ المزاد غير صالح",
        (value) => value && dayjs(value).isValid()
      )
      .test(
        "is-not-past-start",
        "تاريخ ووقت بدأ المزاد لا يمكن أن يكون في الماضي",
        (value) => dayjs(value).isSameOrAfter(dayjs(), "minute")
      ),

    endDate: Yup.string()
      .required("مطلوب")
      .test(
        "is-valid-end",
        "تاريخ ووقت إنتهاء المزاد غير صالح",
        (value) => value && dayjs(value).isValid()
      )
      .test(
        "is-after-start",
        "يجب أن يكون تاريخ ووقت الإنتهاء بعد تاريخ ووقت البداية",
        function (value) {
          const { startDate } = this.parent;
          return dayjs(value).isAfter(dayjs(startDate));
        }
      )
      .test(
        "is-not-past-end",
        "تاريخ ووقت إنتهاء المزاد لا يمكن أن يكون في الماضي",
        (value) => dayjs(value).isSameOrAfter(dayjs(), "minute")
      ),
    auctionApprovalNumber: Yup.string().required(
      "رقم الموافقة لإقامة المزاد مطلوب"
    ),
    // location: Yup.object()
    //   .shape({
    //     title: Yup.string().trim().required("عنوان الموقع مطلوب"),
    //   })
    //   .required("الموقع مطلوب"),

    provider:
      selectedTab === 2
        ? Yup.string().required("مطلوب")
        : Yup.string().notRequired(),
    user:
      selectedTab === 3
        ? Yup.string().required("مطلوب")
        : Yup.string().notRequired(),
    auctionBrochure: Yup.mixed().required("مطلوب"),

    cover: Yup.mixed().required("مطلوب"),
  });
};
export const originSchema = (mode = "create") =>
  Yup.object().shape({
    title: Yup.object()
      .shape({ ar: Yup.string().required("مطلوب") })
      .noUnknown(true),
    description: Yup.object()
      .shape({ ar: Yup.string().required("مطلوب") })
      .noUnknown(true),
    openingPrice: Yup.number().typeError("يجب أن يكون رقمًا").required("مطلوب"),
    entryDeposit: Yup.number().typeError("يجب أن يكون رقمًا").required("مطلوب"),
    garlicDifference: Yup.number()
      .typeError("يجب أن يكون رقمًا")
      .required("مطلوب"),

    secondGarlicDifference: Yup.number()
      .typeError("يجب أن يكون رقمًا")
      .required("مطلوب"),
    attachment: Yup.array().of(Yup.string()).min(1, "مطلوب"),

    // contactInfo: Yup.object().shape({
    //   "نوع الأصل": Yup.string(),
    //   "رقم المخطط": Yup.number().typeError("يجب أن يكون رقمًا").nullable(),
    //   "رقم القطعة": Yup.number().typeError("يجب أن يكون رقمًا").nullable(),
    //   "طبيعة الأرض": Yup.string(),
    //   "الرفع المساحي": Yup.string(),
    //   "واجهة العقار": Yup.string(),
    //   "رقم الصك": Yup.number().typeError("يجب أن يكون رقمًا"),
    //   "تاريخ الصك": Yup.string(),
    // }),

    // areaInfo: Yup.object().shape({
    //   المساحة: Yup.number().typeError("يجب أن يكون رقمًا").required("مطلوب"),
    //   شرقاً: Yup.number().typeError("يجب أن يكون رقمًا"),
    //   غرباً: Yup.number().typeError("يجب أن يكون رقمًا"),
    //   شمالاً: Yup.number().typeError("يجب أن يكون رقمًا"),
    //   جنوباً: Yup.number().typeError("يجب أن يكون رقمًا"),
    // }),

    // generalInfo: Yup.object().shape({
    //   الكهرباء: Yup.string(),
    //   الغاز: Yup.string(),
    //   الماء: Yup.string(),
    //   "التليفون والانترنت": Yup.string(),
    // }),

    // paperInfo: Yup.object().shape({
    //   "حقوق الملكية": Yup.string(),
    //   "نوع الملكية": Yup.string(),
    // }),
    [mode === "edit" ? "المعلومات الخاصة بالاتصال" : "contactInfo"]:
      Yup.object().shape({
        "نوع الأصل": Yup.string(),
        "رقم المخطط": Yup.number().typeError("يجب أن يكون رقمًا").nullable(),
        "رقم القطعة": Yup.number().typeError("يجب أن يكون رقمًا").nullable(),
        "طبيعة الأرض": Yup.string(),
        "الرفع المساحي": Yup.string(),
        "واجهة العقار": Yup.string(),
        "رقم الصك": Yup.number().typeError("يجب أن يكون رقمًا"),
        "تاريخ الصك": Yup.string(),
      }),

    [mode === "edit" ? "الحدود والمساحة" : "areaInfo"]: Yup.object().shape({
      المساحة: Yup.number().typeError("يجب أن يكون رقمًا").required("مطلوب"),
      شرقاً: Yup.number().typeError("يجب أن يكون رقمًا"),
      غرباً: Yup.number().typeError("يجب أن يكون رقمًا"),
      شمالاً: Yup.number().typeError("يجب أن يكون رقمًا"),
      جنوباً: Yup.number().typeError("يجب أن يكون رقمًا"),
    }),

    [mode === "edit" ? "الخدمات والمرافق العامة" : "generalInfo"]:
      Yup.object().shape({
        الكهرباء: Yup.string(),
        الغاز: Yup.string(),
        الماء: Yup.string(),
        "التليفون والانترنت": Yup.string(),
      }),

    [mode === "edit" ? "حقوق الملكية" : "paperInfo"]: Yup.object().shape({
      "حقوق الملكية": Yup.string(),
      "نوع الملكية": Yup.string(),
    }),

    location: Yup.object().shape({
      longitude: Yup.number().typeError("يجب أن يكون رقمًا").required("مطلوب"),
      latitude: Yup.number().typeError("يجب أن يكون رقمًا").required("مطلوب"),
      title: Yup.string().required("مطلوب"),
    }),
  });
