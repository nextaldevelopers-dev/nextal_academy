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
$email    = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$course   = htmlspecialchars(strip_tags($data['course'] ?? ''));
$batch    = htmlspecialchars(strip_tags($data['batch'] ?? ''));

// Validate required fields
if (empty($fullName) || empty($phone) || empty($email) || empty($course)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
    exit;
}

// Determine batch display text
$batchDisplay = 'Unknown Batch';
if ($batch === 'weekday') {
    $batchDisplay = 'Weekday Batches (Mon - Fri)';
} elseif ($batch === 'weekend') {
    $batchDisplay = 'Weekend Special Batch (Sat - Sun)';
} elseif ($batch === 'online') {
    $batchDisplay = 'Online / Hybrid Batch';
}

// Email settings
$to = 'info@nextalacademy.com';
$subject = 'New Enrollment Application: ' . $fullName;

// HTML Email Body
$message = "
<html>
<head>
  <title>New Enrollment Application</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
  <h2 style='color: #220066;'>New Enrollment Application Received</h2>
  <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #F62477;'>
      <p><strong>Name:</strong> {$fullName}</p>
      <p><strong>Phone:</strong> {$phone}</p>
      <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
      <p><strong>Course:</strong> {$course}</p>
      <p><strong>Preferred Batch:</strong> {$batchDisplay}</p>
  </div>
  <br>
  <p style='font-size: 12px; color: #777;'>This email was sent automatically from your website enrollment form.</p>
</body>
</html>
";

// Email Headers for HTML content
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
// The From address should ideally be an address on your domain (e.g. noreply@nextalacademy.com)
$headers .= "From: Nextal Academy Website <noreply@nextalacademy.com>" . "\r\n";
$headers .= "Reply-To: {$fullName} <{$email}>" . "\r\n";

// Send the email using PHP's built-in mail() function
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Application submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send email. Ensure your VPS mail server is configured correctly.']);
}
?>
