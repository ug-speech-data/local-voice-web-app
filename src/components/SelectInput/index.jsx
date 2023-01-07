import './style.scss';
import { Fragment } from 'react';


function SelectInput({ options = [], value = "", ...props }) {

    return (
        <Fragment>
            <select className="form-select" id="locale" aria-describedby="locale"
                {...props}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value} selected={value === option.value}>{option.label}</option>
                ))}
            </select>
        </Fragment>
    );
}

export default SelectInput;
