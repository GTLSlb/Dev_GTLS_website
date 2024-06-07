<?php

namespace App\Nova\Dashboards;

use Laravel\Nova\Cards\Help;
use Laravel\Nova\Dashboards\Main as Dashboard;
use Laravel\Nova\Metrics\Progress;
use App\Nova\Metrics\AllBlog;
use App\Nova\Metrics\AllPage;
use App\Nova\Metrics\AllSection;
use App\Nova\Metrics\All_Elements;
class Main extends Dashboard
{
    /**
     * Get the cards for the dashboard.
     *
     * @return array
     */
    public function cards()
    {
        return [
            AllPage::make(),
            AllSection::make(),
            All_Elements::make(),
            AllBlog::make(),
            
            // new Help,
        ];
    }
}
