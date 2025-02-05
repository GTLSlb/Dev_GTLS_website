import {
    highlightRelevantWords,
    navigateToSelector,
} from "@/Components/utils/SearchUtils";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export default function SearchHit({ hit, key, searchQuery, setIsOpen }) {
    const parser = new DOMParser();
    const hitKey = hit?.highlights?.[0]?.field;
    const doc = parser.parseFromString(hit?.document[hitKey], "text/html");

    // Extract the text content from the HTML
    const textContent = doc.body.textContent;
    const description = highlightRelevantWords(textContent, searchQuery);

    return (
        <div
            className="flex gap-x-2 py-1.5 hover:bg-goldt/50 hover:cursor-pointer"
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
            <ArrowRightAltIcon height={20} width={20} />
            <p className="hit-description">{description}</p>
        </div>
    );
}
