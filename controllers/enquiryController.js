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
      to: "goleasmita876@gmail.com", // Admin email
      from: "support@sigma-lifts.com", // Use verified domain email
      replyTo: email,
      subject: `New Enquiry from ${name} | Sigma Lifts`,
      text: `You have received a new enquiry.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2E86C1;">New Enquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <div style="padding: 10px; background: #f4f4f4; border-left: 3px solid #2E86C1;">
            ${message}
          </div>
          <hr>
          <p>Check the admin panel for more details.</p>
        </div>
      `,
    };
    // ======================
    // 2) Email to User
    // ======================
    const userMsg = {
      to: email,
      from: "support@sigma-lifts.com", // Verified domain email
      subject: `Thank You for Your Enquiry, ${name} | Sigma Lifts`,
      text: `Hello ${name},\n\nThank you for contacting Sigma Lifts. We have received your enquiry:\n\n${message}\n\nOur team will get back to you shortly.\n\nBest regards,\nSigma Lifts Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2E86C1;">Hello ${name},</h2>
          <p>Thank you for reaching out to <strong>Sigma Lifts</strong>. We have successfully received your enquiry:</p>
          <div style="padding: 10px; background: #f4f4f4; border-left: 3px solid #2E86C1;">
            ${message}
          </div>
          <p>Our team will review your request and get back to you as soon as possible.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Sigma Lifts Team</strong></p>
        </div>
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
