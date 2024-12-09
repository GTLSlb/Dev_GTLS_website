<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Enquire Form Submitted</title>
</head>
<body>
    <h2>Enquire through web</h2>
    <p>Name: {{ $data['name'] }}</p>
    <p>Company: {{ $data['company'] }}</p>
    <p>Email: {{ $data['email'] }}</p>
    <p>Phone: {{ $data['phone'] }}</p>
    <p>Type of Enquiry: {{ $data['enquiry'] }}</p>
    <p>How did they hear about us: {{ $data['heardofUs'] }}</p>
    <p>Message: {{ $data['message'] }}</p>
</body>
</html>