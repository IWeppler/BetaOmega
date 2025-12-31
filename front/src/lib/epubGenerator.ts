import JSZip from "jszip";
import { marked } from "marked";

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  md_content: string;
}

const sanitizeToXhtml = (dirtyHtml: string): string => {
  // Verificamos que estamos en el navegador (DOMParser existe)
  if (typeof window === "undefined") return dirtyHtml;

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${dirtyHtml}</div>`, "text/html");

  // Casteamos a HTMLElement para acceder a innerHTML de forma segura
  let cleanHtml = doc.body.firstChild
    ? (doc.body.firstChild as HTMLElement).innerHTML
    : "";

  if (!cleanHtml) cleanHtml = dirtyHtml;

  return cleanHtml
    .replace(/<br>/g, "<br />")
    .replace(/<hr>/g, "<hr />")
    .replace(/<img([^>]*)>/g, "<img$1 />")
    .replace(/&nbsp;/g, "&#160;");
};

export const generateFullBookEpub = async (
  bookTitle: string,
  chapters: Chapter[],
  author: string = "Beta Omega"
): Promise<ArrayBuffer> => {
  const zip = new JSZip();

  // 1. Mimetype (Siempre primero)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  // 2. Container
  zip.folder("META-INF")?.file(
    "container.xml",
    `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  const css = `
    body { font-family: sans-serif; line-height: 1.6; padding: 0 10px; color: #2c2c2c; margin: 0; }
    h1 { font-size: 1.8em; font-weight: 700; margin: 1em 0; text-align: center; page-break-before: always; }
    img { max-width: 100%; height: auto; margin: 1em auto; display: block; break-inside: avoid; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; font-family: monospace; font-size: 0.85em; margin: 1em 0; border: 1px solid #333; break-inside: avoid; }
  `;
  zip.file("styles.css", css);

  // 4. XHTML
  const manifestItems: string[] = [];
  const spineItems: string[] = [];
  const navPoints: string[] = [];

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const internalId = `ch_${i}`;
    const fileName = `${internalId}.xhtml`;

    const rawHtml = await marked.parse(chapter.md_content || "# Sin contenido");
    const validXhtml = sanitizeToXhtml(rawHtml);

    zip.file(
      fileName,
      `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${chapter.title}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <h1 id="chapter-title">${chapter.title}</h1>
  ${validXhtml}
</body>
</html>`
    );

    manifestItems.push(
      `<item id="${internalId}" href="${fileName}" media-type="application/xhtml+xml"/>`
    );
    spineItems.push(`<itemref idref="${internalId}"/>`);
    navPoints.push(`
    <navPoint id="navPoint-${i}" playOrder="${i}">
      <navLabel><text>${chapter.title}</text></navLabel>
      <content src="${fileName}"/>
    </navPoint>`);
  }

  // 5. OPF
  zip.file(
    "content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${bookTitle}</dc:title>
    <dc:creator>${author}</dc:creator>
    <dc:language>es</dc:language>
    <dc:identifier id="BookId">urn:uuid:${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="style" href="styles.css" media-type="text/css"/>
    ${manifestItems.join("\n    ")}
  </manifest>
  <spine toc="ncx">
    ${spineItems.join("\n    ")}
  </spine>
</package>`
  );

  // 6. NCX
  zip.file(
    "toc.ncx",
    `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${Date.now()}"/>
  </head>
  <docTitle><text>${bookTitle}</text></docTitle>
  <navMap>
    ${navPoints.join("\n")}
  </navMap>
</ncx>`
  );

  const content = await zip.generateAsync({
    type: "arraybuffer",
    mimeType: "application/epub+zip",
  });

  return content;
};
