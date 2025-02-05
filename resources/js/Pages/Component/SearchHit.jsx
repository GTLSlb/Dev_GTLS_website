import {
    highlightRelevantWords,
    navigateToSelector,
} from "@/Components/utils/SearchUtils";
export default function SearchHit({ hit, key, searchQuery, setIsOpen }) {
    const title = hit?.document?.url || "No title available";
    const parser = new DOMParser();
    const hitKey = hit?.highlights?.[0]?.field;
    const doc = parser.parseFromString(hit?.document[hitKey], "text/html");

    // Extract the text content from the HTML
    const textContent = doc.body.textContent;
    const description = highlightRelevantWords(textContent, searchQuery);

    return (
        <div
            className="px-2 py-1 hover:bg-goldt/50 hover:cursor-pointer"
            key={key}
            onClick={() =>
                navigateToSelector(
                    hit?.document?.selector,
                    hit?.document?.url,
                    hit,
                    setIsOpen,
                )
            }
        >
            <h3 className="text-gray-600 text-xs">{title}</h3>
            <p className="hit-description">{description}</p>
        </div>
    );
}
