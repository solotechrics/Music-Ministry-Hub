"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Song = require("./models/Song");
const Member = require("./models/Member");

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

const members = [
    {
        fullName: "Director One",
        email: "director@example.com",
        password: "Password123",
        role: "director",
        memberType: "instrumentalist",
        part: "keyboard",
    },
    {
        fullName: "Member One",
        email: "member@example.com",
        password: "Password123",
        memberType: "chorister",
        part: "alto",
    },
];

async function seed() {
    await connectDB();

    await Song.deleteMany({});
    const createdSongs = await Song.insertMany(songs);
    console.log(`Seeded ${createdSongs.length} songs`);

    await Member.deleteMany({});
    await Member.create(members);
    console.log(`Seeded ${members.length} members`);

    await mongoose.disconnect();
}

seed();
