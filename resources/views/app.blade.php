<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="min-h-screen">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="locale" property="og:locale" content="en_US">
    <meta name="type" property="og:type" content="website">
    <meta name="url" property="og:url" content="https://web.gtls.au">
    <meta name="site_name" property="og:site_name" content="GTLS">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="image" property="og:image" content="{{ asset('favicon.ico') }}">
    <meta name="title" property="og:title" content="Gold Tiger Logistics Solutions">
    <meta name="description" property="og:description"
        content="SMARTER SUPPLY CHAIN MANAGEMENT...">

    <!-- Preload Fonts -->
    <link rel="preload" href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" as="style">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet">

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KMJRECLV1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-0KMJRECLV1', { anonymize_ip: true });
    </script>

    <!-- Laravel Variables -->
    <script defer>
        window.Laravel = {
            gtamUrl: "{{ env('GTAM_API_URL') }}",
            azureCallback: "{{ env('AZURE_CALLBACK_URL') }}",
            appDomain: "{{ env('SESSION_DOMAIN') }}",
            appUrl: "{{ env('APP_URL') }}",
            backToHomeURL: "{{ env('BACK_TO_HOME_URL') }}",
            strapiAppUrl: "{{ env('STRAPI_APP') }}",
            strapiApiKey: "{{ env('STRAPI_API_KEY') }}",
            googleKey: "{{ env('RECAPTHCA_API') }}",
        };
    </script>

    <title inertia>{{ config('app.name', 'GTLS') }}</title>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased min-h-screen bg-smooth">
    @inertia
</body>

</html>
