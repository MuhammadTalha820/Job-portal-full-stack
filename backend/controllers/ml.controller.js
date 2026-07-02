// server/controllers/ml.controller.js
import axios from "axios";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

const PYTHON_SERVICE = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function callMLService(skillsText) {
    console.log("[Backend] Sending skills to ML service:", skillsText);
    const resp = await axios.post(
        `${PYTHON_SERVICE}/predict`,
        { text: skillsText },
        { timeout: 5000 }
    );
    console.log("[Backend] ML service predicted category:", resp.data.category);
    return resp.data.category;
}

export const recommendJobs = async (req, res) => {
    try {
        const user = await User.findById(req.id).select("profile.skills");
        const rawSkills = user?.profile?.skills;

        if (!Array.isArray(rawSkills) || rawSkills.length === 0) {
            return res.status(400).json({ error: "Please add skills to your profile first." });
        }

        const skills = rawSkills
            .map((skill) => String(skill).trim())
            .filter(Boolean);

        if (skills.length === 0) {
            return res.status(400).json({ error: "Please add skills to your profile first." });
        }

        const skillsText = skills.join(" ");
        let predictedCategory = null;

        try {
            predictedCategory = await callMLService(skillsText);
        } catch (mlError) {
            console.warn("[Backend] ML service unavailable, matching jobs by profile skills only:", mlError.message);
        }

        const searchTerms = [...skills, predictedCategory]
            .map((term) => String(term || "").trim())
            .filter(Boolean);

        const regexes = searchTerms.map((term) => new RegExp(escapeRegExp(term), "i"));

        console.log("[Backend] Querying jobs with terms:", searchTerms);
        const jobs = await Job.find({
            $or: [
                { title: { $in: regexes } },
                { description: { $in: regexes } },
                { requirements: { $in: regexes } },
                { jobType: { $in: regexes } },
            ],
        })
            .populate("company")
            .sort({ createdAt: -1 });

        console.log("[Backend] Returning jobs count:", jobs.length);
        return res.json({ category: predictedCategory, skills, jobs });
    } catch (err) {
        console.error("Recommend error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
