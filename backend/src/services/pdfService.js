const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Formats a number to INR currency representation without decimal places
 * @param {number} value
 * @returns {string}
 */
function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

/**
 * Generates a branded professional solar calculator estimate PDF report
 * @param {object} data - Estimated solar calculator metrics
 * @param {object} stream - Target writable stream (response or file)
 */
function generateSolarReportPdf(data, stream) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(stream);

  // Constants for styling
  const PRIMARY_COLOR = '#005058';
  const SECONDARY_COLOR = '#0f6a73';
  const ACCENT_COLOR = '#fdbc13';
  const TEXT_COLOR = '#142126';
  const MUTED_COLOR = '#4a5b61';
  const BORDER_COLOR = '#cfd8dc';
  const BG_LIGHT = '#f4fafd';

  // Draw Page border/accent header band
  doc.rect(0, 0, 595, 15).fill(PRIMARY_COLOR);

  // Logo insertion (with text fallback)
  const logoPath = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'logo.png');
  let headerX = 50;

  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, 50, 35, { width: 55 });
      headerX = 120;
    } catch (e) {
      // Fallback if image parsing fails
    }
  }

  // Branded Header Title
  doc.fillColor(PRIMARY_COLOR);
  doc.font('Helvetica-Bold').fontSize(20);
  doc.text('ATISH RENEWABLES', headerX, 35);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(ACCENT_COLOR).text('transparent delivery • engineering • performance'.toUpperCase(), headerX, 56);
  
  doc.fillColor(MUTED_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Atish Renewables, SF-14, Laxmipura, Gotri, Vadodara, Gujarat 390020', headerX, 70);
  doc.text('Phone: +91 63592 60330  |  Email: atishrenewables@gmail.com', headerX, 82);

  // Draw line separator
  doc.moveTo(50, 105).lineTo(545, 105).strokeColor(BORDER_COLOR).lineWidth(1.5).stroke();

  // Document Title
  doc.fillColor(TEXT_COLOR).font('Helvetica-Bold').fontSize(14).text('SOLAR SYSTEM ESTIMATION REPORT', 50, 125, { align: 'center' });

  // Customer Information Box
  doc.rect(50, 155, 495, 75).fill(BG_LIGHT);
  doc.strokeColor(BORDER_COLOR).lineWidth(1).strokeRect(50, 155, 495, 75);

  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(9.5).text('CUSTOMER & PROJECT OVERVIEW', 65, 167);
  
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(9);
  doc.text(`Customer Name: ${data.name || 'Valued Customer'}`, 65, 187);
  doc.text(`Contact Phone: ${data.phone || 'N/A'}`, 65, 203);
  
  doc.text(`Installation Location: ${data.location !== 'default' ? `${data.location}, ` : ''}${data.state || 'N/A'} (Pincode: ${data.pincode || 'N/A'})`, 280, 187);
  doc.text(`Customer Type: ${data.customerType === 'commercial' ? 'Commercial / Industrial' : 'Residential'}`, 280, 203);

  // Section: Technical Recommendation
  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(11).text('1. TECHNICAL SYSTEM DESIGN', 50, 250);
  
  // Design Parameters Table
  const tableTop = 270;
  doc.rect(50, tableTop, 495, 20).fill(PRIMARY_COLOR);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5);
  doc.text('PARAMETER', 60, tableTop + 6);
  doc.text('RECOMMENDED SPECIFICATION', 320, tableTop + 6);

  const row1Y = tableTop + 20;
  doc.rect(50, row1Y, 495, 20).fill('#ffffff');
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Recommended Solar Plant Size (kW)', 60, row1Y + 6);
  doc.font('Helvetica-Bold').text(`${data.plantSizeKw} kW`, 320, row1Y + 6);

  const row2Y = tableTop + 40;
  doc.rect(50, row2Y, 495, 20).fill(BG_LIGHT);
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Estimated Required Rooftop Area', 60, row2Y + 6);
  doc.font('Helvetica-Bold').text(`${data.plantSizeKw * 100} Sq. Ft. (Shade-Free)`, 320, row2Y + 6);

  const row3Y = tableTop + 60;
  doc.rect(50, row3Y, 495, 20).fill('#ffffff');
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Estimated Annual Energy Generation', 60, row3Y + 6);
  doc.font('Helvetica-Bold').text(`${new Intl.NumberFormat('en-IN').format(Math.round(data.yearlyGenerationKw))} kWh (Units) / Year`, 320, row3Y + 6);

  const row4Y = tableTop + 80;
  doc.rect(50, row4Y, 495, 20).fill(BG_LIGHT);
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Estimated 25-Year Cumulative Generation', 60, row4Y + 6);
  doc.font('Helvetica-Bold').text(`${new Intl.NumberFormat('en-IN').format(Math.round(data.lifetimeGenerationKw))} kWh (Units)`, 320, row4Y + 6);

  doc.strokeColor(BORDER_COLOR).lineWidth(1).strokeRect(50, tableTop, 495, 100);

  // Section: Financial Savings & Investment Breakdown
  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(11).text('2. FINANCIAL ANALYSIS & ROI', 50, 390);

  const finTableTop = 410;
  doc.rect(50, finTableTop, 495, 20).fill(SECONDARY_COLOR);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5);
  doc.text('FINANCIAL METRIC', 60, finTableTop + 6);
  doc.text('VALUATION (INR / SCORES)', 320, finTableTop + 6);

  const fRow1Y = finTableTop + 20;
  doc.rect(50, fRow1Y, 495, 20).fill('#ffffff');
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Gross Project Cost (EPC)', 60, fRow1Y + 6);
  doc.font('Helvetica-Bold').text(formatINR(data.grossCost), 320, fRow1Y + 6);

  const fRow2Y = finTableTop + 40;
  doc.rect(50, fRow2Y, 495, 20).fill(BG_LIGHT);
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('National Government Subsidy (PM Surya Ghar)', 60, fRow2Y + 6);
  doc.font('Helvetica-Bold').fillColor(data.subsidy > 0 ? '#12b04a' : TEXT_COLOR).text(formatINR(data.subsidy), 320, fRow2Y + 6);

  const fRow3Y = finTableTop + 60;
  doc.rect(50, fRow3Y, 495, 20).fill('#ffffff');
  doc.fillColor(TEXT_COLOR).font('Helvetica-Bold').fontSize(8.5);
  doc.text('Net Investment (Final Cost)', 60, fRow3Y + 6);
  doc.font('Helvetica-Bold').fillColor(PRIMARY_COLOR).text(formatINR(data.netCost), 320, fRow3Y + 6);

  const fRow4Y = finTableTop + 80;
  doc.rect(50, fRow4Y, 495, 20).fill(BG_LIGHT);
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Yearly Electricity Bill Savings', 60, fRow4Y + 6);
  doc.font('Helvetica-Bold').fillColor(TEXT_COLOR).text(formatINR(data.yearlySavings), 320, fRow4Y + 6);

  const fRow5Y = finTableTop + 100;
  doc.rect(50, fRow5Y, 495, 20).fill('#ffffff');
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('Estimated Payback Period', 60, fRow5Y + 6);
  doc.font('Helvetica-Bold').text(`${data.paybackPeriodYears.toFixed(1)} Years`, 320, fRow5Y + 6);

  const fRow6Y = finTableTop + 120;
  doc.rect(50, fRow6Y, 495, 20).fill(BG_LIGHT);
  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.5);
  doc.text('System Return on Investment (ROI)', 60, fRow6Y + 6);
  doc.font('Helvetica-Bold').text(`${data.roi.toFixed(1)}%`, 320, fRow6Y + 6);

  const fRow7Y = finTableTop + 140;
  doc.rect(50, fRow7Y, 495, 20).fill('#ffffff');
  doc.fillColor(TEXT_COLOR).font('Helvetica-Bold').fontSize(8.5);
  doc.text('25-Year Cumulative Financial Savings', 60, fRow7Y + 6);
  doc.font('Helvetica-Bold').fillColor(PRIMARY_COLOR).text(formatINR(data.lifetimeSavings), 320, fRow7Y + 6);

  doc.strokeColor(BORDER_COLOR).lineWidth(1).strokeRect(50, finTableTop, 495, 160);

  // Footer on Page 1
  doc.fillColor(MUTED_COLOR).font('Helvetica').fontSize(8);
  doc.text('Atish Renewables  •  Confidential Solar Assessment  •  Page 1 of 2', 50, 755, { align: 'center' });

  // Add Page 2
  doc.addPage();
  doc.rect(0, 0, 595, 15).fill(PRIMARY_COLOR);

  // Page 2 header
  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(14).text('SOLAR RETURN & GREEN METRICS', 50, 35);
  doc.moveTo(50, 55).lineTo(545, 55).strokeColor(BORDER_COLOR).lineWidth(1).stroke();

  // Section: Visual savings curve (Vector graph)
  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(11).text('3. RETURN ON INVESTMENT PROJECTION (25 YEARS)', 50, 75);

  const chartX = 110;
  const chartY = 100;
  const chartW = 390;
  const chartH = 150;

  // Draw chart box background
  doc.rect(chartX, chartY, chartW, chartH).fill(BG_LIGHT);
  doc.strokeColor(BORDER_COLOR).lineWidth(1).strokeRect(chartX, chartY, chartW, chartH);

  // Y-axis gridlines & labels
  const years = 25;
  const maxSav = data.lifetimeSavings;
  const netCst = data.netCost;
  const graphMaxVal = Math.max(maxSav, netCst) * 1.1 || 100000;

  // Gridlines
  for (let step = 0.25; step <= 0.75; step += 0.25) {
    const yGrid = chartY + chartH - chartH * step;
    doc.moveTo(chartX, yGrid).lineTo(chartX + chartW, yGrid).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
  }

  // Draw payback year vertical line if payback is in range
  if (data.paybackPeriodYears > 0 && data.paybackPeriodYears <= years) {
    const paybackX = chartX + (data.paybackPeriodYears / years) * chartW;
    doc.moveTo(paybackX, chartY).lineTo(paybackX, chartY + chartH).strokeColor('#25d366').lineWidth(1).stroke();
    doc.fillColor('#12b04a').font('Helvetica-Bold').fontSize(7.5).text('Payback', paybackX - 20, chartY - 12);
  }

  // Plot investment cost line (dashed)
  const costY = chartY + chartH - (netCst / graphMaxVal) * chartH;
  doc.moveTo(chartX, costY).lineTo(chartX + chartW, costY).strokeColor('#f59e0b').lineWidth(1.5).dash(4, { space: 3 }).stroke();
  doc.fillColor('#b45309').font('Helvetica-Bold').fontSize(7.5).text(`Net Cost: ${formatINR(netCst)}`, chartX + 10, costY - 10);

  // Reset line style
  doc.undash();

  // Plot savings line
  doc.strokeColor(PRIMARY_COLOR).lineWidth(2);
  for (let yr = 0; yr <= years; yr++) {
    const yrSavings = data.yearlySavings * yr;
    const ptX = chartX + (yr / years) * chartW;
    const ptY = chartY + chartH - (yrSavings / graphMaxVal) * chartH;
    if (yr === 0) {
      doc.moveTo(ptX, ptY);
    } else {
      doc.lineTo(ptX, ptY);
    }
  }
  doc.stroke();

  // Draw chart axes labels
  doc.fillColor(TEXT_COLOR).font('Helvetica-Bold').fontSize(7.5);
  doc.text('Year 0', chartX - 10, chartY + chartH + 10);
  doc.text('Year 5', chartX + chartW * 0.2 - 10, chartY + chartH + 10);
  doc.text('Year 10', chartX + chartW * 0.4 - 10, chartY + chartH + 10);
  doc.text('Year 15', chartX + chartW * 0.6 - 10, chartY + chartH + 10);
  doc.text('Year 20', chartX + chartW * 0.8 - 10, chartY + chartH + 10);
  doc.text('Year 25', chartX + chartW - 10, chartY + chartH + 10);

  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(7.5).text(`Lifetime Savings: ${formatINR(maxSav)}`, chartX + chartW - 130, chartY + 15, { align: 'right' });

  // Section: Environmental Impact
  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(11).text('4. ENVIRONMENTAL BENEFIT SUMMARY', 50, 290);

  doc.rect(50, 310, 495, 95).fill(BG_LIGHT);
  doc.strokeColor(BORDER_COLOR).lineWidth(1).strokeRect(50, 310, 495, 95);

  doc.fillColor(TEXT_COLOR).font('Helvetica-Bold').fontSize(9);
  doc.text('Annual CO2 Offsets & Metrics', 65, 323);

  doc.font('Helvetica').fontSize(9);
  doc.text(`- Carbon Dioxide Offset:`, 65, 342);
  doc.font('Helvetica-Bold').text(`${Math.round(data.co2ReductionKg).toLocaleString('en-IN')} kg / Year`, 210, 342);
  
  doc.font('Helvetica').text(`- Equivalent Trees Planted:`, 65, 358);
  doc.font('Helvetica-Bold').text(`${Math.round(data.treesPlanted).toLocaleString('en-IN')} Trees / Year`, 210, 358);

  doc.font('Helvetica').text(`- Carbon Offsetting Metric:`, 65, 374);
  doc.font('Helvetica-Bold').text(`${data.carbonOffsetTonnes.toFixed(2)} Metric Tonnes / Year`, 210, 374);

  // Environmental Impact Score block
  doc.rect(385, 323, 140, 70).fill(PRIMARY_COLOR);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('GREEN IMPACT SCORE', 395, 335);
  doc.fontSize(22).text(`${data.environmentalScore}`, 395, 350);
  doc.fontSize(8.5).text('/ 100 points', 442, 362);
  
  // Small progress bar in the score block
  doc.rect(395, 380, 120, 5).fill('#ffffff');
  doc.rect(395, 380, 1.2 * data.environmentalScore, 5).fill(ACCENT_COLOR);

  // Section: Terms & Signature
  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(11).text('5. NEXT STEPS & TERMS', 50, 435);

  doc.fillColor(TEXT_COLOR).font('Helvetica').fontSize(8.2).text(
    '1. This estimation report is indicative and based on standardized local daily solar radiation data (4.8 kWh/day per kW plant size).\n' +
    '2. Standard roof layout spacing rules and structural loads were assumed. Variations may apply based on on-site roof condition.\n' +
    '3. Net cost calculations include standard national PM Surya Ghar subsidy rates. State specific additional incentives are not included.\n' +
    '4. To proceed with the engineering review and obtain a custom commercial quotation, please schedule a free physical site survey.',
    50, 455, { lineGap: 3.5 }
  );

  // Signature Block
  const sigY = 575;
  doc.moveTo(50, sigY).lineTo(220, sigY).strokeColor(BORDER_COLOR).stroke();
  doc.moveTo(375, sigY).lineTo(545, sigY).strokeColor(BORDER_COLOR).stroke();

  doc.fillColor(MUTED_COLOR).font('Helvetica').fontSize(8);
  doc.text('Prepared & Approved by', 50, sigY + 6);
  doc.font('Helvetica-Bold').text('Atish Renewables Engineering Team', 50, sigY + 16);

  doc.font('Helvetica').text('Accepted by Customer', 375, sigY + 6);
  doc.font('Helvetica-Bold').text(data.name || 'Valued Client', 375, sigY + 16);

  // Disclaimer Note Box
  doc.rect(50, 640, 495, 75).fill('#fff9e6');
  doc.strokeColor('#ffe28c').lineWidth(1).strokeRect(50, 640, 495, 75);

  doc.fillColor('#855d00').font('Helvetica-Bold').fontSize(8).text('IMPORTANT NOTICE', 60, 650);
  doc.font('Helvetica').fontSize(7.6).text(
    'Solar panel yield varies depending on shading conditions, module angles, temperature, inverter efficiency, and utility grid stability. Atish Renewables engineers use premium Tier-1 components (high-efficiency modules, smart monitoring) to maximize output. A physical site survey is required to finalize hardware design.',
    60, 663, { width: 475, lineGap: 2.2 }
  );

  // Footer on Page 2
  doc.fillColor(MUTED_COLOR).font('Helvetica').fontSize(8);
  doc.text('Atish Renewables  •  Confidential Solar Assessment  •  Page 2 of 2', 50, 755, { align: 'center' });

  doc.end();
}

module.exports = {
  generateSolarReportPdf,
};
