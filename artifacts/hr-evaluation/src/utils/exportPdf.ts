import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";

export async function exportToPdf(filename: string): Promise<void> {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  // Collect elements to toggle
  const printOnlyEls = Array.from(element.querySelectorAll<HTMLElement>(".print-only"));
  const printHiddenEls = Array.from(element.querySelectorAll<HTMLElement>(".print-hidden"));
  const criteriaEls = Array.from(element.querySelectorAll<HTMLElement>(".criteria-body"));

  // Save original inline display values
  const savedOnly = printOnlyEls.map((el) => el.style.display);
  const savedHidden = printHiddenEls.map((el) => el.style.display);
  const savedCriteria = criteriaEls.map((el) => el.style.display);

  // Remove navbar top-padding from main so there's no blank gap
  const main = element.querySelector<HTMLElement>("main");
  const savedPaddingTop = main?.style.paddingTop ?? "";

  // Apply print-mode styles
  printOnlyEls.forEach((el) => (el.style.display = "block"));
  printHiddenEls.forEach((el) => (el.style.display = "none"));
  criteriaEls.forEach((el) => (el.style.display = "block"));
  if (main) main.style.paddingTop = "0";
  element.classList.add("pdf-export");

  // Wait one frame for the DOM to repaint
  await new Promise((resolve) => setTimeout(resolve, 80));

  try {
    const canvas = await toCanvas(element, {
      pixelRatio: 2,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        if (node.tagName === "NAV") return false;
        return true;
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (canvas.height * pageW) / canvas.width;

    let renderedHeight = 0;
    while (renderedHeight < imgH) {
      if (renderedHeight > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, -renderedHeight, imgW, imgH);
      // cover any cut-line artifact at the bottom edge of each page
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, pageH - 1, pageW, 2, "F");
      renderedHeight += pageH;
    }

    pdf.save(filename);
  } finally {
    // Restore everything
    printOnlyEls.forEach((el, i) => (el.style.display = savedOnly[i]));
    printHiddenEls.forEach((el, i) => (el.style.display = savedHidden[i]));
    criteriaEls.forEach((el, i) => (el.style.display = savedCriteria[i]));
    if (main) main.style.paddingTop = savedPaddingTop;
    element.classList.remove("pdf-export");
  }
}
