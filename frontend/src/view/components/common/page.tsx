import * as React from 'react';
import './page.scss';

export function Page (props:{
  children:React.ReactNode;
  top?:JSX.Element;
  bottom?:JSX.Element;
  className?:string;
  style?:React.CSSProperties;
}) {
  return <div className={'page'}>
    { props.top &&
      <div className="top">
        {props.top}
      </div> 
    }

    <div className={`body ${props.className || ''}`} style={props.style}>
      {props.children}
    </div>

    { props.bottom &&
      <div className="bottom">
        {props.bottom}
      </div> 
    }

  </div>; 
}