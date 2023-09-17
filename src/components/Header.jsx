import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

const Header = ({ name }) => {
    return (
        <div>
            <div className="headerContainer">
                <div style={{ "cursor": "pointer" }}>
                    <Link to="/">
                        <h1>{name}.</h1>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/assets/Jonathan_Marcantonio_Resume.pdf" target="_blank">
                                <h2>resume</h2>
                            </Link>
                        </li>
                        <li>
                            <HashLink smooth to="/#projects">
                                <h2>projects</h2>
                            </HashLink>
                        </li>
                        <li>
                            <HashLink smooth to="/#contact">
                                    <h2>contact</h2>
                            </HashLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Header