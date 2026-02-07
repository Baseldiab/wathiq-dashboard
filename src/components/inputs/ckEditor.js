// import { useTranslation } from "next-i18next";
// import { useState, useEffect, useRef } from "react";
// import { Box, Toolbar, IconButton, MenuItem, Select } from "@mui/material";
// import FormatBoldIcon from "@mui/icons-material/FormatBold";
// import FormatItalicIcon from "@mui/icons-material/FormatItalic";
// import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

// const pxMapForFontTag = {
//   1: "10px",
//   2: "13px",
//   3: "16px",
//   4: "18px",
//   5: "24px",
//   6: "32px",
//   7: "48px",
// };

// // يحوّل أي <font size="N"> إلى <span style="font-size:..px">
// const normalizeFontTagsToInline = (html) => {
//   if (!html) return html;
//   return html.replace(/<font\b([^>]*)>(.*?)<\/font>/gis, (_m, attrs, inner) => {
//     const sizeMatch = attrs.match(/size=["']?(\d)["']?/i);
//     const styleMatch = attrs.match(/style=["']([^"']+)["']/i);
//     const colorMatch = attrs.match(/color=["']([^"']+)["']/i);

//     const px = sizeMatch ? pxMapForFontTag[sizeMatch[1]] || "16px" : undefined;
//     const styles = [];
//     if (styleMatch) styles.push(styleMatch[1]);
//     if (px) styles.push(`font-size:${px}`);
//     if (colorMatch) styles.push(`color:${colorMatch[1]}`);

//     const styleAttr = styles.length ? ` style="${styles.join(";")}"` : "";
//     return `<span${styleAttr}>${inner}</span>`;
//   });
// };

// // يلفّ التحديد داخل span بستيل معيّن — أكثر ثباتًا من execCommand
// const wrapSelectionWithSpan = (styleObj) => {
//   const sel = window.getSelection?.();
//   if (!sel || sel.rangeCount === 0) return;

//   const range = sel.getRangeAt(0);
//   if (range.collapsed) {
//     // لو مفيش تحديد، هنحقن span فارغ ونسيب الكارِت جوّاه
//     const span = document.createElement("span");
//     Object.assign(span.style, styleObj);
//     span.appendChild(document.createTextNode("\u200B")); // zero-width space
//     range.insertNode(span);
//     // نقل الكارِت جوه السبّان
//     sel.removeAllRanges();
//     const newRange = document.createRange();
//     newRange.setStart(span.firstChild, 1);
//     newRange.collapse(true);
//     sel.addRange(newRange);
//     return;
//   }

//   // عند وجود تحديد: استبدله بـ <span style="...">[المحتوى]</span>
//   const frag = range.cloneContents();
//   const container = document.createElement("div");
//   container.appendChild(frag);
//   const selectedHTML = container.innerHTML;

//   const span = document.createElement("span");
//   Object.assign(span.style, styleObj);
//   span.innerHTML = selectedHTML;

//   // الاستبدال
//   range.deleteContents();
//   range.insertNode(span);

//   // ضع الكارِت بعد السبّان
//   sel.removeAllRanges();
//   const newRange = document.createRange();
//   newRange.setStartAfter(span);
//   newRange.collapse(true);
//   sel.addRange(newRange);
// };

// const RichTextEditor = ({
//   value,
//   handleChange,
//   name,
//   direction = "rtl",
//   placeholder = "اكتب هنا",
//   customContainerStyle = {},
//   customTextStyle = {},
// }) => {
//   const editorRef = useRef(null);
//   const [fontSize, setFontSize] = useState("16px");
//   const [activeStyles, setActiveStyles] = useState({
//     bold: false,
//     italic: false,
//     underline: false,
//     unorderedList: false,
//     orderedList: false,
//   });

//   const { t } = useTranslation();

//   const applyStyle = (command, val = null) => {
//     document.execCommand(command, false, val);
//     updateActiveStyles();
//   };

//   const applyFontSizePx = (px) => {
//     wrapSelectionWithSpan({ fontSize: px });
//     updateActiveStyles();
//     // بعد التطبيق، حدّث قيمة الفورم فورًا
//     handleInput();
//   };

//   const updateActiveStyles = () => {
//     setActiveStyles({
//       bold: document.queryCommandState("bold"),
//       italic: document.queryCommandState("italic"),
//       underline: document.queryCommandState("underline"),
//       unorderedList: document.queryCommandState("insertUnorderedList"),
//       orderedList: document.queryCommandState("insertOrderedList"),
//     });
//   };

//   // تنظيف شامل قبل الإرسال للباك
//   const cleanHTML = (html) => {
//     if (!html) return "";
//     let out = html.replace(/<div>/g, "<p>").replace(/<\/div>/g, "</p>");
//     out = normalizeFontTagsToInline(out);
//     // شيل أي span فاضية (نتيجة اختيار فارغ)
//     out = out.replace(/<span[^>]*>\u200B<\/span>/g, "");
//     return out;
//   };

//   useEffect(() => {
//     const onSelChange = () => updateActiveStyles();
//     document.addEventListener("selectionchange", onSelChange);

//     const editor = editorRef.current;
//     const handleKeyDown = (e) => {
//       if (e.key === "Enter") {
//         // اجبر بلوك p
//         document.execCommand("formatBlock", false, "p");
//       }
//     };
//     const handleKeyUpOrMouseUp = () => updateActiveStyles();

//     if (editor) {
//       editor.addEventListener("keydown", handleKeyDown);
//       editor.addEventListener("keyup", handleKeyUpOrMouseUp);
//       editor.addEventListener("mouseup", handleKeyUpOrMouseUp);

//       // راقِب أي إدراجات <font> من execCommand قديمة/منسوخة والصقها Inline
//       const mo = new MutationObserver(() => {
//         const html = editor.innerHTML;
//         const normalized = normalizeFontTagsToInline(html);
//         if (normalized !== html) {
//           // الحفاظ على الكارِت صعب هنا؛ بس بيشتغل كويس لمعظم الحالات
//           const sel = window.getSelection();
//           const rangeBackup = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
//           editor.innerHTML = normalized;
//           if (rangeBackup) {
//             sel.removeAllRanges();
//             sel.addRange(rangeBackup);
//           }
//         }
//       });
//       mo.observe(editor, { childList: true, subtree: true });
//       editor._mo = mo;
//     }

//     return () => {
//       document.removeEventListener("selectionchange", onSelChange);
//       if (editor) {
//         editor.removeEventListener("keydown", handleKeyDown);
//         editor.removeEventListener("keyup", handleKeyUpOrMouseUp);
//         editor.removeEventListener("mouseup", handleKeyUpOrMouseUp);
//         if (editor._mo) editor._mo.disconnect();
//       }
//     };
//   }, []);

//   // اعرض قيمة الـ prop بعد ما ننضّفها (علشان لو جاية بـ <font> تتحول فورًا)
//   useEffect(() => {
//     if (!editorRef.current) return;
//     const normalized = normalizeFontTagsToInline(value || "");
//     if (normalized !== editorRef.current.innerHTML) {
//       editorRef.current.innerHTML = normalized;
//     }
//   }, [value]);

//   const handleInput = () => {
//     const html = editorRef.current?.innerHTML || "";
//     const newValue = cleanHTML(html);
//     handleChange(newValue, name);
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: 2,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         ...customContainerStyle,
//       }}
//     >
//       <Toolbar
//         variant="dense"
//         sx={{ borderBottom: "1px solid #ddd", mb: 1, gap: 0.5 }}
//       >
//         <IconButton
//           onClick={() => applyStyle("bold")}
//           sx={{ backgroundColor: activeStyles.bold ? "#ddd" : "transparent" }}
//         >
//           <FormatBoldIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("italic")}
//           sx={{ backgroundColor: activeStyles.italic ? "#ddd" : "transparent" }}
//         >
//           <FormatItalicIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("underline")}
//           sx={{
//             backgroundColor: activeStyles.underline ? "#ddd" : "transparent",
//           }}
//         >
//           <FormatUnderlinedIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("insertUnorderedList")}
//           sx={{
//             backgroundColor: activeStyles.unorderedList
//               ? "#ddd"
//               : "transparent",
//           }}
//         >
//           <FormatListBulletedIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("insertOrderedList")}
//           sx={{
//             backgroundColor: activeStyles.orderedList ? "#ddd" : "transparent",
//           }}
//         >
//           <FormatListNumberedIcon />
//         </IconButton>

//         <Select
//           value={fontSize}
//           onChange={(e) => {
//             const px = e.target.value; // "16px"
//             setFontSize(px);
//             applyFontSizePx(px);
//           }}
//           size="small"
//           sx={{ mx: 1, width: 90 }}
//         >
//           <MenuItem value="12px">12</MenuItem>
//           <MenuItem value="16px">16</MenuItem>
//           <MenuItem value="20px">20</MenuItem>
//           <MenuItem value="24px">24</MenuItem>
//         </Select>
//       </Toolbar>

//       <Box
//         ref={editorRef}
//         onInput={handleInput}
//         contentEditable
//         suppressContentEditableWarning
//         dir={direction}
//         sx={{
//           minHeight: "150px",
//           p: 2,
//           outline: "none",
//           // مهم: ما نغيّرش fontSize هنا عشان ما يطبقش على الكل
//           ...customTextStyle,
//           color: "#000000ff",

//           "&:empty:before": {
//             content: `"${placeholder}"`,
//             color: "#000000ff",
//           },
//         }}
//       />
//     </Box>
//   );
// };

// export default RichTextEditor;

// import { useTranslation } from "next-i18next";
// import { useState, useEffect, useRef } from "react";
// import { Box, Toolbar, IconButton, MenuItem, Select } from "@mui/material";
// import FormatBoldIcon from "@mui/icons-material/FormatBold";
// import FormatItalicIcon from "@mui/icons-material/FormatItalic";
// import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

// // تحويل class ql-align-* إلى style text-align
// const convertQuillClassesToStyles = (html) => {
//   if (!html) return html;

//   return html
//     .replace(/class="ql-align-center"/g, 'style="text-align: center;"')
//     .replace(/class="ql-align-right"/g, 'style="text-align: right;"')
//     .replace(/class="ql-align-left"/g, 'style="text-align: left;"')
//     .replace(/class="ql-align-justify"/g, 'style="text-align: justify;"');
// };

// // تنظيف أي وسوم فارغة أو ستايلات مكررة
// const cleanHTML = (html) => {
//   if (!html) return "";
//   let cleaned = convertQuillClassesToStyles(html);

//   // إزالة العناصر الفارغة
//   cleaned = cleaned.replace(/<p><br><\/p>/g, "");
//   cleaned = cleaned.replace(/<span[^>]*><\/span>/g, "");

//   return cleaned;
// };

// const RichTextEditor = ({
//   value,
//   handleChange,
//   name,
//   direction = "rtl",
//   placeholder = "اكتب هنا",
//   customContainerStyle = {},
//   customTextStyle = {},
// }) => {
//   const editorRef = useRef(null);
//   const [fontSize, setFontSize] = useState("16px");
//   const [activeStyles, setActiveStyles] = useState({
//     bold: false,
//     italic: false,
//     underline: false,
//     unorderedList: false,
//     orderedList: false,
//   });

//   const { t } = useTranslation();

//   const applyStyle = (command, val = null) => {
//     document.execCommand(command, false, val);
//     updateActiveStyles();
//     handleInput();
//   };

//   const updateActiveStyles = () => {
//     setActiveStyles({
//       bold: document.queryCommandState("bold"),
//       italic: document.queryCommandState("italic"),
//       underline: document.queryCommandState("underline"),
//       unorderedList: document.queryCommandState("insertUnorderedList"),
//       orderedList: document.queryCommandState("insertOrderedList"),
//     });
//   };

//   // تغيير حجم الخط إلى inline style
//   const applyFontSizePx = (px) => {
//     document.execCommand("fontSize", false, "7");

//     const editor = editorRef.current;
//     if (!editor) return;

//     const fonts = editor.querySelectorAll('font[size="7"]');
//     fonts.forEach((fontEl) => {
//       const span = document.createElement("span");
//       span.style.fontSize = px;
//       span.innerHTML = fontEl.innerHTML;
//       fontEl.replaceWith(span);
//     });

//     setFontSize(px);
//     handleInput();
//   };

//   useEffect(() => {
//     const onSelChange = () => updateActiveStyles();
//     document.addEventListener("selectionchange", onSelChange);

//     const editor = editorRef.current;
//     if (editor) {
//       const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//           document.execCommand("formatBlock", false, "p");
//         }
//       };
//       editor.addEventListener("keydown", handleKeyDown);
//     }

//     return () => {
//       document.removeEventListener("selectionchange", onSelChange);
//     };
//   }, []);

//   // ضبط قيمة المحرر من الـ prop value بعد التنظيف
//   useEffect(() => {
//     if (editorRef.current && value !== editorRef.current.innerHTML) {
//       editorRef.current.innerHTML = cleanHTML(value || "");
//     }
//   }, [value]);

//   const handleInput = () => {
//     const html = editorRef.current?.innerHTML || "";
//     const newValue = cleanHTML(html);
//     handleChange(newValue, name);
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: 2,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         ...customContainerStyle,
//       }}
//     >
//       <Toolbar
//         variant="dense"
//         sx={{ borderBottom: "1px solid #ddd", mb: 1, gap: 0.5 }}
//       >
//         <IconButton
//           onClick={() => applyStyle("bold")}
//           sx={{ backgroundColor: activeStyles.bold ? "#ddd" : "transparent" }}
//         >
//           <FormatBoldIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("italic")}
//           sx={{ backgroundColor: activeStyles.italic ? "#ddd" : "transparent" }}
//         >
//           <FormatItalicIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("underline")}
//           sx={{
//             backgroundColor: activeStyles.underline ? "#ddd" : "transparent",
//           }}
//         >
//           <FormatUnderlinedIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("insertUnorderedList")}
//           sx={{
//             backgroundColor: activeStyles.unorderedList
//               ? "#ddd"
//               : "transparent",
//           }}
//         >
//           <FormatListBulletedIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("insertOrderedList")}
//           sx={{
//             backgroundColor: activeStyles.orderedList ? "#ddd" : "transparent",
//           }}
//         >
//           <FormatListNumberedIcon />
//         </IconButton>

//         <Select
//           value={fontSize}
//           onChange={(e) => applyFontSizePx(e.target.value)}
//           size="small"
//           sx={{ mx: 1, width: 90 }}
//         >
//           <MenuItem value="12px">12</MenuItem>
//           <MenuItem value="16px">16</MenuItem>
//           <MenuItem value="20px">20</MenuItem>
//           <MenuItem value="24px">24</MenuItem>
//         </Select>
//       </Toolbar>

//       <Box
//         ref={editorRef}
//         onInput={handleInput}
//         contentEditable
//         suppressContentEditableWarning
//         dir={direction}
//         sx={{
//           minHeight: "150px",
//           p: 2,
//           outline: "none",
//           ...customTextStyle,
//           color: "#000000ff",

//           "&:empty:before": {
//             content: `"${placeholder}"`,
//             color: "#000000ff",
//           },
//         }}
//       />
//     </Box>
//   );
// };

// export default RichTextEditor;

// import { useTranslation } from "next-i18next";
// import { useState, useEffect, useRef } from "react";
// import { Box, Toolbar, IconButton, MenuItem, Select } from "@mui/material";
// import FormatBoldIcon from "@mui/icons-material/FormatBold";
// import FormatItalicIcon from "@mui/icons-material/FormatItalic";
// import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

// /** ---------- Helpers ---------- **/

// // خريطة أحجام <font size="N"> إلى px (تقريب شائع)
// const pxMapForFontTag = {
//   1: "10px",
//   2: "13px",
//   3: "16px",
//   4: "18px",
//   5: "24px",
//   6: "32px",
//   7: "48px",
// };

// // يحوّل class="ql-align-*" إلى style="text-align:*"
// const convertQuillClassesToStyles = (html) => {
//   if (!html) return html;
//   return html
//     .replace(/class="ql-align-center"/g, 'style="text-align: center;"')
//     .replace(/class="ql-align-right"/g, 'style="text-align: right;"')
//     .replace(/class="ql-align-left"/g, 'style="text-align: left;"')
//     .replace(/class="ql-align-justify"/g, 'style="text-align: justify;"');
// };

// // يحوّل <font size="N" ...>…</font> إلى <span style="font-size:px; ...">…</span>
// const normalizeFontTagsToInline = (html) => {
//   if (!html) return html;
//   return html.replace(/<font\b([^>]*)>(.*?)<\/font>/gis, (_m, attrs, inner) => {
//     const sizeMatch = attrs.match(/size=["']?(\d)["']?/i);
//     const styleMatch = attrs.match(/style=["']([^"']+)["']/i);
//     const colorMatch = attrs.match(/color=["']([^"']+)["']/i);

//     const px = sizeMatch ? pxMapForFontTag[sizeMatch[1]] || "16px" : undefined;
//     const styles = [];
//     if (styleMatch) styles.push(styleMatch[1]);
//     if (px) styles.push(`font-size:${px}`);
//     if (colorMatch) styles.push(`color:${colorMatch[1]}`);

//     const styleAttr = styles.length ? ` style="${styles.join(";")}"` : "";
//     return `<span${styleAttr}>${inner}</span>`;
//   });
// };

// // تنظيف خفيف قابل للإستخدام أثناء الكتابة (بدون حذف <p><br></p>)
// const cleanHTMLLive = (html) => {
//   if (!html) return "";
//   let out = convertQuillClassesToStyles(html);
//   out = normalizeFontTagsToInline(out);
//   // أشيل span فاضية بداخلها zero-width لو اتولدت من لفّ التحديد
//   out = out.replace(/<span[^>]*>\u200B<\/span>/g, "");
//   return out;
// };

// // تنظيف أعمق يُنفّذ عند blur (نهاية التحرير)
// const cleanHTMLOnBlur = (html) => {
//   if (!html) return "";
//   let out = cleanHTMLLive(html);

//   // شيل وسوم span/strong/… الفارغة
//   out = out.replace(/<span[^>]*>\s*<\/span>/g, "");
//   out = out.replace(/<strong[^>]*>\s*<\/strong>/g, "");
//   out = out.replace(/<em[^>]*>\s*<\/em>/g, "");

//   // OPTIONAL: لو عايزة تشيلي الفقرات الفاضية عند الانتهاء فقط (مش أثناء الكتابة)
//   // out = out.replace(/<p><br><\/p>/g, "");

//   return out.trim();
// };

// // لفّ التحديد في span بستايل معيّن (بدون execCommand)
// const wrapSelectionWithSpan = (styleObj) => {
//   const sel = window.getSelection?.();
//   if (!sel || sel.rangeCount === 0) return;

//   const range = sel.getRangeAt(0);
//   if (range.collapsed) {
//     // مفيش تحديد: حط span مكان الكارِت
//     const span = document.createElement("span");
//     Object.assign(span.style, styleObj);
//     span.appendChild(document.createTextNode("\u200B"));
//     range.insertNode(span);
//     // انقل الكارِت جوه
//     sel.removeAllRanges();
//     const newRange = document.createRange();
//     newRange.setStart(span.firstChild, 1);
//     newRange.collapse(true);
//     sel.addRange(newRange);
//     return;
//   }

//   // عند وجود تحديد
//   const frag = range.cloneContents();
//   const container = document.createElement("div");
//   container.appendChild(frag);
//   const selectedHTML = container.innerHTML;

//   const span = document.createElement("span");
//   Object.assign(span.style, styleObj);
//   span.innerHTML = selectedHTML;

//   range.deleteContents();
//   range.insertNode(span);

//   // ضع الكارِت بعد العنصر المضاف
//   sel.removeAllRanges();
//   const newRange = document.createRange();
//   newRange.setStartAfter(span);
//   newRange.collapse(true);
//   sel.addRange(newRange);
// };

// /** ---------- Component ---------- **/

// const RichTextEditor = ({
//   value,
//   handleChange,
//   name,
//   direction = "rtl",
//   placeholder = "اكتب هنا",
//   customContainerStyle = {},
//   customTextStyle = {},
// }) => {
//   const editorRef = useRef(null);
//   const isApplyingChangeRef = useRef(false); // يمنع إعادة كتابة innerHTML أثناء الإدخال
//   const [fontSize, setFontSize] = useState("16px");
//   const [activeStyles, setActiveStyles] = useState({
//     bold: false,
//     italic: false,
//     underline: false,
//     unorderedList: false,
//     orderedList: false,
//   });

//   const { t } = useTranslation();

//   const updateActiveStyles = () => {
//     setActiveStyles({
//       bold: document.queryCommandState("bold"),
//       italic: document.queryCommandState("italic"),
//       underline: document.queryCommandState("underline"),
//       unorderedList: document.queryCommandState("insertUnorderedList"),
//       orderedList: document.queryCommandState("insertOrderedList"),
//     });
//   };

//   const applyStyle = (command, val = null) => {
//     document.execCommand(command, false, val);
//     updateActiveStyles();
//     handleInput(); // حدّث قيمة النموذج بعد التغيير
//   };

//   const applyFontSizePx = (px) => {
//     setFontSize(px);
//     wrapSelectionWithSpan({ fontSize: px });
//     updateActiveStyles();
//     handleInput();
//   };

//   // إدخال المستخدم → حدّث القيمة بدون مسح سطر جديد
//   const handleInput = () => {
//     isApplyingChangeRef.current = true;
//     const html = editorRef.current?.innerHTML || "";
//     const newValue = cleanHTMLLive(html);
//     handleChange(newValue, name);
//     requestAnimationFrame(() => {
//       isApplyingChangeRef.current = false;
//     });
//   };

//   // تنظيف أقوى عند الخروج من الإيديتور
//   const handleBlur = () => {
//     const html = editorRef.current?.innerHTML || "";
//     const cleaned = cleanHTMLOnBlur(html);
//     if (cleaned !== html) {
//       // كتابة النتيجة في الإيديتور والقيمة
//       isApplyingChangeRef.current = true;
//       editorRef.current.innerHTML = cleaned;
//       handleChange(cleaned, name);
//       requestAnimationFrame(() => {
//         isApplyingChangeRef.current = false;
//       });
//     }
//   };

//   useEffect(() => {
//     const onSelChange = () => updateActiveStyles();
//     document.addEventListener("selectionchange", onSelChange);

//     const editor = editorRef.current;
//     const handleKeyDown = (e) => {
//       if (e.key === "Enter") {
//         // اجبر سلوك الفقرة الجديدة بدون ما نمسحها بعدها
//         e.preventDefault();
//         document.execCommand("insertParagraph");
//       }
//     };
//     const handleKeyUpOrMouseUp = () => updateActiveStyles();

//     if (editor) {
//       editor.addEventListener("keydown", handleKeyDown);
//       editor.addEventListener("keyup", handleKeyUpOrMouseUp);
//       editor.addEventListener("mouseup", handleKeyUpOrMouseUp);
//     }

//     return () => {
//       document.removeEventListener("selectionchange", onSelChange);
//       if (editor) {
//         editor.removeEventListener("keydown", handleKeyDown);
//         editor.removeEventListener("keyup", handleKeyUpOrMouseUp);
//         editor.removeEventListener("mouseup", handleKeyUpOrMouseUp);
//       }
//     };
//   }, []);

//   // استقبل قيمة من الأب: اكتبها فقط لو مش جايّة من إدخال مباشر
//   useEffect(() => {
//     if (!editorRef.current) return;
//     if (isApplyingChangeRef.current) return;
//     const normalized = cleanHTMLLive(value || "");
//     if (normalized !== editorRef.current.innerHTML) {
//       editorRef.current.innerHTML = normalized;
//     }
//   }, [value]);

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: 2,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         ...customContainerStyle,
//       }}
//     >
//       <Toolbar
//         variant="dense"
//         sx={{ borderBottom: "1px solid #ddd", mb: 1, gap: 0.5 }}
//       >
//         <IconButton
//           onClick={() => applyStyle("bold")}
//           sx={{ backgroundColor: activeStyles.bold ? "#ddd" : "transparent" }}
//         >
//           <FormatBoldIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("italic")}
//           sx={{ backgroundColor: activeStyles.italic ? "#ddd" : "transparent" }}
//         >
//           <FormatItalicIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("underline")}
//           sx={{
//             backgroundColor: activeStyles.underline ? "#ddd" : "transparent",
//           }}
//         >
//           <FormatUnderlinedIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("insertUnorderedList")}
//           sx={{
//             backgroundColor: activeStyles.unorderedList
//               ? "#ddd"
//               : "transparent",
//           }}
//         >
//           <FormatListBulletedIcon />
//         </IconButton>
//         <IconButton
//           onClick={() => applyStyle("insertOrderedList")}
//           sx={{
//             backgroundColor: activeStyles.orderedList ? "#ddd" : "transparent",
//           }}
//         >
//           <FormatListNumberedIcon />
//         </IconButton>

//         <Select
//           value={fontSize}
//           onChange={(e) => applyFontSizePx(e.target.value)}
//           size="small"
//           sx={{ mx: 1, width: 90 }}
//         >
//           <MenuItem value="12px">12</MenuItem>
//           <MenuItem value="16px">16</MenuItem>
//           <MenuItem value="20px">20</MenuItem>
//           <MenuItem value="24px">24</MenuItem>
//         </Select>
//       </Toolbar>

//       <Box
//         ref={editorRef}
//         onInput={handleInput}
//         onBlur={handleBlur}
//         contentEditable
//         suppressContentEditableWarning
//         dir={direction}
//         sx={{
//           minHeight: "150px",
//           p: 2,
//           outline: "none",
//           color: "#000000ff",
//           whiteSpace: "pre-wrap",
//           lineHeight: 1.8,

//           ...customTextStyle,
//           "&:empty:before": {
//             content: `"${placeholder}"`,
//             color: "#000000ff",
//           },
//         }}
//       />
//     </Box>
//   );
// };

// export default RichTextEditor;

import { useTranslation } from "next-i18next";
import { useState, useEffect, useRef } from "react";
import { Box, Toolbar, IconButton, MenuItem, Select } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

/** ---------- Helpers ---------- **/

// تحويل الكلاسات الخاصة بالمحاذاة لستايلات مباشرة
const convertQuillClassesToStyles = (html) =>
  html
    .replace(/class="ql-align-center"/g, 'style="text-align:center;"')
    .replace(/class="ql-align-right"/g, 'style="text-align:right;"')
    .replace(/class="ql-align-left"/g, 'style="text-align:left;"')
    .replace(/class="ql-align-justify"/g, 'style="text-align:justify;"');

// تحويل أي div لفقرة
const normalizeBlocksToParagraphs = (html) => {
  let out = html.replace(/<div><br><\/div>/gi, "<p><br></p>");
  out = out.replace(/<div( [^>]*)?>([\s\S]*?)<\/div>/gi, "<p>$2</p>");
  out = out.replace(
    /<span[^>]*style="[^"]*display:\s*block[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    "<p>$1</p>"
  );
  return out;
};

// شيل أي span أو font وخلي التنسيقات على العناصر نفسها
const stripSpansKeepInline = (html) => {
  let out = html.replace(/<\/?font[^>]*>/gi, "");
  out = out.replace(/<span(?:\s+[^>]*?)?>\s*<\/span>/gi, "");
  out = out.replace(/<span(?:\s+style="[^"]*")?\s*>([\s\S]*?)<\/span>/gi, "$1");
  return out;
};

// تنظيف بسيط أثناء الكتابة
const cleanHTMLLive = (html = "") => {
  let out = convertQuillClassesToStyles(html);
  out = normalizeBlocksToParagraphs(out);
  out = stripSpansKeepInline(out);
  out = out.replace(/<span[^>]*>\u200B<\/span>/g, "");
  return out;
};

// تنظيف أقوى عند فقدان التركيز
const cleanHTMLOnBlur = (html = "") => {
  let out = cleanHTMLLive(html);
  out = out.replace(/<p>\s*<\/p>/gi, "");
  return out.trim();
};

// تغيير حجم الخط على الفقرات المحددة
function applyFontSizeOnBlocks(px) {
  const sel = window.getSelection?.();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  let el =
    range.startContainer.nodeType === 1
      ? range.startContainer
      : range.startContainer.parentElement;

  const p = el?.closest("p,li");
  if (p) p.style.fontSize = px;
}

/** ---------- Component ---------- **/

const RichTextEditor = ({
  value,
  handleChange,
  name,
  direction = "rtl",
  placeholder = "اكتب هنا",
  customContainerStyle = {},
  customTextStyle = {},
}) => {
  const editorRef = useRef(null);
  const isApplyingChangeRef = useRef(false);
  const [fontSize, setFontSize] = useState("16px");
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  });

  const { t } = useTranslation();

  const updateActiveStyles = () => {
    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  const applyStyle = (command, val = null) => {
    document.execCommand(command, false, val);
    updateActiveStyles();
    handleInput();
  };

  const applyFontSizePx = (px) => {
    setFontSize(px);
    document.execCommand("formatBlock", false, "p");
    applyFontSizeOnBlocks(px);
    updateActiveStyles();
    handleInput();
  };

  const handleInput = () => {
    isApplyingChangeRef.current = true;
    const html = editorRef.current?.innerHTML || "";
    const newValue = cleanHTMLLive(html);
    handleChange(newValue, name);
    requestAnimationFrame(() => {
      isApplyingChangeRef.current = false;
    });
  };

  const handleBlur = () => {
    const html = editorRef.current?.innerHTML || "";
    const cleaned = cleanHTMLOnBlur(html);
    if (cleaned !== html && editorRef.current) {
      isApplyingChangeRef.current = true;
      editorRef.current.innerHTML = cleaned;
      handleChange(cleaned, name);
      requestAnimationFrame(() => {
        isApplyingChangeRef.current = false;
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    if (!text) return;
    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const html = lines
      .map((l) => (l.trim() === "" ? "<p><br></p>" : `<p>${l}</p>`))
      .join("");
    document.execCommand("insertHTML", false, html);
  };

  useEffect(() => {
    const onSelChange = () => updateActiveStyles();
    document.addEventListener("selectionchange", onSelChange);

    const editor = editorRef.current;
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        document.execCommand("insertParagraph");
      }
    };
    const handleKeyUpOrMouseUp = () => updateActiveStyles();

    if (editor) {
      editor.addEventListener("keydown", handleKeyDown);
      editor.addEventListener("keyup", handleKeyUpOrMouseUp);
      editor.addEventListener("mouseup", handleKeyUpOrMouseUp);
    }
    return () => {
      document.removeEventListener("selectionchange", onSelChange);
      if (editor) {
        editor.removeEventListener("keydown", handleKeyDown);
        editor.removeEventListener("keyup", handleKeyUpOrMouseUp);
        editor.removeEventListener("mouseup", handleKeyUpOrMouseUp);
      }
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    if (isApplyingChangeRef.current) return;
    const normalized = cleanHTMLLive(value || "");
    if (normalized !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = normalized;
    }
  }, [value]);

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        ...customContainerStyle,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ borderBottom: "1px solid #ddd", mb: 1, gap: 0.5 }}
      >
        <IconButton
          onClick={() => applyStyle("bold")}
          sx={{ backgroundColor: activeStyles.bold ? "#ddd" : "transparent" }}
        >
          <FormatBoldIcon />
        </IconButton>
        <IconButton
          onClick={() => applyStyle("italic")}
          sx={{ backgroundColor: activeStyles.italic ? "#ddd" : "transparent" }}
        >
          <FormatItalicIcon />
        </IconButton>
        <IconButton
          onClick={() => applyStyle("underline")}
          sx={{
            backgroundColor: activeStyles.underline ? "#ddd" : "transparent",
          }}
        >
          <FormatUnderlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => applyStyle("insertUnorderedList")}
          sx={{
            backgroundColor: activeStyles.unorderedList
              ? "#ddd"
              : "transparent",
          }}
        >
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton
          onClick={() => applyStyle("insertOrderedList")}
          sx={{
            backgroundColor: activeStyles.orderedList ? "#ddd" : "transparent",
          }}
        >
          <FormatListNumberedIcon />
        </IconButton>

        <Select
          value={fontSize}
          onChange={(e) => applyFontSizePx(e.target.value)}
          size="small"
          sx={{ mx: 1, width: 90 }}
        >
          <MenuItem value="12px">12</MenuItem>
          <MenuItem value="16px">16</MenuItem>
          <MenuItem value="20px">20</MenuItem>
          <MenuItem value="24px">24</MenuItem>
        </Select>
      </Toolbar>

      <Box
        ref={editorRef}
        onInput={handleInput}
        onBlur={handleBlur}
        onPaste={handlePaste}
        contentEditable
        suppressContentEditableWarning
        dir={direction}
        sx={{
          minHeight: "150px",
          p: 2,
          outline: "none",
          color: "#000000",
          whiteSpace: "normal",
          lineHeight: 1.8,
          ...customTextStyle,
          "&:empty:before": {
            content: `"${placeholder}"`,
            color: "#999",
          },
          "& p": { margin: 0 },
        }}
      />
    </Box>
  );
};

export default RichTextEditor;
