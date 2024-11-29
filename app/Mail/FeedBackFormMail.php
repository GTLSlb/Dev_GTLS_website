<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class FeedBackFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
    $email = $this->view('emails.feedback-form')
        ->with([
            'feedbackValue' => $this->data['feedbackValue'],
            'feedbackMsg' => $this->data['feedbackMsg'],
        ]);

    return $email;
    }
}
