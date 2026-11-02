
const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");

// 1. POST - Submit Feedback
router.post("/", async (req, res) => {
    try {
        const { studentName, courseName, message, rating } = req.body;

        if (!studentName || !courseName || !message || rating === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const feedback = await Feedback.create({
            studentName,
            courseName,
            message,
            rating
        });

        res.status(201).json({
            message: "Feedback submitted successfully",
            data: feedback
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// 2. GET - Retrieve Feedback with Pagination
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const feedback = await Feedback.find()
            .skip(skip)
            .limit(limit);

        const totalRecords = await Feedback.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            data: feedback
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});




module.exports = router;
