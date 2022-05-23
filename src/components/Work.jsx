import React from "react";

const Work = ({ projects }) => {
    return (
        <div className="workContainer">
            <h1>Projects.</h1>
            <div className="projectsContainer">
                {projects.map(project => (
                    <div key={project.id} className="project">
                        <div className="image">
                            <a href={project.url}>
                                <img src={project.imageSrc} alt={project.title} />
                            </a>
                        </div>
                        <div className="title">
                            <strong>{project.title}</strong><br />
                            {project.short}
                            <a className="git-color" href={project.git}> (Github)</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Work;