require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Song = require("./models/Song");

const songs = [
    {
        title: "Amazing Grace",
        composer: "John Newton",
        musicalKey: "G",
        tempoBpm: 72,
        referenceLink: "https://example.com/amazing-grace",
        notes: "Slow and steady",
    },
    {
        title: "Great Is Thy Faithfulness",
        composer: "Thomas Chisholm",
        musicalKey: "D",
        tempoBpm: 76,
        notes: "Watch the dynamics in the chorus",
    },
    { title: "Be Thou My Vision", musicalKey: "Eb", tempoBpm: 80 },
    {
        title: "It Is Well",
        composer: "Horatio Spafford",
        musicalKey: "Bb",
        tempoBpm: 68,
    },
    {
        title: "Holy, Holy, Holy",
        composer: "John B. Dykes",
        musicalKey: "Am",
        tempoBpm: 84,
        referenceLink: "https://example.com/holy-holy-holy",
    },
];

async function seed() {
    await connectDB();
    await Song.deleteMany({});
    const created = await Song.insertMany(songs);
    console.log(`Seeded ${created.length} songs`);
    await mongoose.disconnect();
}

seed();
