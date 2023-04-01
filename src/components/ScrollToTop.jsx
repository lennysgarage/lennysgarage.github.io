import React, { useState, useEffect } from "react";

const ScrollToTop = () => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 1700) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);


    const handleClick = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
    };
    
    return (
        <div>
            {isVisible && (
                <button class="ScrollUp" onClick={handleClick}>☝️</button>
            )}
        </div>
    );
}

export default ScrollToTop;

