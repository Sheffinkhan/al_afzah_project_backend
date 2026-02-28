const nodemailer = require("nodemailer");

const sendContactMail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.MAIL_USER, // your gmail
        pass: process.env.MAIL_PASS, // Gmail App Password
      },
    });

    await transporter.verify();

await transporter.sendMail({
  from: `"Website Contact" <${process.env.MAIL_USER}>`,
  to: process.env.MAIL_USER,
  replyTo: email,
  subject: "New Contact Message",
  html: `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px">
    <table width="100%" align="center" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08)">
      
      <tr>
        <td style="background:#0f172a;padding:20px 30px;color:#ffffff">
          <h2 style="margin:0;font-weight:600">New Contact Message</h2>
          <p style="margin:5px 0 0;font-size:13px;color:#cbd5e1">Website Notification</p>
        </td>
      </tr>

      <tr>
        <td style="padding:25px 30px;color:#111827;font-size:14px;line-height:1.6">
          
          <p><strong>Name:</strong><br>${name}</p>
          
          <p><strong>Email:</strong><br>
          <a href="mailto:${email}" style="color:#2563eb;text-decoration:none">${email}</a>
          </p>
          
          <p><strong>Phone:</strong><br>${phone || "-"}</p>
          
          <p><strong>Message:</strong></p>
          <div style="background:#f1f5f9;padding:15px;border-radius:6px">
            ${message}
          </div>

        </td>
      </tr>

      <tr>
        <td style="background:#f8fafc;padding:15px 30px;font-size:12px;color:#6b7280;text-align:center">
          This message was sent from your website contact form.
        </td>
      </tr>

    </table>
  </div>
  `,
});

    res.json({ success: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendContactMail };