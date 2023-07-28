import React, {FC, HTMLAttributes, PropsWithChildren} from 'react';
import './index.css'

interface PaperProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement>  {
}

const Paper: FC<PaperProps> = props => {

    return (
        <div {...props} className={`base-paper ${props.className}`}>{props.children}</div>
    )
}

export default Paper;
