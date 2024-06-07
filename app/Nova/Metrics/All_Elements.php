<?php

namespace App\Nova\Metrics;

use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Metrics\Progress;
use App\Models\Element;
use Laravel\Nova\Metrics\Value;

class All_Elements extends Value
{


    public function name()
    {
        return 'Elementes';
    }
    /**
     * Calculate the value of the metric.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return mixed
     */
    public function calculate(NovaRequest $request)
    {
        // return $this->count($request, Element::class, function ($query) {
        //     return $query;
        // }, target: 100);
        return $this->result(Element::count(),1);
        // $this->count($request, Element::where('element_id', $request->resourceId));
        // return $this->countByDays($request, Element::class, function ($query) {
        //     return $query;
        // }, target: 100);
    }
    

    /**
     * Determine the amount of time the results of the metric should be cached.
     *
     * @return  \DateTimeInterface|\DateInterval|float|int
     */
    public function cacheFor()
    {
        // return now()->addMinutes(5);
    }

    /**
     * Get the URI key for the metric.
     *
     * @return string
     */
    public function uriKey()
    {
        return 'all-elements';
    }
}
