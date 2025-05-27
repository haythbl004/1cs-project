
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPrint } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import jsPDF from 'jspdf';

const PrintHeureSupCart = ({ teacher, teacherId, startDate, endDate}) => {
  const [heuresupData, setHeuresupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeuresupData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/heureSup/teacherHS/${teacherId}?startDate=${startDate}&endDate=${endDate}`,
          { withCredentials: true }
        );
        setHeuresupData(response.data);
      } catch (err) {
        console.error('Failed to fetch overtime data:', err);
        setError('Failed to load overtime data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (teacherId && startDate && endDate) {
      fetchHeuresupData();
    } else {
      setError('Missing required parameters.');
      setIsLoading(false);
    }
  }, [teacherId, startDate, endDate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return ' N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generatePDF = () => {
    if (!heuresupData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const usablePageHeight = pageHeight - 20; // 10mm top/bottom margins

    // === HEADER TEXT (CENTERED) WITH FRENCH TRANSLATIONS ===
    const textX = pageWidth / 2;
    let y = 10;
    const lineSpacing = 6;

    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("People's Democratic Republic of Algeria", textX, y, { align: "center" });
    y += lineSpacing - 2;
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("République Algérienne Démocratique et Populaire", textX, y, { align: "center" });
    y += lineSpacing;
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Ministry of Higher Education and Scientific Research", textX, y, { align: "center" });
    y += lineSpacing - 2;
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("Ministère de l'Enseignement Supérieur et de la Recherche Scientifique", textX, y, { align: "center" });
    y += lineSpacing + 2;

    // === LOGO PLACEHOLDER (FAR RIGHT, RAISED) ===
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = pageWidth - logoWidth - 14;
    const logoY = 5;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(logoX, logoY, logoWidth, logoHeight);

    // === TEACHER INFO (LEFT AND CENTER) ===
    const teacherInfoX = 14;
    const centerInfoX = pageWidth / 2;
    y = Math.max(y, logoY + logoHeight + 10);
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text(`First Name: ${teacher.firstName}`, teacherInfoX, y);
    doc.text(`Last Name: ${teacher.lastName}`, centerInfoX, y);
    y += lineSpacing;
    doc.text(`Grade: ${teacher.gradeName || "N/A"}`, teacherInfoX, y);
    doc.text(`Original used body`, centerInfoX, y);
    y += lineSpacing;

    // === SQUARE TABLE ===
    const squareWidth = 180;
    let squareHeight = 200; // Initial height, may adjust
    const squareX = (pageWidth - squareWidth) / 2;
    const squareY = y + 10;
    const gap = 1; // 1mm gap for double lines
    const lineWidth = 0.3;
    const textMargin = 5;

    // Calculate required height
    const monthHeight = 6 + 6 * 6 + 2; // 6mm for month, 36mm for weeks (assuming up to 6 weeks), 2mm for line
    const totalContentHeight = heuresupData.months.length * monthHeight;
    squareHeight = Math.max(squareHeight, totalContentHeight);

    // Double outer border
    doc.setLineWidth(0.8);
    doc.rect(squareX, squareY, squareWidth, squareHeight);
    const offset = 2;
    doc.rect(squareX - offset, squareY - offset, squareWidth + 2 * offset, squareHeight + 2 * offset);

    // Double vertical division lines
    const col1X = squareX + 45;
    const col2X = squareX + 90;
    const col3X = squareX + 135;
    doc.setLineWidth(lineWidth);
    doc.line(col1X - gap / 2, squareY, col1X - gap / 2, squareY + squareHeight);
    doc.line(col1X + gap / 2, squareY, col1X + gap / 2, squareY + squareHeight);
    doc.line(col2X - gap / 2, squareY, col2X - gap / 2, squareY + squareHeight);
    doc.line(col2X + gap / 2, squareY, col2X + gap / 2, squareY + squareHeight);
    doc.line(col3X - gap / 2, squareY, col3X - gap / 2, squareY + squareHeight);
    doc.line(col3X + gap / 2, squareY, col3X + gap / 2, squareY + squareHeight);

    // Double horizontal division line in rightmost column
    const middleY = squareY + squareHeight / 2;
    doc.setLineWidth(lineWidth);
    doc.line(col3X, middleY - gap / 2, squareX + squareWidth, middleY - gap / 2);
    doc.line(col3X, middleY + gap / 2, squareX + squareWidth, middleY + gap / 2);

    // Add column headers and double lines
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    const textOffsetY = 5;
    const lineOffsetY = textOffsetY + 2;
    const lineGap = 1;

    // Column 1: Day and Date
    const dateCenterX = squareX + 22.5;
    const dateLeftX = squareX + textMargin;
    doc.text("Day and Date", dateCenterX, squareY + textOffsetY, { align: "center" });
    doc.setLineWidth(lineWidth);
    doc.line(squareX + textMargin, squareY + lineOffsetY, col1X - gap / 2 - textMargin, squareY + lineOffsetY);
    doc.line(squareX + textMargin, squareY + lineOffsetY + lineGap, col1X - gap / 2 - textMargin, squareY + lineOffsetY + lineGap);

    // Column 2: Number of Hours
    const hoursCenterX = squareX + 67.5;
    const hoursLeftX = col1X + gap / 2 + textMargin;
    doc.text("Number of Hours", hoursCenterX, squareY + textOffsetY, { align: "center" });
    doc.setLineWidth(lineWidth);
    doc.line(col1X + gap / 2 + textMargin, squareY + lineOffsetY, col2X - gap / 2 - textMargin, squareY + lineOffsetY);
    doc.line(col1X + gap / 2 + textMargin, squareY + lineOffsetY + lineGap, col2X - gap / 2 - textMargin, squareY + lineOffsetY + lineGap);

    // Column 3: Signature
    const signatureCenterX = squareX + 112.5;
    doc.text("Signature", signatureCenterX, squareY + textOffsetY, { align: "center" });
    doc.setLineWidth(lineWidth);
    doc.line(col2X + gap / 2 + textMargin, squareY + lineOffsetY, col3X - gap / 2 - textMargin, squareY + lineOffsetY);
    doc.line(col2X + gap / 2 + textMargin, squareY + lineOffsetY + lineGap, col3X - gap / 2 - textMargin, squareY + lineOffsetY + lineGap);

    // Column 4 (top): Studies Manager
    const studiesCenterX = squareX + 157.5;
    doc.text("Studies Manager", studiesCenterX, squareY + textOffsetY, { align: "center" });
    doc.setLineWidth(lineWidth);
    doc.line(col3X + gap / 2 + textMargin, squareY + lineOffsetY, squareX + squareWidth - textMargin, squareY + lineOffsetY);
    doc.line(col3X + gap / 2 + textMargin, squareY + lineOffsetY + lineGap, squareX + squareWidth - textMargin, squareY + lineOffsetY + lineGap);

    // Column 4 (bottom): Ecole Manager
    const ecoleCenterX = squareX + 157.5;
    doc.text("Ecole Manager", ecoleCenterX, middleY + textOffsetY, { align: "center" });
    doc.setLineWidth(lineWidth);
    doc.line(col3X + gap / 2 + textMargin, middleY + lineOffsetY, squareX + squareWidth - textMargin, middleY + lineOffsetY);
    doc.line(col3X + gap / 2 + textMargin, middleY + lineOffsetY + lineGap, squareX + squareWidth - textMargin, middleY + lineOffsetY + lineGap);

    // Add months, weeks, hours, and totals, handling multiple pages
    let contentY = squareY + lineOffsetY + lineGap + 6;
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    let currentPageHeight = contentY;

    // Calculate cumulative total hours
    const cumulativeTotalHours = heuresupData.months.reduce((sum, month) => {
      return sum + month.weeks.reduce((monthSum, week) => monthSum + week.heuresupHours, 0);
    }, 0);

    heuresupData.months.forEach((monthData, index) => {
      // Check if new page is needed
      if (currentPageHeight + monthHeight > usablePageHeight) {
        doc.addPage();
        currentPageHeight = 10;
        contentY = 10;
        // Draw Day and Date and Number of Hours columns
        doc.setLineWidth(0.8);
        doc.rect(squareX, contentY, 90, squareHeight);
        doc.rect(squareX - offset, contentY - offset, 90 + 2 * offset, squareHeight + 2 * offset);
        doc.setLineWidth(lineWidth);
        doc.line(col1X - gap / 2, contentY, col1X - gap / 2, contentY + squareHeight);
        doc.line(col1X + gap / 2, contentY, col1X + gap / 2, contentY + squareHeight);
        doc.line(col2X - gap / 2, contentY, col2X - gap / 2, contentY + squareHeight);
        doc.line(col2X + gap / 2, contentY, col2X + gap / 2, contentY + squareHeight);
      }

      // Add month and total hours
      const monthName = monthNames[monthData.month - 1];
      const monthTotal = monthData.weeks.reduce((sum, week) => sum + week.heuresupHours, 0);
      doc.text(`${monthName} ${monthData.year}`, dateLeftX, contentY);
      doc.text(`Total: ${monthTotal}`, hoursLeftX, contentY);
      contentY += lineSpacing + 2;
      currentPageHeight += lineSpacing + 2;

      // Add weeks and hours
      monthData.weeks.forEach((week) => {
        doc.text(`Week ${week.week}:`, dateLeftX, contentY);
        doc.text(` ${week.heuresupHours} hours`, hoursLeftX, contentY);
        contentY += lineSpacing;
        currentPageHeight += lineSpacing;
      });

      // Draw double horizontal lines to separate months in "Day and Date" and "Number of Hours" columns
      if (index < heuresupData.months.length - 1) {
        doc.setDrawColor(0);
        doc.setLineWidth(0.4);
        doc.line(squareX, contentY + 2, col2X - gap / 2, contentY + 2);
        doc.line(squareX, contentY + 2 + gap, col2X - gap / 2, contentY + 2 + gap);
        contentY += 8 + gap;
        currentPageHeight += 8 + gap;
      }
    });

    // Add cumulative total hours at the bottom of the Signature column
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    doc.text(`Total Hours: ${cumulativeTotalHours}`, signatureCenterX, squareY + squareHeight - textMargin, { align: "center" });

    // === SAVE PDF ===
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen">
        <div className="bg-white rounded-xl p-6 mx-auto border border-gray-200">
          <p className="text-gray-600">Loading overtime data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="bg-white rounded-xl p-6 mx-auto border border-gray-200">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!heuresupData || !heuresupData.dateRange || !heuresupData.months) {
    return (
      <div className="p-6 min-h-screen">
        <div className="bg-white rounded-xl p-6 mx-auto border border-gray-200">
          <p className="text-gray-600">No overtime data available</p>
        </div>
      </div>
    );
  }

  // Calculate total hours for UI
  const totalHours = heuresupData.months.reduce((sum, month) => {
    return sum + month.weeks.reduce((monthSum, week) => monthSum + week.heuresupHours, 0);
  }, 0);

  return (
    <div className="min-h-screen print:p-0">
      <div className="bg-white rounded-xl p-6 mx-auto border border-gray-200 print:border-0 print:rounded-none print:shadow-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Overtime Hours Report</h1>
            <p className="text-gray-600">
              {formatDate(heuresupData.dateRange.startDate)} - {formatDate(heuresupData.dateRange.endDate)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 no-print">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faPrint} />
              Print Report
            </button>
          </div>
        </div>

        {/* Teacher Info Card */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Teacher Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-medium">{teacher.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Academic Grade</p>
              <p className="font-medium">{teacher.gradeName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Employment Type</p>
              <p className="font-medium capitalize">{teacher.teacherType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="font-medium capitalize">{teacher.paymentType?.replace('_', ' ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Account Number</p>
              <p className="font-medium">{teacher.accountNumber || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Summary</h2>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <FontAwesomeIcon icon={faClock} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Overtime Hours</p>
                <p className="text-2xl font-bold text-blue-800">{totalHours} hours</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Period: {formatDate(heuresupData.dateRange.startDate)} to {formatDate(heuresupData.dateRange.endDate)}</p>
              <p>Report generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Overtime Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Overtime Hours</h2>
          {heuresupData.months.map((monthData) => (
            <div key={`${monthData.year}-${monthData.month}`} className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-3 px-2">
                {monthNames[monthData.month - 1]} {monthData.year}
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Week
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthData.weeks.map((week) => (
                      <tr key={week.week} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          Week {week.week}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {week.heuresupHours} {week.heuresupHours === 1 ? 'hour' : 'hours'}
                        </td>
                      </tr>
                    ))}
                    {/* Month Subtotal */}
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">Monthly Total</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {monthData.weeks.reduce((sum, week) => sum + week.heuresupHours, 0)} hours
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body, html {
            background: white !important;
          }
          .print:p-0 {
            padding: 0 !important;
          }
          .print:border-0 {
            border: none !important;
          }
          .print:rounded-none {
            border-radius: 0 !important;
          }
          .print:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintHeureSupCart;
