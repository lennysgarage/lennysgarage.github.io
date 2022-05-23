import React from "react";

const Header = ({name}) => {
    return (
        <div>
            <div className="headerContainer">
                <h1>{name}.</h1>
                <nav>
                    <ul>
                        <li>
                            <h2>resume</h2>
                        </li>
                        <li>
                            <h2>projects</h2>
                        </li>
                        <li>
                            <h2>contact</h2>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Header