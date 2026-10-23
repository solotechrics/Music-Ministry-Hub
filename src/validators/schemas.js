"use strict";

const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "must be a valid id");

const httpUrl = z
    .string()
    .trim()
    .refine((value) => {
        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    }, "must be a valid http or https URL");

const signupSchema = z.object({
    fullName: z.string().trim().min(1, "is required").max(100),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(8).max(72),
    memberType: z.enum(["chorister", "instrumentalist"]),
    part: z.string().trim().max(50).optional(),
});

const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
});

const songSchema = z.object({
    title: z.string().trim().min(1, "is required").max(120),
    composer: z.string().max(100).optional(),
    musicalKey: z.string().regex(/^[A-G][#b]?m?$/),
    tempoBpm: z.number().int().min(30).max(240).optional(),
    referenceLink: httpUrl.optional(),
    notes: z.string().trim().optional(),
});

const assignmentCreateSchema = z.object({
    song: objectId,
    title: z.string().trim().min(1, "is required").max(120),
    type: z.enum(["sight_singing", "sight_reading", "by_ear"]),
    audience: z.enum(["choristers", "instrumentalists", "all"]),
    instructions: z.string().trim().min(1, "is required").max(2000),
    tutorialLink: httpUrl.optional(),
    deadline: z
        .iso.datetime()
        .refine((value) => new Date(value) > new Date(), "must be in the future"),
});

const assignmentUpdateSchema = assignmentCreateSchema
    .omit({ song: true })
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
        message: "at least one field is required",
    });

const submissionCreateSchema = z.object({
    link: httpUrl,
    note: z.string().trim().max(500).optional(),
});

const submissionUpdateSchema = submissionCreateSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
        message: "at least one field is required",
    });

module.exports = {
    objectId,
    httpUrl,
    signupSchema,
    loginSchema,
    songSchema,
    assignmentCreateSchema,
    assignmentUpdateSchema,
    submissionCreateSchema,
    submissionUpdateSchema,
};
