// src/components/RelevantJobs.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ML_API_END_POINT } from "@/utils/constant";

export default function RelevantJobs() {
    const profileSkills = useSelector((store) => store.auth.user?.profile?.skills || []);
    const [matchingJobs, setMatchingJobs] = useState([]);
    const [matchedCategory, setMatchedCategory] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async () => {
        setLoading(true);
        setHasSearched(true);

        try {
            console.log("[Frontend] Fetching recommendations with skills:", profileSkills);
            const { data } = await axios.post(
                `${ML_API_END_POINT}/recommend`,
                {},
                { withCredentials: true }
            );

            console.log("[Frontend] Received category:", data.category);
            console.log("[Frontend] Received jobs count:", data.jobs?.length || 0);
            setMatchedCategory(data.category || null);
            setMatchingJobs(data.jobs || []);
        } catch (e) {
            console.error("Recommendation error:", e);
            const msg = e.response?.data?.error || "Failed to fetch recommendations.";
            alert(msg);
            setMatchingJobs([]);
            setMatchedCategory(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Your skills:</span>
                {profileSkills.length > 0 ? (
                    profileSkills.map((skill, index) => (
                        <Badge key={`${skill}-${index}`} variant="outline">
                            {skill}
                        </Badge>
                    ))
                ) : (
                    <span className="text-sm text-red-500">
                        Please add skills in your profile to see relevant jobs.
                    </span>
                )}
            </div>

            <Button onClick={fetchRecommendations} disabled={loading || profileSkills.length === 0}>
                {loading ? "Matching..." : "Show Relevant Jobs"}
            </Button>

            {matchedCategory && (
                <p className="mt-3 text-sm text-gray-600">
                    ML category: <span className="font-medium">{matchedCategory}</span>
                </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <span>Loading matches...</span>
                ) : hasSearched && matchingJobs.length === 0 ? (
                    <span className="text-gray-700">No matching jobs found</span>
                ) : (
                    matchingJobs.map((job) => (
                        <LatestJobCards key={job._id} job={job} />
                    ))
                )}
            </div>
        </div>
    );
}
