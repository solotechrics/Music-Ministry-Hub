"use strict";

const jwt = require("jsonwebtoken");
const Member = require("../src/models/Member");
const Song = require("../src/models/Song");
const Assignment = require("../src/models/Assignment");

const createMember = async function (overrides = {}) {
    return Member.create({
        fullName: "Test Person",
        email: `${Math.random().toString(36).slice(2)}@example.com`,
        password: "Password123",
        memberType: "chorister",
        ...overrides,
    });
};

const tokenFor = function (member) {
    return jwt.sign({ id: member._id, role: member.role }, process.env.JWT_SECRET);
};

const createSong = async function () {
    return Song.create({ title: "Amazing Grace", musicalKey: "G" });
};

const createAssignment = async function (song, member, overrides = {}) {
    return Assignment.create({
        song: song._id,
        createdBy: member._id,
        title: "Practice this week",
        type: "sight_singing",
        audience: "all",
        instructions: "Practice the melody",
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ...overrides,
    });
};

module.exports = { createMember, tokenFor, createSong, createAssignment };
