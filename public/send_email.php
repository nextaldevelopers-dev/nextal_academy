<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON POST data
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->fullName) && !empty($data->phone) && !empty($data->email) && !empty($data->course)) {
        
        $to = "info@nextalacademy.com"; // Change this if you want it sent elsewhere
        $subject = "New Enrollment Application from " . htmlspecialchars($data->fullName);
        
        $message = "You have received a new enrollment application from the website.\n\n";
        $message .= "Full Name: " . htmlspecialchars($data->fullName) . "\n";
        $message .= "Phone: " . htmlspecialchars($data->phone) . "\n";
        $message .= "Email: " . htmlspecialchars($data->email) . "\n";
        $message .= "Course: " . htmlspecialchars($data->course) . "\n";
        $message .= "Preferred Batch: " . htmlspecialchars($data->batch) . "\n";
        
        $headers = "From: no-reply@nextalacademy.com\r\n";
        $headers .= "Reply-To: " . htmlspecialchars($data->email) . "\r\n";
        
        if (mail($to, $subject, $message, $headers)) {
            http_response_code(200);
            echo json_encode(["message" => "Email sent successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to send email. Server mail() configuration issue."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete form data."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed. Use POST."]);
}
?>
