import { useState, useEffect } from "react";

export const isLargeScreen = () => {
    const [largeScreen, setLargeScreen] = useState(
        window.screen.width >= window.screen.height
    );
    
    useEffect(() => {
        const handleResize = () => {
            setLargeScreen(window.screen.width >= window.screen.height);
        };
        const subscription = window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize); // Limpieza del listener
        };
    }, [window.screen.width]);
    return largeScreen;
}