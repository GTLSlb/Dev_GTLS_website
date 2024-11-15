import React from "react";

const RichTextRenderer = ({ content }) => {
    const renderNode = (node, key) => {
        if (!node) return null;

        const { type, children, text, ...rest } = node;

        switch (type) {
            case "paragraph":
                return (
                    <p key={key}>
                        {children?.map((child, idx) =>
                            renderNode(child, `${key}-${idx}`)
                        )}
                    </p>
                );

            case "list":
                const ListTag = node.format === "unordered" ? "ul" : "ol";
                return (
                    <ListTag key={key}>
                        {children?.map((child, idx) =>
                            renderNode(child, `${key}-${idx}`)
                        )}
                    </ListTag>
                );

            case "list-item":
                return (
                    <li key={key}>
                        {children?.map((child, idx) =>
                            renderNode(child, `${key}-${idx}`)
                        )}
                    </li>
                );

            case "heading":
                const headingStyles = {
                    1: { fontSize: "2em", fontWeight: "bold", margin: "1em 0" },
                    2: {
                        fontSize: "1.75em",
                        fontWeight: "bold",
                        margin: "1em 0",
                    },
                    3: {
                        fontSize: "1.5em",
                        fontWeight: "bold",
                        margin: "0.75em 0",
                    },
                    4: {
                        fontSize: "1.25em",
                        fontWeight: "bold",
                        margin: "0.5em 0",
                    },
                    5: {
                        fontSize: "1em",
                        fontWeight: "bold",
                        margin: "0.5em 0",
                    },
                    6: {
                        fontSize: "0.875em",
                        fontWeight: "bold",
                        margin: "0.5em 0",
                    },
                };
                const headingStyle =
                    headingStyles[node.level] || headingStyles[5];
                return (
                    <div key={key} style={headingStyle}>
                        {children?.map((child, idx) =>
                            renderNode(child, `${key}-${idx}`)
                        )}
                    </div>
                );
            case "code":
                // Collect the text content from the children
                const codeText = children
                    ?.map((child) => {
                        if (child.type === "text") {
                            return child.text;
                        }
                        return "";
                    })
                    .join("");

                return (
                    <pre key={key}>
                        <code>{codeText}</code>
                    </pre>
                );

            case "image":
                const { image } = node;
                const imageUrl = image.url.startsWith("http")
                    ? image.url
                    : `${process.env.STRAPI_APP}${image.url}`;
                return (
                    <img
                        key={key}
                        src={imageUrl}
                        alt={image.alternativeText || ""}
                        width={image.width}
                        height={image.height}
                    />
                );

            case "quote":
                return (
                    <blockquote key={key}>
                        {children?.map((child, idx) =>
                            renderNode(child, `${key}-${idx}`)
                        )}
                    </blockquote>
                );

            case "link":
                return (
                    <a key={key} href={node.url} className="text-blue-300">
                        {children?.map((child, idx) =>
                            renderNode(child, `${key}-${idx}`)
                        )}
                    </a>
                );

            case "text":
                const styleProps = {};
                if (node.bold) styleProps.fontWeight = "bold";
                if (node.italic) styleProps.fontStyle = "italic";
                if (node.underline) styleProps.textDecoration = "underline";
                if (node.strikethrough) {
                    styleProps.textDecoration = styleProps.textDecoration
                        ? `${styleProps.textDecoration} line-through`
                        : "line-through";
                }

                return (
                    <span key={key} style={styleProps}>
                        {text}
                    </span>
                );

            default:
                return children?.map((child, idx) =>
                    renderNode(child, `${key}-${idx}`)
                );
        }
    };

    return (
        <div>
            {content.map((node, index) => renderNode(node, index.toString()))}
        </div>
    );
};

export default RichTextRenderer;
