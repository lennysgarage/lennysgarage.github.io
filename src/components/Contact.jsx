import React from "react";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";

const Contact = ({ contactEmail, contactPara, socialLinks }) => {
    return (
        <div className="contactContainer">
            <h1>Get in touch.</h1>
            <p>{contactPara}</p>
            <a className="email_link" href={`mailto:${contactEmail}`}>
                {contactEmail}
            </a>
            <div className="social_links">
                <ul>
                    <li>
                        <a id="end" href={`mailto:${contactEmail}`}>
                            <FaEnvelope />
                        </a>
                    </li>
                    <li>
                        <a href={socialLinks[0].url}>
                            <FaLinkedin />
                        </a>
                    </li>
                    <li>
                        <a href={socialLinks[1].url}>
                            <FaGithub />
                        </a>
                    </li>
                    <li>
                        <a href={socialLinks[2].url}>
                            <SiLetterboxd />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Contact;