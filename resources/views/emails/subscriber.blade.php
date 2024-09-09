<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>New Subscriber</title>
    <style>
        body {
            background-color: #1A1E21;
            color: white;
            text-align: left;
            padding: 5px;
        }

        a {
            color: white
        }

        .email-body {
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <div class="email-body">
        <p>Hello {{ $data['email'] }} </p>
        <p>You have successfully subscribed to our traffic notifications.</p>
        <p>
            If you are unsure you can unsubscribe from our notifications
        </p>
        <a href="{{ config('app.url') }}/Unsubscribe/{{ $data['id'] }}" target="_blank">
            Unsubscribe
        </a>
    </div>
</body>

</html>
