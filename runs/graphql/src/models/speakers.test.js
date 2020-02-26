const { getEvents } = require("./events.js");
jest.mock("./events.js");
const { getSpeakers, getSpeakerProfiles } = require("./speakers.js");

test("getSpeakers be defined", () => {
  expect(getSpeakers).toBeDefined();
});

test("getSpeakers be defined", () => {
  const events = [
    {
      title: "Hello CopenhagenJS",
      selfLink:
        "https://copenhagenjs.dk/archive/2011-07-21-hello-copenhagenjs/",
      markdown: "Welcome",
      date: new Date(),
      type: "update",
      location: "",
      presentations: [{ name: "Donald Duck", title: "Welcome to Disney" }]
    }
  ];
  getEvents.mockReturnValueOnce(events);

  expect(getSpeakers()).toEqual([
    {
      selfLink:
        "https://copenhagenjs.dk/archive/2011-07-21-hello-copenhagenjs/",
      name: "Donald Duck",
      slug: "donald-duck",
      title: "Welcome to Disney"
    }
  ]);
});

test("getSpeakerProfiles be defined", () => {
  expect(getSpeakerProfiles).toBeDefined();
});

test("getSpeakerProfiles should return profiles with presentations", () => {
  const events = [
    {
      title: "Hello CopenhagenJS",
      selfLink:
        "https://copenhagenjs.dk/archive/2011-07-21-hello-copenhagenjs/",
      markdown: "Welcome",
      date: new Date(),
      type: "update",
      location: "",
      presentations: [
        { name: "Donald Duck", title: "Welcome to Disney" },
        { name: "Goofy Goof", title: "React.js in Disneyland" }
      ]
    },
    {
      title: "Hello CopenhagenJS 2",
      selfLink:
        "https://copenhagenjs.dk/archive/2011-07-21-hello-copenhagenjs-2/",
      markdown: "Welcome",
      date: new Date(),
      type: "update",
      location: "",
      presentations: [
        { name: "Goofy Goof", title: "Programming funny websites" },
        { name: "Batman", title: "My secret tools" }
      ]
    }
  ];
  getEvents.mockReturnValueOnce(events);
  const profiles = getSpeakerProfiles();
  expect(profiles).toEqual([
    {
      name: "Donald Duck",
      slug: "donald-duck",
      presentations: [
        {
          title: "Welcome to Disney",
          slug: "welcome-to-disney",
          selfLink: events[0].selfLink
        }
      ],
      presentationsCount: 1
    },
    {
      name: "Goofy Goof",
      slug: "goofy-goof",
      presentations: [
        {
          title: "React.js in Disneyland",
          slug: "reactjs-in-disneyland",
          selfLink: events[0].selfLink
        },
        {
          title: "Programming funny websites",
          slug: "programming-funny-websites",
          selfLink: events[1].selfLink
        }
      ],
      presentationsCount: 2
    },
    {
      name: "Batman",
      slug: "batman",
      presentations: [
        {
          title: "My secret tools",
          slug: "my-secret-tools",
          selfLink: events[1].selfLink
        }
      ],
      presentationsCount: 1
    }
  ]);
});
