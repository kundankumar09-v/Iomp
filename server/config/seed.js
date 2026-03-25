const mongoose = require("mongoose");
const Event = require("../models/event");
const Stall = require("../models/stall");

const positions = [12.5, 37.5, 62.5, 87.5];

function getRandomPosition(used) {
  while (true) {
    const x = positions[Math.floor(Math.random() * positions.length)];
    const y = positions[Math.floor(Math.random() * positions.length)];
    const key = `${x}-${y}`;

    if (!used.has(key)) {
      used.add(key);
      return { x, y };
    }
  }
}

const seedData = async () => {
  try {


    const eventCount = await Event.countDocuments();

    // if (eventCount > 0) {
    //   console.log("Database already has events. Skipping seed.");
    //   return;
    // }

   

    console.log("Seeding database with default events and stalls...");

    const defaultEvents = [  {
    name: "Sunburn Festival 2026",
    type: "concert",
    city: "Pune",
    address: "Vagad Ground, Pune",
    duration: "3 Days",
    date: "2026-12-28",
    ticketType: "Paid",
    ageLimit: "18+",
    language: "English/Hindi",
    aboutEvent: "Asia's biggest electronic dance music festival returns with world-class DJs, immersive stages, and an unforgettable atmosphere.",
    eventImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
    createdBy: "Admin"
  },
  {
    name: "India Art & Culture Fest",
    type: "exhibition",
    city: "Delhi",
    address: "Pragati Maidan, New Delhi",
    duration: "5 Days",
    date: "2026-09-12",
    ticketType: "Free",
    ageLimit: "All Ages",
    language: "Hindi/English",
    aboutEvent: "A grand celebration of India's rich artistic heritage featuring paintings, sculptures, live performances, and cultural installations from across the country.",
    eventImage: "https://images.unsplash.com/photo-1578926288207-32356a4c6d21?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1560523159-4a9692d222ef?w=800&q=80",
    createdBy: "Admin"
  },
  {
    name: "Standup Specials Night",
    type: "comedy",
    city: "Bangalore",
    address: "Chowdiah Memorial Hall",
    duration: "2.5 hours",
    date: "2026-10-18",
    ticketType: "Paid",
    ageLimit: "18+",
    language: "English/Kannada",
    aboutEvent: "Five of India's hottest standup comedians take the stage for a night of raw, unfiltered humor covering life, relationships, and everything in between.",
    eventImage: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
    createdBy: "Admin"
  },
  {
    name: "Rock the Arena",
    type: "concert",
    city: "Chennai",
    address: "Jawaharlal Nehru Stadium",
    duration: "5 hours",
    date: "2026-11-08",
    ticketType: "Paid",
    ageLimit: "16+",
    language: "English/Tamil",
    aboutEvent: "The ultimate rock music experience with legendary bands and emerging artists delivering high-voltage performances that will shake the arena.",
    eventImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    createdBy: "Admin"
  },
  {
    name: "Future of AI Summit",
    type: "exhibition",
    city: "Hyderabad",
    address: "Hyderabad International Convention Centre",
    duration: "2 Days",
    date: "2026-08-22",
    ticketType: "Paid",
    ageLimit: "All Ages",
    language: "English",
    aboutEvent: "A premier gathering of AI researchers, tech leaders, and innovators showcasing breakthroughs in machine learning, generative AI, and autonomous systems.",
    eventImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    createdBy: "Admin"
  },
  {
    name: "Bollywood Beats Live",
    type: "concert",
    city: "Mumbai",
    address: "Andheri Sports Complex",
    duration: "3 hours",
    date: "2026-12-05",
    ticketType: "Paid",
    ageLimit: "All Ages",
    language: "Hindi",
    aboutEvent: "Dance the night away to your favourite Bollywood tracks performed live by top playback singers and backed by a 30-piece orchestra.",
    eventImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
    createdBy: "Admin"
  },
  {
    name: "Food & Flavours Festival",
    type: "exhibition",
    city: "Kolkata",
    address: "Milan Mela Grounds",
    duration: "4 Days",
    date: "2026-09-25",
    ticketType: "Free",
    ageLimit: "All Ages",
    language: "Bengali/English",
    aboutEvent: "A foodie paradise featuring over 200 stalls from regional and international cuisines, live cooking demos by celebrity chefs, and food competitions.",
    eventImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    createdBy: "Admin"
  },
  {
    name: "Open Mic Madness",
    type: "comedy",
    city: "Hyderabad",
    address: "Lamakaan Open Cultural Space",
    duration: "3 hours",
    date: "2026-10-30",
    ticketType: "Free",
    ageLimit: "16+",
    language: "Telugu/English/Hindi",
    aboutEvent: "An open mic night that celebrates new voices in comedy. Watch fresh talent take the stage alongside seasoned performers in a relaxed, fun environment.",
    eventImage: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?w=800&q=80",
    layoutImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    createdBy: "Admin"
  }
,
      {
        name: "Neon Lights Music Concert",
        type: "concert",
        city: "Hyderabad",
        address: "Gachibowli Stadium",
        duration: "4 hours",
        date: "2026-12-15",
        ticketType: "Paid",
        ageLimit: "18+",
        language: "English/Hindi",
        aboutEvent: "Experience the most electrifying music concert of the year with top artists performing live under neon lights.",
        eventImage: "https://images.unsplash.com/photo-1540039155732-d68a9f394464?w=800&q=80",
        layoutImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
        createdBy: "Admin"
      },
      {
        name: "Tech Innovators Exhibition",
        type: "exhibition",
        city: "Bangalore",
        address: "BIEC Grounds",
        duration: "3 Days",
        date: "2026-10-05",
        ticketType: "Free",
        ageLimit: "All Ages",
        language: "English",
        aboutEvent: "Explore the future of technology, AI, and robotics. Meet startup founders and try out cutting-edge gadgets.",
        eventImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        layoutImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
        createdBy: "Admin"
      },
      {
        name: "Laughter Riot Comedy Show",
        type: "comedy",
        city: "Mumbai",
        address: "NCPA Nariman Point",
        duration: "2 hours",
        date: "2026-11-20",
        ticketType: "Paid",
        ageLimit: "16+",
        language: "Hindi",
        aboutEvent: "A lineup of the country's best comedians ready to make you laugh until your stomach hurts.",
        eventImage: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
        layoutImage: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
        createdBy: "Admin"
      }
    ];

    for (let eventData of defaultEvents) {
      const event = new Event(eventData);
      await event.save();

      const used = new Set();


      // Seed stalls for this event
      const baseStalls = [
  { name: "Main Entry", type: "entry" },
  { name: "Information", type: "help" },
  { name: "VIP Lounge", type: "stall" },
  { name: "Food Court", type: "food" },
  { name: "Restroom A", type: "restroom" },
  { name: "Main Stage", type: "stage" },
  { name: "Exit Gate", type: "exit" },
];

      for (let stallData of baseStalls) {
  const pos = getRandomPosition(used);

  const stall = new Stall({
    ...stallData,
    x: pos.x,
    y: pos.y,
    eventId: event._id.toString(),
  });

  await stall.save();
}

      
    }

    console.log("✅ Seed completed successfully! Default events are now available.");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
};

module.exports = seedData;