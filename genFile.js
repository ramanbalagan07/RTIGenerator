function generateRTIDocument() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  // Get user details from the last form response
  var name = sheet.getRange(lastRow, 3).getValue(); 
  var address = sheet.getRange(lastRow, 4).getValue();
  var officeAddress = sheet.getRange(lastRow, 5).getValue();
  var email = sheet.getRange(lastRow, 6).getValue();
  var phone = sheet.getRange(lastRow, 7).getValue();
  var period = sheet.getRange(lastRow, 8).getValue();
  var briefRequest = sheet.getRange(lastRow, 9).getValue();

  // Call AI API to generate subject and RTI questions
  var aiResponse = generateRTIQuestions(period, briefRequest);
  var subject = aiResponse.subject;
  var questions = aiResponse.questions;

  // Get predefined Word template from Google Drive
  var templateFile = DriveApp.getFileById(baseFileID); // Replace with your Word file ID
  var copiedFile = templateFile.makeCopy("RTI_Request_" + name);
  Utilities.sleep(3000);
  var doc = DocumentApp.openById(copiedFile.getId());
  var body = doc.getBody();

  // Replace placeholders in Word template
  body.replaceText("{{Name}}", name);
  body.replaceText("{{Address}}", address);
  body.replaceText("{{OfficeAddress}}", officeAddress);
  body.replaceText("{{EmailAddress}}", email);
  body.replaceText("{{PhoneNumber}}", phone);
  body.replaceText("{{Period}}", period);
  body.replaceText("{{Subject}}", subject);
  body.replaceText("{{RTIContent}}", questions);

  doc.saveAndClose();

  // Convert the Word file to PDF
  var pdfBlob = copiedFile.getAs('application/pdf');

  // Send email with RTI document
  MailApp.sendEmail({
    to: email,
    subject: "Your RTI Request Document",
    body: "Dear " + name + ",\n\nPlease find attached your RTI request document.\n\nBest regards,\nRTI Automation System",
    attachments: [pdfBlob]
  });

  Logger.log("RTI Document Sent to " + email);
}

function generateRTIQuestions(period, briefRequest) {
  var apiKey = API_KEY; //Need to be generated from Gemini
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

  var promptText = "Generate an RTI letter subject and questions for the following request:\n" +
                   "Period: " + period + "\n" +
                   "Brief Request: " + briefRequest + "\n\n" +
                   "Response Format:\n" +
                   "Subject: [Generated Subject]\n" +
                   "Questions: [List of questions]";

  var payload = JSON.stringify({
    contents: [{ parts: [{ text: promptText }]}]  
  });

  var options = {
    method: "post",
    contentType: "application/json",
    payload: payload,
    muteHttpExceptions: true 
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());

  Logger.log(json);

  if (json.candidates && json.candidates.length > 0) {
    var textResponse = json.candidates[0].content.parts[0].text;

    // ✅ Extract Subject Properly
    var subjectMatch = textResponse.match(/Subject:\s*(.*?)\n/);
    var subject = subjectMatch ? subjectMatch[1].trim() : "RTI Request";

    // ✅ Extract Questions Dynamically (stopping at the next bold heading)
    var questionsMatch = textResponse.match(/\*\*Questions:\*\*([\s\S]+?)(?:\n\*\*[\w\s]+?:|$)/);
    var questions = questionsMatch ? questionsMatch[1].trim() : "No specific questions generated.";

    // ✅ Remove Formatting (** and *)
    subject = subject.replace(/\*\*/g, "").trim();
    questions = questions.replace(/\*\*|\*/g, "").trim();

    Logger.log("Extracted Subject: " + subject);
    Logger.log("Extracted Questions: " + questions);

    return { subject: subject, questions: questions };
  } else {
    Logger.log("⚠️ API response missing expected fields.");
    return { subject: "RTI Request", questions: "Error generating questions. Please check API response." };
  }
}
