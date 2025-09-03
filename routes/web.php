<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LayoutController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ContactUsFormController;
use App\Http\Controllers\SupportFormController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\FileController;
use App\Http\Controllers\AzureAuthController;
use App\Http\Controllers\SendDailyEmail;
use App\Http\Controllers\BlogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Azure\AzureProvider;
use Illuminate\Http\Request;
use gtls\loginstory\LoginClass;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware(['web', 'custom.auth']);

Route::get('/logout', function () {
    return Inertia::render('Auth/Logout');
})->name('logout')->middleware(['web', 'custom.auth']);

Route::post('/loginComp', [ LoginClass::class, 'login'])->name('loginComp');

Route::get('/auth/azure/callback', [LoginClass::class, 'handleCallback'])->name('azure.callback');

Route::post('/microsoftToken', [LoginClass::class, 'sendToken'])->name('azure.token');

Route::post('/composerLogout', [ LoginClass::class, 'logout'])->middleware(['custom.auth'])->name('composerLogout');

Route::post('/logoutWithoutRequest', [ LoginClass::class, 'logoutWithoutRequest'])->middleware(['custom.auth'])->name('composerLogoutWithoutReq');

Route::match(['get', 'post'], '/landingPage', function () {
    if (request()->isMethod('post')) {
        return redirect('/');
    }

    return Inertia::render('LandingPage');
})->middleware(['custom.auth'])->name('landing.page');


Route::get('/opportunities', function () {
    return Inertia::render('Opportunities');
})->name('opportunities');

Route::get('/goinggreen', function () {
    return Inertia::render('GoingGreen');
})->name('goinggreen');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/palletterms', function () {
    return Inertia::render('PalletTerms');
})->name('palletterms');

Route::get('/capabilitystatement', function () {
    return Inertia::render('Capability');
})->name('capabilitystatement');

Route::get('/aboutus', function () {
    return Inertia::render('Aboutus');
})->name('aboutus');

Route::get('/safetycompliance', function () {
    return Inertia::render('SafetyCompliance');
})->name('safetycompliance');

Route::get('/news', function () {
    return Inertia::render('NewsMedia');
});

Route::get('/technologies', function () {
    return Inertia::render('Technologies');
})->name('technologies');

Route::get('/contact_us', function () {
    return Inertia::render('ContactUsPage');
})->name('contact_us');



Route::resource('posts', BlogController::class);
// Route::resource('post', BlogController::class,'post');
// Route::get('/news', function () {
//     return Inertia::render('NewsPage');
// })-> name('news');

Route::get('/news/{id}/{title?}', function ($id, $title = '') {
    return Inertia::render('NewsPage', ['id' => $id, 'title' => $title]);
})->name('news');


Route::post('/contact', [ContactFormController::class, 'submitContactForm'])->name('contact.submit');
Route::post('/contactus', [ContactUsFormController::class, 'submitContactUsForm'])->name('contactus.submit');
Route::post('/support', [SupportFormController::class, 'submitSupportForm'])->name('support.submit');

Route::get('/download-docx', function () {
    $pathToFile = public_path('docs/20230913-Gold-Tiger-Logistics-Solutions-Trading-Terms-and-Conditions.pdf');
    $headers = array(
        'Content-Type: application/pdf',
    );
    return response()->download($pathToFile, '20230913-Gold-Tiger-Logistics-Solutions-Trading-Terms-and-Conditions.pdf', $headers);
});

Route::get('/downloadGTLS-Pallets', function () {
    $pathToFile = public_path('docs/GTLS Pallet Trading Policy 14-12-23.pdf');
    $headers = array(
        'Content-Type: application/docx',
    );
    return response()->download($pathToFile, 'GTLS Pallet Trading Policy 14-12-23.pdf', $headers);
});

Route::post('/sendemail', [SendDailyEmail::class, 'SendEmail']);

Route::post('/upload', function (Request $request) {
    if($request->hasFile('file')){
        $file = $request->file('file');
    $fileName = $file->getClientOriginalName();
    $destinationPath = public_path('userImgs');
    if (file_exists($destinationPath . '/' . $fileName)) {
        return response()->json(['message' => 'File already exists']);
    } else {
        $file->move($destinationPath, $fileName);
        return response()->json(['message' => 'File uploaded successfully', 'filename' => $fileName]);
    }
    }
});

Route::get('/downloadGTLS-docx', function () {
    $pathToFile = public_path('docs/Goldtiger-catalogue.pdf');
    $headers = array(
        'Content-Type: application/pdf',
    );
    return response()->download($pathToFile, 'Goldtiger-catalogue.pdf', $headers);
});

Route::get('/checkAuth', [AuthenticatedSessionController::class, 'checkAuth']);
Route::get('/auth/azure', function () {
    return Socialite::driver('azure')->redirect();
});

Route::get('/auth/azure/callback', [AzureAuthController::class, 'handleCallback']);
Route::get('/checkEmail', [AzureAuthController::class, 'handleClickCallBack']);


Route::middleware('custom.auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/users', [RegisteredUserController::class, 'getCurrentUserName'])->name('users');
    Route::get('/childrens/{id}', [RegisteredUserController::class, 'getChildrens'])->name('children');
    Route::get('/childrenlist/{id}', [RegisteredUserController::class, 'getChildrensList'])->name('children.list');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/user/{id}', [RegisteredUserController::class, 'getUserName']);
    Route::get('/safety/{user_id}', [RegisteredUserController::class, 'getSafetyData']);
    Route::get('/findUserById/{user_id}', [RegisteredUserController::class, 'searchUserByName']);
    Route::get('/getUsersWhoCanApprove', [RegisteredUserController::class, 'getUsersWhoCanApprove']);
    Route::delete('/delete-file', [RegisteredUserController::class, 'deleteFile']);
    Route::post('/auth/azure', function () {
        return Socialite::driver('azure')->redirect();
    })->name('azure.login');
});

Route::get('/session-data', function () {
    return response()->json(['userr' => session('userr')]);
});

Route::fallback(function () {
    return Inertia::render('NotFoundPage', [
        // Add any data you want to pass to the React component
    ]);
});

Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->name('forgot.password');
require __DIR__ . '/auth.php';
