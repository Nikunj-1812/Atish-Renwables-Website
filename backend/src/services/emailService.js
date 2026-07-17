const nodemailer = require('nodemailer');

/**
 * Sends a solar estimation report via email with a PDF attachment
 * @param {string} toEmail - Customer email address
 * @param {object} customerData - Customer name, phone, metrics, etc.
 * @param {Buffer} pdfBuffer - Buffer containing the generated PDF
 * @returns {Promise<{success: boolean, messageId?: string, info?: any}>}
 */
async function sendSolarReportEmail(toEmail, customerData, pdfBuffer) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || 'atishrenewables@gmail.com';

  const systemSize = customerData.plantSizeKw.toFixed(1);
  const netInvestment = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(customerData.netCost);
  const yearlySavings = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(customerData.yearlySavings);
  const payback = customerData.paybackPeriodYears.toFixed(1);
  const roi = customerData.roi.toFixed(1);

  const emailSubject = `Your Solar Savings Assessment Report - ${systemSize} kW Plant | Atish Renewables`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #142126; line-height: 1.6;">
      <div style="background-color: #005058; padding: 24px; text-align: center; border-radius: 6px 6px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ATISH RENEWABLES</h1>
        <p style="color: #fdbc13; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 2px;">SOLAR ENGINEERING & INTEGRATION</p>
      </div>

      <div style="padding: 24px; background-color: #ffffff; border: 1px solid #cfd8dc; border-top: none; border-radius: 0 0 6px 6px;">
        <p style="font-size: 15px; margin-top: 0;">Dear <strong>${customerData.name || 'Valued Customer'}</strong>,</p>
        
        <p style="font-size: 14px;">Thank you for using the Atish Renewables Solar Calculator. Based on your inputs, we have generated a professional estimation report for your solar power plant. We have attached the complete branded PDF report to this email.</p>

        <h3 style="color: #005058; font-size: 15px; border-bottom: 2px solid #eef5f7; padding-bottom: 8px; margin-top: 24px;">Assessment Highlights</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13.5px;">
          <tr>
            <td style="padding: 8px 0; color: #4a5b61; border-bottom: 1px solid #eef5f7;">Recommended Plant Size</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #eef5f7; color: #005058;">${systemSize} kW</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5b61; border-bottom: 1px solid #eef5f7;">Net Project Cost (with Subsidy)</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #eef5f7; color: #005058;">${netInvestment}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5b61; border-bottom: 1px solid #eef5f7;">Annual Electricity Bill Savings</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #eef5f7; color: #005058;">${yearlySavings}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5b61; border-bottom: 1px solid #eef5f7;">Estimated Payback Period</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #eef5f7; color: #0f6a73;">${payback} Years</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5b61; border-bottom: 1px solid #eef5f7;">System Return on Investment (ROI)</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #eef5f7; color: #0f6a73;">${roi}%</td>
          </tr>
        </table>

        <p style="font-size: 14px; margin-top: 20px;"><strong>Next Steps:</strong> To lock in these savings and proceed with the technical engineering review, we recommend scheduling a free site survey. Our team will verify your roof strength, layout space, shading, and existing wiring structure.</p>

        <div style="text-align: center; margin: 30px 0 15px 0;">
          <a href="https://wa.me/916359260330" style="background-color: #005058; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 20px; font-weight: bold; font-size: 14px; display: inline-block;">
            Book Free Survey via WhatsApp
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #cfd8dc; margin: 24px 0;" />

        <p style="font-size: 12px; color: #4a5b61; margin-bottom: 0;">
          Regards,<br />
          <strong>Engineering & Operations Team</strong><br />
          Atish Renewables<br />
          Website: www.atishrenewables.com<br />
          Contact: +91 63592 60330  |  atishrenewables@gmail.com
        </p>
      </div>
    </div>
  `;

  // Check if SMTP is configured. If not, log to console and simulate success.
  if (!user || !pass || !host) {
    console.log('\n--- SMTP EMAIL DISPATCH SIMULATION (DEVELOPMENT MODE) ---');
    console.log(`To: ${toEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`PDF Attachment: Branded Solar Report PDF (${pdfBuffer.length} bytes)`);
    console.log('----------------------------------------------------------\n');
    return { success: true, info: 'Simulated dispatch (SMTP environment variables missing)' };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Atish Renewables" <${fromEmail}>`,
    to: toEmail,
    subject: emailSubject,
    html: emailHtml,
    attachments: [
      {
        filename: `Atish_Renewables_Solar_Report_${systemSize}kW.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId, info };
}

module.exports = {
  sendSolarReportEmail,
};
