import enquiryModel from "../models/enquiryModel.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Save enquiry & send email via SendGrid
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Save enquiry in DB
    const newEnquiry = new enquiryModel({ name, email, phone, message });
    await newEnquiry.save();

    // Send email to admin
    const msg = {
      to: "goleasmita876@gmail.com", // admin email
      from: "goleasmita876@gmail.com", // verified sender in SendGrid
      replyTo: email,
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await sgMail.send(msg);

    res.json({ success: true, message: "Enquiry submitted successfully!" });
  } catch (err) {
    console.error("Error creating enquiry:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all enquiries (Admin)
export const listEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const deleted = await enquiryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    console.error("Error deleting enquiry:", err);
    res.status(500).json({ message: "Server error" });
  }
};
