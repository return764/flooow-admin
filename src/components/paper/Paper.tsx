import React, {FC, HTMLAttributes, PropsWithChildren} from 'react';
import './Paper.css'

interface PaperProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement>  {
}

const Paper: FC<PaperProps> = props => {

    return (
        <div className={'base-paper'} {...props}>{props.children}</div>
    )
}

export default Paper;
