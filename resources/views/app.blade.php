<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="min-h-screen">

<head>
    <meta charset="utf-8">
    <link rel="canonical" href="{{ url()->current() }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="locale" property="og:locale" content="en_US">
    <meta name="type" property="og:type" content="website">
    <meta name="url" property="og:url" content="https://web.gtls.au">
    <meta name="site_name" property="og:site_name" content="GTLS">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="image" property="og:image" content="{{ asset('favicon.ico') }}">

    <!-- Primary Meta Tags -->
    <meta name="title" content="Gold Tiger Logistics | Smarter Supply Chains">
    <meta name="description"
        content="3PL & 4PL services including interstate line haul, warehousing, and smart distribution.">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Gold Tiger Logistics | Smarter Supply Chains">
    <meta property="og:description"
        content="3PL & 4PL services including interstate line haul, warehousing, and smart distribution.">
    <meta property="og:image" content="{{ asset('AppLogo/w-logo.png') }}"> <!-- Replace with real image -->

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="Gold Tiger Logistics | Smarter Supply Chains">
    <meta property="twitter:description"
        content="3PL & 4PL services including interstate line haul, warehousing, and smart distribution.">
    <meta property="twitter:image" content="{{ asset('AppLogo/w-logo.png') }}"> <!-- Replace with real image -->

    <script type="application/ld+json">
            {!! json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                'name' => 'Gold Tiger Logistics',
                'url' => config('app.url'),
                'description' => 'Smarter supply chain management and third-party logistics specialists. Offering interstate line haul, warehousing, distribution, and complete 3PL/4PL solutions across Australia.',
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'Gold Tiger Logistics',
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => config('app.url') . '/AppLogo/w-logo.png'
                    ]
                ],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => config('app.url') . '/search?q={search_term_string}',
                    'query-input' => 'required name=search_term_string'
                ]
            ], JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT) !!}
            </script>


    <!-- Preload Fonts -->
    <link rel="preload" href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" as="style">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet">

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KMJRECLV1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-0KMJRECLV1', {
            anonymize_ip: true
        });
    </script>

    <!-- Laravel Variables -->
    <script defer>
        window.Laravel = {
            gtamUrl: "{{ env('GTAM_API_URL') }}",
            azureCallback: "{{ env('AZURE_CALLBACK_URL') }}",
            appDomain: "{{ env('SESSION_DOMAIN') }}",
            appUrl: "{{ env('APP_URL') }}",
            backToHomeURL: "{{ env('BACK_TO_HOME_URL') }}",
            mapUrl: "{{ env('REDIRECT_MAP_URL') }}",
            typesenseHost: "{{ env('TYPESENSE_HOST') }}",
            typesenseProtocol: "{{ env('TYPESENSE_PROTOCOL') }}",
            typesensePort: "{{ env('TYPESENSE_PORT') }}",
            typesenseAdminKey: "{{ env('TYPESENSE_ADMIN_API_KEY') }}",
            typesenseSearchOnlyKey: "{{ env('TYPESENSE_SEARCH_ONLY_API_KEY') }}",
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
