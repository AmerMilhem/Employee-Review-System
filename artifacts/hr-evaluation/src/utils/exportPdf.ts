import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";

export async function exportToPdf(filename: string): Promise<void> {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  const canvas = await toCanvas(element, {
    pixelRatio: 1.5,
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      if (node.tagName === "NAV") return false;
      if (node.classList.contains("print-hidden")) return false;
      if (node.classList.contains("fixed") && node.classList.contains("bottom-8")) return false;
      return true;
    },
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.88);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Scale image to fit page width
  const imgW = pageW;
  const imgH = (canvas.height * pageW) / canvas.width;

  let renderedHeight = 0;

  while (renderedHeight < imgH) {
    if (renderedHeight > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, -renderedHeight, imgW, imgH);
    renderedHeight += pageH;
  }

  pdf.save(filename);
}
