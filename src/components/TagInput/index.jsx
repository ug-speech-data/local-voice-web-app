import './style.scss';
import { useState, useEffect } from 'react'

function TagInput({ tags=[], selectedTags, setSelectedTags, maxSelection = 2 }) {
    const [disabled, setDisabled] = useState(false)

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag))
        } else {
            if (selectedTags.length >= maxSelection) {
                return
            }
            setSelectedTags([...selectedTags, tag])
        }
    }

    useEffect(() => {
        setDisabled(selectedTags.length >= maxSelection)
    }, [selectedTags, maxSelection])

    return (
        <div className="tag-input">

            <div className="selected-tags">
                {selectedTags.map((tag, index) => (
                    <span key={index} onClick={() => handleTagClick(tag)}>{tag} <i className="bi bi-x-lg"></i> </span>
                ))}
            </div>

            <p className='mt-3'>Click to select</p>
            <div className="tags">
                {tags.length > 0 ? tags.map((tag, index) => (
                    <span
                        key={index}
                        className={disabled ? "disabled" : ""}
                        onClick={() => handleTagClick(tag)}>
                        {tag}
                    </span>
                )) : <p className='text-bold'><b>No more tags</b></p>}
            </div>
        </div>
    );
}

export default TagInput;
