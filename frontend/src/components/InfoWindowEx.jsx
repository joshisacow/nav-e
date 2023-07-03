import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { InfoWindow } from "@react-google-maps/api";

export default function InfoWindowEx(props) {
    const infoWindowRef = useRef(null);
  
    useEffect(() => {
      if (infoWindowRef.current) {
        const infoWindow = new window.google.maps.InfoWindow();
        infoWindow.setContent(props.children);
        infoWindowRef.current = infoWindow;
      }
    }, [props.children]);
  
    return <InfoWindow {...props} onLoad={() => {}} ref={infoWindowRef} />;
  }