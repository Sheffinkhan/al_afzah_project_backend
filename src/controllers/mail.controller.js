const nodemailer = require("nodemailer");

const sendContactMail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      replyTo: email,
      subject: "New Contact Message",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendContactMail };
