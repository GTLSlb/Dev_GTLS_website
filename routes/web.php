<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ConsTrackingController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LayoutController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ContactUsFormController;
use App\Http\Controllers\SupportFormController;
use App\Http\Controllers\UserVisitController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\FileController;
use App\Http\Controllers\SendDailyEmail;
use App\Http\Controllers\BlogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Http\Middleware\LogUserVisit;
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
})->name('emptyRoute');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/auth/azure/callback', [LoginClass::class, 'handleCallback'])->name('azure.callback');

Route::post('/microsoftToken', [LoginClass::class, 'sendToken'])->name('azure.token');

Route::post('/composerLogout', [ LoginClass::class, 'logoutWithoutRequest'])->middleware(['custom.auth'])->name('composerLogout');

Route::post('/logoutWithoutReq', [ LoginClass::class, 'logoutWithoutRequest'])->middleware(['custom.auth'])->name('composerLogoutWithoutReq');

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
})->name('news');

Route::get('/technologies', function () {
    return Inertia::render('Technologies');
})->name('technologies');

Route::get('/contact_us', function () {
    return Inertia::render('ContactUsPage');
})->name('contact_us');

Route::get('/Subscribe/{id}', function ($id) {
    return Inertia::render('Subscribe',['id'=> $id]);
})->name('Subscribe');


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

Route::middleware('custom.auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/users', [RegisteredUserController::class, 'getCurrentUserName'])->name('/users');
    Route::post('/auth/azure', function () {
        return Socialite::driver('azure')->redirect();
    })->name('azure.login');
    Route::get('/childrens/{id}', [RegisteredUserController::class, 'getChildrens'])->name('/childrens');
    Route::get('/childrenlist/{id}', [RegisteredUserController::class, 'getChildrensList'])->name('/childrensList');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/user/{id}', [RegisteredUserController::class, 'getUserName']);
    Route::get('/safety/{user_id}', [RegisteredUserController::class, 'getSafetyData']);
    Route::get('/findUserById/{user_id}', [RegisteredUserController::class, 'searchUserByName']);
    Route::get('/getUsersWhoCanApprove', [RegisteredUserController::class, 'getUsersWhoCanApprove']);
    Route::delete('/delete-file', [RegisteredUserController::class, 'deleteFile']);
    Route::post('/getAppLogo', [ImageController::class, 'showAppLogo'])->name('logo.show');

});

Route::get('/session-data', function () {
    return response()->json(['userr' => session('userr')]);
});



// ************************ AdminPanel  API Route ************************
Route::resource('section',SectionController::class);
Route::get('/getSec/{id}',[SectionController::class,'getSec']);
Route::get('/getaboutus',[SectionController::class,'about']);
Route::get('/getheader',[SectionController::class,'header']);
Route::get('/getTrainNotification',[SectionController::class,'TrainNotification']);
Route::get('/getGtrs',[SectionController::class,'gtrs']);
Route::get('/getservices',[SectionController::class,'services']);
Route::get('/getgoingGreen',[SectionController::class,'goingGreenSection']);
Route::get('/whygtls',[SectionController::class,'whygtls']);
Route::get('/safety',[SectionController::class,'safety']);
Route::get('/tecnologies',[SectionController::class,'tecnologies']);
Route::get('/certificates',[SectionController::class,'certificates']);
Route::get('/footer',[SectionController::class,'footer']);
Route::get('/aboutPageHeader',[SectionController::class,'aboutPageHeader']);
Route::get('/aboutPageCoreValue',[SectionController::class,'aboutPageCoreValue']);
Route::get('/aboutPageSolutions',[SectionController::class,'aboutPageSolutions']);
Route::get('/aboutPageTeam',[SectionController::class,'aboutPageTeam']);
Route::get('/technologiesPage',[SectionController::class,'technologiesPage']);
Route::get('/technologiesPageIT',[SectionController::class,'technologiesPageIT']);
Route::get('/GreenPage',[SectionController::class,'GreenPage']);
Route::get('/ContactPage',[SectionController::class,'ContactPage']);
Route::get('/ContactPageBranches',[SectionController::class,'ContactPageBranches']);
Route::get('/NewsPage',[SectionController::class,'NewsPage']);
Route::get('/CareerHead',[SectionController::class,'CareerHead']);
Route::get('/CareerAttractive',[SectionController::class,'CareerAttractive']);
Route::get('/CareerSkills',[SectionController::class,'CareerSkills']);
Route::get('/CareerJobs',[SectionController::class,'CareerJobs']);
Route::get('/vister',[UserVisitController::class,'index']);
// ******************************************************************


// ************************ News Pages Route ************************
Route::get('/posts',[BlogController::class,'index']);
Route::get('/news/{slug}', function ($slug) {
    return Inertia::render('NewsPage', ['slug' => $slug]);
})->name('newsPage');
// ******************************************************************

Route::fallback(function () {
    return Inertia::render('NotFoundPage', [
        // Add any data you want to pass to the React component
    ]);
});

Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->name('forgot.password');
require __DIR__ . '/auth.php';
