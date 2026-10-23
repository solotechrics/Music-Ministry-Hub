"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Song = require("./models/Song");
const Member = require("./models/Member");
const Assignment = require("./models/Assignment");
const Submission = require("./models/Submission");

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
    {
        fullName: "Director Two",
        email: "director2@example.com",
        password: "Password123",
        role: "director",
        memberType: "instrumentalist",
        part: "piano",
    },
    {
        fullName: "Member Two",
        email: "member2@example.com",
        password: "Password123",
        memberType: "instrumentalist",
        part: "guitar",
    },
];

async function seed() {
    await connectDB();

    await Submission.deleteMany({});
    await Assignment.deleteMany({});
    await Song.deleteMany({});
    const createdSongs = await Song.insertMany(songs);
    console.log(`Seeded ${createdSongs.length} songs`);

    await Member.deleteMany({});
    await Member.create(members);
    console.log(`Seeded ${members.length} members`);

    const director = await Member.findOne({ email: "director@example.com" });
    const sampleAssignments = [
        {
            song: createdSongs[0]._id,
            createdBy: director._id,
            title: "Learn the alto part",
            type: "sight_singing",
            audience: "choristers",
            instructions: "Sing the alto line of the first verse by sight.",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
            song: createdSongs[1]._id,
            createdBy: director._id,
            title: "Practice the melody by ear",
            type: "by_ear",
            audience: "all",
            instructions: "Listen to the reference and practice the melody.",
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        {
            song: createdSongs[2]._id,
            createdBy: director._id,
            title: "Read the keyboard part",
            type: "sight_reading",
            audience: "instrumentalists",
            instructions: "Read through the accompaniment at a steady tempo.",
            deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        },
    ];
    await Assignment.create(sampleAssignments);
    console.log(`Seeded ${sampleAssignments.length} assignments`);

    await mongoose.disconnect();
}

seed();
