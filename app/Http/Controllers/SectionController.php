<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Section;
use App\Models\Element;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $section=Section::all();
        return $section;
        //
    }
    public function getSec($id){
        $all=Section::all();
        return $all;
    }
    public function about(){
        $about= Section::where('id', 6)->get();
        return $about;
    }
    public function header(){
        $header= Section::with('elements')->find('5');
        return response()->json($header);
    }
    public function gtrs(){
        $header= Section::with('elements')->find('10');
        return response()->json($header);
    }
    public function services(){
        $elements = Section::with('elements')->find('7');
        return response()->json($elements);
    }
    public function goingGreenSection(){
        $data= Section::where('id', 8)->get();
        return response()->json($data);
    }
    public function whygtls(){
        $data= Section::with('elements')->find('9');
        return response()->json($data);
    }
    public function safety(){
        $data= Section::where('id', 11)->get();
        return response()->json($data);
    }

    public function tecnologies(){
        $data= Section::with('elements')->find('12');
        return response()->json($data);
    }

    public function certificates(){
        $data= Section::with('elements')->find('13');
        return response()->json($data);
    }

    public function footer(){
        $data= Section::with('elements')->find('14');
        return response()->json($data);
    }
    // public function aboutuspage(){
    //     $data= Page::with('sections.elements')->find('1');
    //     return response()->json($data);
    // }
    public function aboutPageHeader(){
        $data= Section::where('id', 15)->get();
        return response()->json($data);
    }
    public function aboutPageCoreValue(){
        $data= Section::with('elements')->find('16');
        return response()->json($data);
    }

    public function aboutPageSolutions(){
        $data= Section::with('elements')->find('17');
        return response()->json($data);
    }

    public function aboutPageTeam(){
        $data= Section::with('elements')->find('18');
        return response()->json($data);
    }

    public function technologiesPage(){
        $data= Section::with('elements')->find('19');
        return response()->json($data);
    }

    public function technologiesPageIT(){
        $data= Section::with('elements')->find('20');
        return response()->json($data);
    }

    public function GreenPage(){
        $data= Section::with('elements')->find('21');
        return response()->json($data);
    }

    public function ContactPage(){
        $data= Section::with('elements')->find('22');
        return response()->json($data);
    }
    public function ContactPageBranches(){
        $data= Section::with('elements')->find('23');
        return response()->json($data);
    }
    public function NewsPage(){
        $data= Section::with('elements')->find('24');
        return response()->json($data);
    }
    public function CareerHead(){
        $data= Section::with('elements')->find('25');
        return response()->json($data);
    }
    public function CareerAttractive(){
        $data= Section::with('elements')->find('26');
        return response()->json($data);
    }

    public function CareerSkills(){
        $data= Section::with('elements')->find('27');
        return response()->json($data);
    }

    public function CareerJobs(){
        $data= Section::with('elements')->find('28');
        return response()->json($data);
    }
    public function TrainNotification(){
        $data = Section::with('elements')->where('status', 1)->find('29');
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Section $section)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        //
    }
}