import React from "react";

const Home = ({ name, paragraph, profileImage }) => {
    return (
        <div>
            <div className="homeContainer">
                <div className="homeHeaderWrapper">
                    <h1>
                        Hello, I'm <br />
                        <span>{name}</span>
                    </h1>
                    <p>{paragraph}</p>
                </div>
                <div className="imageContainer">
                    <img src={profileImage} alt="Author"/>
                    <div className="bg" />
                </div>
            </div>
        </div>
    );
}

export default Home;