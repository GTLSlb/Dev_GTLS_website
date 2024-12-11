<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactUsFormMail;
use Illuminate\Support\Facades\Mail;

class ContactUsFormController extends Controller
{
    public function submitContactUSForm(Request $request)
    {
        // Validate the form data
        $this->validate($request, [
            'name' => 'required',
            'company' => 'required',
            'email' => 'required|email',
            'message' => 'required',
            'phone' => 'required',
            'enquiry' => 'nullable',
            'heardofUs' => 'nullable',
        ]);
    
        $data = [
            'name' => $request->input('name'),
            'company' => $request->input('company'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'message' => $request->input('message'),
            'enquiry' => $request->input('enquiry'),
            'heardofUs' => $request->input('heardofUs'),
        ];
    
        // Check the enquiry type and send to a different email if "Sales Enquiry"
        if ($request->input('enquiry') === 'Sales Enquiry') {
            Mail::to('mariamk@gtls.com.au')->send(new ContactUsFormMail($data));
        } else {
            Mail::to('ahmadb@gtls.com.au')->send(new ContactUsFormMail($data));
            // Mail::to('customerservice@gtls.com.au')->send(new ContactUsFormMail($data));
        }
    
        // Redirect with success message
        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }
    
}
