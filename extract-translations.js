// const fs = require("fs");
// const path = require("path");

// const srcDir = path.join(__dirname, "src");
// const outputPath = path.join(__dirname, "public", "locales", "ar", "common.json");


// let translations = {};
// let usedKeys = new Set();

// // تحميل الترجمة الحالية لو موجودة
// if (fs.existsSync(outputPath)) {
//   const existing = JSON.parse(fs.readFileSync(outputPath, "utf8"));
//   translations = { ...existing };
//   usedKeys = new Set(Object.keys(translations));
// }

// // ✅ توليد مفتاح ترجمة احترافي
// function generateKey(text) {
//   const normalized = text
//     .replace(/[^\u0621-\u064A\s]/g, "") // Remove non-Arabic
//     .trim()
//     .split(/\s+/)
//     .slice(0, 4)
//     .join("_");

//   let key = normalized || `key_${usedKeys.size + 1}`;
//   let finalKey = key;

//   let i = 1;
//   while (usedKeys.has(finalKey)) {
//     finalKey = `${key}_${i++}`;
//   }

//   usedKeys.add(finalKey);
//   return finalKey;
// }

// // استخراج النصوص العربية
// function extractArabicStrings(content) {
//   const results = new Set();
//   const quotesRegex = /(['"`])((?:(?!\1|\\).|\\.)+?)\1/g;
//   const jsxRegex = />\s*([^<>"={}\n]+?)\s*</g;

//   let match;
//   while ((match = quotesRegex.exec(content))) {
//     const text = match[2].trim();
//     if (/[ء-ي]/.test(text)) results.add(text);
//   }

//   while ((match = jsxRegex.exec(content))) {
//     const text = match[1].trim();
//     if (/[ء-ي]/.test(text)) results.add(text);
//   }

//   return [...results];
// }

// // تأكد من وجود useTranslation
// function ensureTranslationHook(content) {
//   const hasImport = /from\s+['"]next-i18next['"]/.test(content);
//   const hasHook = /useTranslation\s*\(\s*.*\)/.test(content);

//   if (!hasImport) {
//     content = `import { useTranslation } from "next-i18next";\n` + content;
//   }

//   if (!hasHook) {
//     content = content.replace(
//       /(function\s+\w+\s*\([^)]*\)\s*\{)|(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)/,
//       (match) => `${match}\n  const { t } = useTranslation();`
//     );
//   }

//   return content;
// }

// // استبدال النصوص في الملف
// function replaceInFile(filePath, arabicTexts) {
//   let content = fs.readFileSync(filePath, "utf8");
//   let replaced = false;

//   arabicTexts.forEach((text) => {
//     let key = Object.keys(translations).find((k) => translations[k] === text);
//     if (!key) {
//       key = generateKey(text);
//       translations[key] = text;
//     }

//     const escaped = text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

//     const regexQuoted = new RegExp(`(['"\`])${escaped}\\1`, "g");
//     const regexJSX = new RegExp(`>\\s*${escaped}\\s*<`, "g");
//     const regexAttr = new RegExp(`(\\b[\\w-]+)\\s*=\\s*["'\`]${escaped}["'\`]`, "g");

//     if (
//       regexQuoted.test(content) ||
//       regexJSX.test(content) ||
//       regexAttr.test(content)
//     ) {
//       content = content
//         .replace(regexQuoted, `t("${key}")`)
//         .replace(regexJSX, `>{t("${key}")}<`)
//         .replace(regexAttr, `$1={t("${key}")}`);
//       replaced = true;
//     }
//   });

//   if (replaced) {
//     content = ensureTranslationHook(content);
//     content = content.replace(/(\b[\w:-]+)\s*=\s*t\((["'`].+?["'`])\)/g, '$1={t($2)}');
//     fs.writeFileSync(filePath, content, "utf8");
//     console.log("✅ Modified:", filePath);
//   }
// }

// // فقط الملفات داخل components و pages
// function walk(dir) {
//   const allowedDirs = ["components", "pages"];
//   const files = fs.readdirSync(dir);

//   files.forEach((file) => {
//     const fullPath = path.join(dir, file);
//     const stat = fs.statSync(fullPath);

//     if (stat.isDirectory()) {
//       if (allowedDirs.includes(file) || allowedDirs.some((d) => fullPath.includes(`/src/${d}`))) {
//         walk(fullPath);
//       }
//     } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
//       const content = fs.readFileSync(fullPath, "utf8");
//       const arabicTexts = extractArabicStrings(content);
//       if (arabicTexts.length > 0) {
//         replaceInFile(fullPath, arabicTexts);
//       }
//     }
//   });
// }

// // تشغيل السكريبت
// function main() {
//   walk(srcDir);
//   fs.mkdirSync(path.dirname(outputPath), { recursive: true });
//   fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), "utf8");
// }

// main();

const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src");
const outputPath = path.join(__dirname, "public", "locales", "ar", "common.json");

let translations = {};
if (fs.existsSync(outputPath)) {
  translations = JSON.parse(fs.readFileSync(outputPath, "utf8"));
}

// استخراج النصوص العربية من JSX أو جوا "" أو ''
function extractArabicStrings(content) {
  const results = new Set();
  const quotesRegex = /(['"`])((?:(?!\1|\\).|\\.)+?)\1/g;
  const jsxRegex = />\s*([^<>"={}\n]+?)\s*</g;

  let match;
  while ((match = quotesRegex.exec(content))) {
    const text = match[2].trim();
    if (/[ء-ي]/.test(text)) results.add(text);
  }

  while ((match = jsxRegex.exec(content))) {
    const text = match[1].trim();
    if (/[ء-ي]/.test(text)) results.add(text);
  }

  return [...results];
}

// توليد مفتاح بناءً على النص
function generateKey(text) {
  return text
    .replace(/[^\u0621-\u064A\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join("_") || `key_${Math.random().toString(36).slice(2, 8)}`;
}

// تحويل مسار الملف إلى namespace مثل: components_header_title
function getNamespace(filePath) {
  const relative = path.relative(srcDir, filePath);
  const noExt = relative.replace(path.extname(relative), "");
  return noExt.replace(/[\\/]/g, "_"); // استبدال / بـ _
}

// تأكد من وجود useTranslation
function ensureUseTranslation(content) {
  const hasImport = /from\s+['"]next-i18next['"]/.test(content);
  const hasHook = /useTranslation\s*\(/.test(content);

  if (!hasImport) {
    content = `import { useTranslation } from "next-i18next";\n` + content;
  }

  if (!hasHook) {
    content = content.replace(
      /(function\s+\w+\s*\([^)]*\)\s*\{)|(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)/,
      (match) => `${match}\n  const { t } = useTranslation();`
    );
  }

  return content;
}

// استبدال النصوص داخل الملف
function replaceInFile(filePath, arabicTexts, namespace) {
  let content = fs.readFileSync(filePath, "utf8");
  let replaced = false;

  if (!translations[namespace]) translations[namespace] = {};

  arabicTexts.forEach((text) => {
    let key = Object.keys(translations[namespace]).find(
      (k) => translations[namespace][k] === text
    );
    if (!key) {
      key = generateKey(text);
      translations[namespace][key] = text;
    }

    const escaped = text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

    const regexQuoted = new RegExp(`(['"\`])${escaped}\\1`, "g");
    const regexJSX = new RegExp(`>\\s*${escaped}\\s*<`, "g");
    const regexAttr = new RegExp(`(\\b[\\w-]+)\\s*=\\s*["'\`]${escaped}["'\`]`, "g");

    if (
      regexQuoted.test(content) ||
      regexJSX.test(content) ||
      regexAttr.test(content)
    ) {
      content = content
        .replace(regexQuoted, `t("${namespace}.${key}")`)
        .replace(regexJSX, `>{t("${namespace}.${key}")}<`)
        .replace(regexAttr, `$1={t("${namespace}.${key}")}`);
      replaced = true;
    }
  });

  if (replaced) {
    content = ensureUseTranslation(content);
    content = content.replace(/(\b[\w:-]+)\s*=\s*t\((["'`].+?["'`])\)/g, '$1={t($2)}');
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✅ Modified:", filePath);
  }
}

// التجول داخل الملفات المحددة
function walk(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, "utf8");
      const arabicTexts = extractArabicStrings(content);
      if (arabicTexts.length > 0) {
        const namespace = getNamespace(fullPath);
        replaceInFile(fullPath, arabicTexts, namespace);
      }
    }
  });
}

// تشغيل السكريبت
function main() {
  walk(path.join(srcDir, "components"));
  walk(path.join(srcDir, "pages"));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), "utf8");
  console.log("🎉 Arabic strings extracted to", outputPath);
}

main();
