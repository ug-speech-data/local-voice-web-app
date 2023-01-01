import './style.scss';

function TextOverflow({ text, width = 20, ...props }) {
    const renderText = text.slice(0, (width / 2)) + "..." + text.slice(-(width / 2));
    return (
        <span className="text-overflow" {...props}>
            {renderText}
        </span>
    );
}

export default TextOverflow;
