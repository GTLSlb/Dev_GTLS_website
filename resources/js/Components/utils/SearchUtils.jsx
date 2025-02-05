export const addSearchIndex = (item) => {
    if (typeof item.data == "string") {
        return {
            name: item.tableName,
            title: item.tableName,
            searchParameters: {
                query_by: "data",
                highlight_full_fields: "",
            },
        };
    } else {
        if (item.tableName == "branches") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "branch_name",
                    highlight_full_fields: "",
                },
            };
        } else if (
            item.tableName == "certificates" ||
            item.tableName == "news_posts"
        ) {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "description, title",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "positions") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "position_details, position_title",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "services") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "description, title",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "socials") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "name, url",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "team_members") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "member_name",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "blogs") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body, title, slug",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "pallet_terms") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body, title",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "enquiries_types") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "name",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "capability_statements") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body, title",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "aboutuses") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "technologies") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "going_greens") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body, title, description",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "safety_compliances") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body, title",
                    highlight_full_fields: "",
                },
            };
        } else if (item.tableName == "terms") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body, title",
                    highlight_full_fields: "",
                },
            };
        } else {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "body, title, slug",
                    highlight_full_fields: "",
                },
            };
        }
    }
};

export const addSearchParameters = (item) => {
    const config = {
        query_by: "",
        highlight_full_fields: "",
    };

    if (typeof item.data === "string") {
        config.query_by = "data";
    } else {
        switch (item.tableName) {
            case "branches":
                config.query_by = "branch_name";
                break;
            case "certificates":
            case "news_posts":
                config.query_by = "description, title";
                break;
            case "positions":
                config.query_by = "position_details, position_title";
                break;
            case "services":
                config.query_by = "description, title";
                break;
            case "socials":
                config.query_by = "name, url";
                break;
            case "team_members":
                config.query_by = "member_name";
                break;
            case "blogs":
                config.query_by = "body, title, slug";
                break;
            case "pallet_terms":
                config.query_by = "body, title";
                break;
            case "enquiries_types":
                config.query_by = "name";
                break;
            case "capability_statements":
                config.query_by = "body, title";
                break;
            case "aboutuses":
                config.query_by = "body";
                break;
            case "technologies":
                config.query_by = "body";
                break;
            case "going_greens":
                config.query_by = "body, title, description";
                break;
            case "safety_compliances":
                config.query_by = "body, title";
                break;
            case "terms":
                config.query_by = "body, title";
                break;
            default:
                config.query_by = "body, title, slug";
                break;
        }
    }

    return config;
};

function findElement(elements, selectorParts) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(selectorParts, "text/html");
    const elementsInDoc = doc.body.getElementsByTagName("*");

    function findMatchingElement(elements, elementsInDoc) {
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            for (let j = 0; j < elementsInDoc.length; j++) {
                const elementInDoc = elementsInDoc[j];
                if (element.outerHTML === elementInDoc.outerHTML) {
                    return element;
                }
            }
        }
        return null;
    }

    return findMatchingElement(elements, elementsInDoc);
}
const getPathname = (url) => {
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname == "/") {
        return url;
    } else {
        return parsedUrl.pathname;
    }
};
export const navigateAfterRedirect = (setIsOpen) => {
    const elements = document.body.getElementsByTagName("*");
    const selectorParts = localStorage.getItem("selector");
    const currentElement = findElement(elements, selectorParts);

    if (currentElement) {
        setIsOpen(false);
        currentElement.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("selector");
    }
}

export function navigateToSelector(selector, url, doc, setIsOpen) {
    const highlightKey = Object.keys(doc.highlight)[0];
    const selectorParts =
        selector == undefined
            ? doc.document[highlightKey]
            : selector.split(" > ");

    if (getPathname(url) !== window.location.pathname) {
        window.location.replace(url);
        localStorage.setItem("selector", selectorParts);
    }

    const elements = document.body.getElementsByTagName("*");
    const currentElement = findElement(elements, selectorParts);

    if (currentElement) {
        setIsOpen(false);
        currentElement.scrollIntoView({ behavior: "smooth" });
    }
}
export function highlightRelevantWords(text, query) {
    // Normalize the text and query for case-insensitive matching
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    // Find the index of the query in the text
    const index = normalizedText.indexOf(normalizedQuery);

    // If the query is not found, return original text
    if (index === -1) {
        return normalizedText.slice(0, 200) + "...";
    }

    // Calculate the start and end positions for the result
    const start = Math.max(0, index - 20); // Show 20 characters before
    const end = Math.min(text.length, index + query.length + 20); // Show 20 characters after

    // Extract the relevant substring
    const relevantSubstring = text.slice(start, end);

    // Format the result with the specified syntax
    return `... ${relevantSubstring.replace(
        new RegExp(query, "gi"),
        (match) => match
    )} ...`;
}

export const handleSearchChange = async (
    event,
    setResults,
    setIsLoading,
    setIsOpen,
    setError,
    setSearchQuery,
    indices
) => {
    setIsLoading(true);
    setIsOpen(true);
    setError("");
    const query = event.target.value;
    setSearchQuery(event.target.value);

    axios
        .post("/searchCollections", {
            query: query,
            indices: indices,
        })
        .then((res) => {
            setResults(res.data.data);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setError(err.response.data.message || "Something went wrong");
        });
};
