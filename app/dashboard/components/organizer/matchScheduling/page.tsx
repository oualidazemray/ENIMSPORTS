"use client";
import React, { useState } from "react";
import { Clock, Users, Grip, Send, Loader2, Calendar } from "lucide-react";

// Match interface
interface Match {
  id: string;
  teamA: string;
  teamB: string;
  date: string;
  time: string;
  venue: string;
}

// Sample match data
const initialMatches: Match[] = [
  {
    id: "m1",
    teamA: "Eagles",
    teamB: "Lions",
    date: "2024-07-20",
    time: "14:00",
    venue: "Central Stadium",
  },
  {
    id: "m2",
    teamA: "Tigers",
    teamB: "Wolves",
    date: "2024-07-21",
    time: "16:30",
    venue: "North Arena",
  },
  {
    id: "m3",
    teamA: "Sharks",
    teamB: "Panthers",
    date: "2024-07-22",
    time: "15:45",
    venue: "Seaside Complex",
  },
  {
    id: "m4",
    teamA: "Hawks",
    teamB: "Falcons",
    date: "2024-07-23",
    time: "18:00",
    venue: "City Stadium",
  },
];

const MatchScheduling: React.FC = () => {
  const [availableMatches, setAvailableMatches] =
    useState<Match[]>(initialMatches);
  const [scheduledMatches, setScheduledMatches] = useState<Match[]>([]);
  const [draggedMatch, setDraggedMatch] = useState<Match | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    match: Match,
    source: "available" | "scheduled"
  ) => {
    setDraggedMatch(match);
    e.dataTransfer?.setData("text/plain", match.id);
    e.dataTransfer?.setDragImage(e.currentTarget, 10, 10);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: "available" | "scheduled"
  ) => {
    e.preventDefault();

    if (!draggedMatch) return;

    if (target === "available") {
      // Moving from scheduled to available
      setScheduledMatches((prev) =>
        prev.filter((m) => m.id !== draggedMatch.id)
      );
      setAvailableMatches((prev) => [...prev, draggedMatch]);
    } else {
      // Moving from available to scheduled
      setAvailableMatches((prev) =>
        prev.filter((m) => m.id !== draggedMatch.id)
      );
      setScheduledMatches((prev) => [...prev, draggedMatch]);
    }

    setDraggedMatch(null);
  };

  const handleSubmit = async () => {
    // Reset previous submit status
    setSubmitStatus("idle");

    // Prevent submitting if no matches are scheduled
    if (scheduledMatches.length === 0) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Console log the scheduled matches
      console.log("Submitting Scheduled Matches:", scheduledMatches);

      // Mock API call - replace with your actual API endpoint
      const response = await fetch("/api/match-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduledMatches),
      });

      if (!response.ok) {
        throw new Error("Failed to submit match schedule");
      }

      setSubmitStatus("success");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMatchCard = (match: Match, source: "available" | "scheduled") => (
    <div
      key={match.id}
      draggable
      onDragStart={(e) => handleDragStart(e, match, source)}
      className="bg-gray-800 p-3 mb-2 rounded-md shadow-md hover:bg-gray-700 transition flex items-center cursor-move"
    >
      <Grip size={16} className="mr-2 text-gray-500" />
      <div className="flex-grow">
        <h3 className="font-medium text-gray-100 text-sm sm:text-base">
          {match.teamA} vs {match.teamB}
        </h3>
        <div className="text-xs sm:text-sm text-gray-400 flex flex-col sm:flex-row sm:items-center">
          <div className="flex items-center mr-2">
            <Calendar size={14} className="mr-1" /> {match.date}
          </div>
          <div className="flex items-center mr-2">
            <Clock size={14} className="mr-1" /> {match.time}
          </div>
          <div className="flex items-center">
            <Users size={14} className="mr-1" /> {match.venue}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex flex-col sm:flex-row items-center justify-center">
        <Clock className="mb-2 sm:mb-0 sm:mr-3 text-indigo-400" />
        <span className="text-indigo-300">Match Scheduling</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Matches */}
        <div
          className="bg-gray-800 shadow-lg rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "available")}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-200">
            <Users className="mr-2 text-blue-400" /> Available Matches
          </h2>
          <div className="min-h-[300px] sm:min-h-[400px] bg-gray-900 p-4 rounded-md border border-gray-700">
            {availableMatches.map((match) =>
              renderMatchCard(match, "available")
            )}
            {availableMatches.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No matches available
              </div>
            )}
          </div>
        </div>

        {/* Scheduled Matches */}
        <div
          className="bg-gray-800 shadow-lg rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "scheduled")}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-200">
            <Clock className="mr-2 text-green-400" /> Scheduled Matches
          </h2>
          <div className="min-h-[300px] sm:min-h-[400px] bg-gray-900 p-4 rounded-md border border-gray-700">
            {scheduledMatches.map((match) =>
              renderMatchCard(match, "scheduled")
            )}
            {scheduledMatches.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                Drag matches here to schedule them
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={handleSubmit}
          disabled={scheduledMatches.length === 0 || isSubmitting}
          className={`
            flex items-center justify-center 
            px-4 sm:px-6 py-2 sm:py-3 rounded-md 
            ${
              scheduledMatches.length === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }
            transition duration-300 ease-in-out
            disabled:opacity-50
            text-sm sm:text-base
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2" size={20} />
              Submit Match Schedule
            </>
          )}
        </button>

        {/* Submit Status Indicators */}
        {submitStatus === "success" && (
          <div className="mt-4 text-green-400 flex items-center text-sm sm:text-base">
            <Clock className="mr-2" size={20} />
            Match schedule successfully submitted!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mt-4 text-red-400 flex items-center text-sm sm:text-base">
            Error submitting match schedule. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchScheduling;
