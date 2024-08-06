import React, { useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import firstPdf from './pdfs/0190 Publish FIR.pdf';
import secondPdf from './pdfs/sd.pdf';

function MergePdfAndPrint() {
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);

  const mergePdfs = async () => {
    try {
      // Fetch the PDFs
      const firstPdfBytes = await fetch(firstPdf).then((res) => res.arrayBuffer());
      const secondPdfBytes = await fetch(secondPdf).then((res) => res.arrayBuffer());

      // Load the PDFs
      const firstPdfDoc = await PDFDocument.load(firstPdfBytes);
      const secondPdfDoc = await PDFDocument.load(secondPdfBytes);

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Create a new page and add heading text to it
      const newPage = mergedPdf.addPage();
      const headingText = headingRef.current ? headingRef.current.textContent : '';
      const subheadingText = subheadingRef.current ? subheadingRef.current.textContent : '';

      if (headingText) {
        newPage.drawText(headingText, {
          x: 50,
          y: newPage.getHeight() - 50,
          size: 30,
          color: rgb(0, 0, 0),
        });
      }

      if (subheadingText) {
        newPage.drawText(subheadingText, {
          x: 50,
          y: newPage.getHeight() - 100,
          size: 20,
          color: rgb(0, 0, 0),
        });
      }
      // state array map 3 map array to push button push
      

      // Copy pages from the first PDF
      const firstPdfPages = await mergedPdf.copyPages(firstPdfDoc, firstPdfDoc.getPageIndices());
      firstPdfPages.forEach((page) => mergedPdf.addPage(page));

      // Copy pages from the second PDF
      const secondPdfPages = await mergedPdf.copyPages(secondPdfDoc, secondPdfDoc.getPageIndices());
      secondPdfPages.forEach((page) => mergedPdf.addPage(page));

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();

      // Create a download link and trigger it
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

    //   Print Document 
      const pdfWindow = window.open(url);
      if (pdfWindow) {
        pdfWindow.addEventListener('load', () => {
          pdfWindow.print();
        });
      }

    //Download Document
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'merged.pdf';
    //   a.print = 'merged.pdf';
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    } catch (error) {
      console.error('Error merging PDFs:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center border ">
        <div>
          <h1 ref={headingRef} className="text-4xl font-extrabold text-blue-600 mb-4">
            First PDF and Second PDF
          </h1>
          <p ref={subheadingRef} className="text-lg font-medium text-gray-700 mb-8">
            This is a PDF and this PDF is very important for React JS.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
          <iframe
            src={firstPdf}
            title="First PDF"
            className="w-64 h-80 border-2 border-gray-300 rounded-lg shadow-lg"
          ></iframe>
          <iframe
            src={secondPdf}
            title="Second PDF"
            className="w-64 h-80 border-2 border-gray-300 rounded-lg shadow-lg"
          ></iframe>
        </div>
        <button
          onClick={mergePdfs}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          Print PDFs
        </button>
      </div>
    </div>
  );
}

export default MergePdfAndPrint;
