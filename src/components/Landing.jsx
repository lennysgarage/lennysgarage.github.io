import React from 'react';
import Header from './Header';
import Home from './Home';
import Projects from './Projects';
import Contact from './Contact';
import data from '../myData';


const Landing = () => {
    return (
        <div className="App">
            <div className="fullpage">
                <Header name={data.name}></Header>
                <Home name={data.landingPageName} paragraph={data.landingPagePara} profileImage={data.landingPageImage}/>
            </div>
            <Projects projects={data.projects}/>
            <Contact contactEmail={data.contactEmail} contactPara={data.contactPara} socialLinks={data.social}/>
        </div>
    )
}

export default Landing;