<?php

namespace App\Http\Controllers;

use App\Mail\FeedBackFormMail;
use App\Mail\SupportFormMail;
use Illuminate\Http\Request;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Mail;

class FeedBackFormController extends Controller
{
    public function submitFeedBackForm(Request $request)
    {
        
        // validate the form data
        $this->validate($request, [
            'feedbackValue' => 'required',
            'feedbackMsg' => 'required',
        ]);
    
        // prepare the email data
        $data = [
            'feedbackValue' => $request->input('feedbackValue'),
            'feedbackMsg' => $request->input('feedbackMsg'),
        ];
    
        // send the email
        Mail::to('customerservice@gtls.com.au')->send(new FeedBackFormMail($data));
    
        // redirect the user with a success message
        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }
}