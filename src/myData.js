let data;
export default data = {
    name: "Jonathan",

    contactEmail: "jonathan.marcantonio@mail.utoronto.ca",

    landingPageName: "Jonathan Marcantonio",

    landingPagePara: "A computer science student at the University Of Toronto.",

    landingPageImage: "assets/landingPageImage.jpg",

    projects: [
        {
            id: 0,
            title: "WikiLink",
            short: "Extend any URL using a random wikipedia article's contents.",
            tech: "NodeJS, ReactJS",
            imageSrc: "assets/wikilink.png",
            git: "https://github.com/lennysgarage/WikiLink",
            url: "https://wikifylink.me/"
        }

        // Paste more projects here from the template
    /*
                    If You Want To Add More Project just Copy and Paste This At The End (Update the id Respectively)
                ,{
                id: 7,
                service: 'Something Amazing',
                imageSrc: "",
                url: ''
            }
                */
    ],

    // Contact Section
  contactPara:
    "I would be happy to further discuss my experiences with you, simply shoot me an email or message me on LinkedIn! :)",
  social: [
    // Add Or Remove The Link Accordingly
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jonathan-marcantonio/"
    },
    {
      name: "Github",
      url: "https://github.com/lennysgarage"
    },
    {
        name: "Letterboxd",
        url: "https://letterboxd.com/lennysgarage/"
    }
  ],

};