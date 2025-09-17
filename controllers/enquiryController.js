// controllers/enquiryController.js
import nodemailer from "nodemailer";
import enquiryModel from "../models/enquiryModel.js";

// ✅ Save enquiry & send email
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Save enquiry in DB
    const newEnquiry = new enquiryModel({ name, email, phone, message });
    await newEnquiry.save();

    // Send email to admin
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "goleasmita876@gmail.com",
        pass: "jrtfaogcgwxthklu", // 👈 use App Password, NOT Gmail password
      },
    });

    await transporter.sendMail({
      from: `"Sigma Lifts Pvt. Ltd" <goleasmita876@gmail.com>`,
      to: "goleasmita876@gmail.com",
      replyTo: email,
      subject: "New Enquiry Received",
      html: `
    <h3>New Enquiry</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong> ${message}</p>
  `,
    });

    res.json({ success: true, message: "Enquiry submitted successfully!" });
  } catch (err) {
    console.error("Error creating enquiry:", err.message, err);
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

//delete

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
