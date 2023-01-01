import { Fragment } from 'react';
import './style.scss';

function ToolTip({ header = null, children, ...props }) {
    return (
        <span className='tool-tip'>
            <span className="header">
                {header == null && <i className="bi bi-info-circle"></i>}
                {header}
            </span>
            <span className="content" {...props}>
                {children}
            </span>
        </span>
    );
}

export default ToolTip;
