import enquiryModel from "../models/enquiryModel.js";
import sgMail from "@sendgrid/mail";

// ✅ Load SendGrid API Key
if (!process.env.SENDGRID_API_KEY) {
  console.error("Error: SENDGRID_API_KEY not set in .env");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Save enquiry & send email via SendGrid
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Save enquiry in DB
    const newEnquiry = new enquiryModel({ name, email, phone, message });
    await newEnquiry.save();

    // ======================
    // 1) Email to Admin
    // ======================
    const adminMsg = {
      to: "goleasmita876@gmail.com", // ✅ Admin email
      from: "goleasmita876@gmail.com", // ✅ Verified sender
      replyTo: email, // Reply goes to user
      subject: "📥 New Enquiry Received",
      html: `
        <h3>New Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // ======================
    // 2) Email to User
    // ======================
    const userMsg = {
      to: email, // ✅ Send to user
      from: "goleasmita876@gmail.com", // ✅ Verified sender
      subject: "✅ We received your enquiry",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for contacting <strong>Sigma Lifts</strong>. We have received your enquiry:</p>
        <blockquote>${message}</blockquote>
        <p>Our team will get back to you shortly.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Sigma Lifts Team</strong></p>
      `,
    };

    // Send both emails
    try {
      await sgMail.send(adminMsg);
      await sgMail.send(userMsg);
      console.log("✅ Emails sent to admin and user");
    } catch (emailErr) {
      console.error(
        "❌ SendGrid error:",
        emailErr.response?.body || emailErr.message
      );
    }

    console.log("✅ Emails sent to admin and user");

    // ✅ Respond back to frontend
    res.json({ success: true, message: "Enquiry submitted & emails sent!" });
  } catch (err) {
    console.error(
      "❌ Error creating enquiry:",
      err.response?.body || err.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry. Check server logs.",
    });
  }
};

// ✅ Get all enquiries (Admin)
export const listEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error("❌ Error fetching enquiries:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const deleted = await enquiryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting enquiry:", err);
    res.status(500).json({ message: "Server error" });
  }
};
