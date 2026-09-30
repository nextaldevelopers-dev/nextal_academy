<?php
// Allow cross-origin requests if testing from different domains
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// Read the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data received']);
    exit;
}

// Sanitize inputs
$fullName = htmlspecialchars(strip_tags($data['fullName'] ?? ''));
$phone    = htmlspecialchars(strip_tags($data['phone'] ?? ''));
$source   = htmlspecialchars(strip_tags($data['source'] ?? 'Syllabus Download'));
$page     = htmlspecialchars(strip_tags($data['page'] ?? 'Unknown Page'));

// Validate required fields
if (empty($fullName) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

// Email settings
$to = 'nextalacademyweb@gmail.com';
$subject = 'New Syllabus Download Lead: ' . $fullName;

// HTML Email Body
$message = "
<html>
<head>
  <title>New Syllabus Download Lead</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
  <h2 style='color: #220066;'>New Syllabus Download</h2>
  <p>A user just downloaded the course syllabus.</p>
  <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #F62477;'>
      <p><strong>Name:</strong> {$fullName}</p>
      <p><strong>Phone:</strong> {$phone}</p>
      <p><strong>Source:</strong> {$source}</p>
      <p><strong>Page:</strong> {$page}</p>
  </div>
  <br>
  <p style='font-size: 12px; color: #777;'>This email was sent automatically from your website.</p>
</body>
</html>
";

// Email Headers for HTML content
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Nextal Academy Website <noreply@nextalacademy.com>" . "\r\n";

// Send the email using PHP's built-in mail() function
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Lead captured successfully']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send email.']);
}
?>
