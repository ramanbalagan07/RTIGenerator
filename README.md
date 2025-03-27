# RTI Auto-Generation System

This project automates the process of generating a **Right to Information (RTI) request** using **Google Forms, Google Apps Script, and Google Gemini AI**. It collects user inputs from a Google Form, processes them via AI to generate an RTI letter, and sends the final RTI document via email.

## 📌 Features
- **Google Form Integration**: Collects Name, Address, Email, Phone Number, Period of Request, and Request Details.
- **AI-Powered RTI Generation**: Uses Google Gemini API to generate the RTI **Subject** and **Questions**.
- **Automated Document Creation**: Fills a pre-formatted Word template with user data and AI-generated content.
- **Email Delivery**: Sends the final RTI document as a PDF to the user.

---

## 🛠️ Setup Instructions

### 1️⃣ **Google Form Setup**
1. Create a **Google Form** with the following fields:
   - Name
   - Address
   - Email
   - Phone Number
   - Period of Request
   - Brief Request Description

2. Link the form to a **Google Spreadsheet** to store responses.

### 2️⃣ **Enable Google Apps Script**
1. Open the **Google Spreadsheet** linked to the form.
2. Click on **Extensions → Apps Script**.
3. Copy and paste the provided Apps Script code.

### 3️⃣ **Get Google Gemini API Key**
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in and navigate to **API Keys**.
3. Generate a new API Key and save it securely.
4. Replace `API_KEY` in the Apps Script with your actual key.

### 4️⃣ **Configure Word Document Template**
1. Create a Google Docs file with placeholders:
{{Name}}, {{Address}}, {{Email}}, {{Phone}}, {{Period}}, {{Subject}}, {{Questions}}
2. Note the **Google Docs File ID** from the URL.
3. Update the script with this **File ID**.

### 5️⃣ Deploy and Test
1. Click **Run** in Apps Script to authorize permissions.
2. Submit a test response in the Google Form.
3. Check the generated document and email output.

---
