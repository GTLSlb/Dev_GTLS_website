import React from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

function SEOComponent({ seoData }) {
    return (
        <div>
            <Helmet>
                {/* Static Fields */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:type" content="website" />
                <meta charSet="utf-8" />

                {/* Dynamic Fields from JSON */}
                <title>{seoData.metaTitle || "Default Title"}</title>
                <meta
                    name="description"
                    content={seoData.metaDescription || "Default Description"}
                />
                <meta
                    name="keywords"
                    content={seoData.keywords || "Default Keywords"}
                />
                <link
                    rel="canonical"
                    href={seoData.canonicalURL || "https://www.gtls.com.au/"}
                />

                {/* Open Graph (Dynamic) */}
                <meta
                    property="og:title"
                    content={seoData.metaTitle || "Default OG Title"}
                />
                <meta
                    property="og:description"
                    content={
                        seoData.metaDescription || "Default OG Description"
                    }
                />
                <meta
                    property="og:image"
                    content={
                        seoData.structuredData?.image ||
                        "https://www.gtls.com.au/build/assets/LogoWhite-186045a9.webp"
                    }
                />
                <meta
                    property="og:url"
                    content={
                        seoData.structuredData?.url || "https://www.gtls.com.au/"
                    }
                />

                {/* Structured Data (Dynamic) */}
                {seoData.structuredData && (
                    <script type="application/ld+json">
                        {JSON.stringify(seoData.structuredData)}
                    </script>
                )}
            </Helmet>
        </div>
    );
}

SEOComponent.propTypes = {
    seoData: PropTypes.object.isRequired,
};

export default SEOComponent;
