"use client";
import React, { useState } from "react";
import { Trophy, Calendar, Users, Grip, Send, Loader2 } from "lucide-react";

// Tournament interface
interface Tournament {
  id: string;
  name: string;
  date: string;
}

// Sample tournament data
const initialTournaments: Tournament[] = [
  {
    id: "t1",
    name: "Summer Chess Championship",
    date: "2024-07-15",
  },
  {
    id: "t2",
    name: "Regional eSports Showdown",
    date: "2024-08-22",
  },
  {
    id: "t3",
    name: "Local Basketball Tournament",
    date: "2024-09-05",
  },
  { id: "t4", name: "Coding Hackathon", date: "2024-10-10" },
];

const TournamentManagement: React.FC = () => {
  const [availableTournaments, setAvailableTournaments] =
    useState<Tournament[]>(initialTournaments);
  const [selectedTournaments, setSelectedTournaments] = useState<Tournament[]>(
    []
  );
  const [draggedTournament, setDraggedTournament] = useState<Tournament | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    tournament: Tournament,
    source: "available" | "selected"
  ) => {
    setDraggedTournament(tournament);
    e.dataTransfer?.setData("text/plain", tournament.id);
    e.dataTransfer?.setDragImage(e.currentTarget, 10, 10);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: "available" | "selected"
  ) => {
    e.preventDefault();

    if (!draggedTournament) return;

    if (target === "available") {
      // Moving from selected to available
      setSelectedTournaments((prev) =>
        prev.filter((t) => t.id !== draggedTournament.id)
      );
      setAvailableTournaments((prev) => [...prev, draggedTournament]);
    } else {
      // Moving from available to selected
      setAvailableTournaments((prev) =>
        prev.filter((t) => t.id !== draggedTournament.id)
      );
      setSelectedTournaments((prev) => [...prev, draggedTournament]);
    }

    setDraggedTournament(null);
  };

  const handleSubmit = async () => {
    // Reset previous submit status
    setSubmitStatus("idle");

    // Prevent submitting if no tournaments are selected
    if (selectedTournaments.length === 0) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Console log the selected tournaments
      console.log("Submitting Featured Tournaments:", selectedTournaments);

      // Mock API call - replace with your actual API endpoint
      const response = await fetch("/api/featured-tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTournaments),
      });

      if (!response.ok) {
        throw new Error("Failed to submit tournaments");
      }

      setSubmitStatus("success");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTournamentCard = (
    tournament: Tournament,
    source: "available" | "selected"
  ) => (
    <div
      key={tournament.id}
      draggable
      onDragStart={(e) => handleDragStart(e, tournament, source)}
      className="bg-gray-800 p-3 mb-2 rounded-md shadow-md hover:bg-gray-700 transition flex items-center cursor-move"
    >
      <Grip size={16} className="mr-2 text-gray-500" />
      <div className="flex-grow">
        <h3 className="font-medium text-gray-100 text-sm sm:text-base">
          {tournament.name}
        </h3>
        <div className="text-xs sm:text-sm text-gray-400 flex flex-col sm:flex-row sm:items-center">
          <div className="flex items-center mr-2">
            <Calendar size={14} className="mr-1" /> {tournament.date}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex flex-col sm:flex-row items-center justify-center">
        <Trophy className="mb-2 sm:mb-0 sm:mr-3 text-indigo-400" />
        <span className="text-indigo-300">Tournament Management</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Tournaments */}
        <div
          className="bg-gray-800 shadow-lg rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "available")}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-200">
            <Calendar className="mr-2 text-blue-400" /> Available Tournaments
          </h2>
          <div className="min-h-[300px] sm:min-h-[400px] bg-gray-900 p-4 rounded-md border border-gray-700">
            {availableTournaments.map((tournament) =>
              renderTournamentCard(tournament, "available")
            )}
            {availableTournaments.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No tournaments available
              </div>
            )}
          </div>
        </div>

        {/* Selected Tournaments */}
        <div
          className="bg-gray-800 shadow-lg rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "selected")}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-200">
            <Trophy className="mr-2 text-green-400" /> Featured Tournaments
          </h2>
          <div className="min-h-[300px] sm:min-h-[400px] bg-gray-900 p-4 rounded-md border border-gray-700">
            {selectedTournaments.map((tournament) =>
              renderTournamentCard(tournament, "selected")
            )}
            {selectedTournaments.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                Drag tournaments here to feature them
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={handleSubmit}
          disabled={selectedTournaments.length === 0 || isSubmitting}
          className={`
            flex items-center justify-center 
            px-4 sm:px-6 py-2 sm:py-3 rounded-md 
            ${
              selectedTournaments.length === 0
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
              Submit Featured Tournaments
            </>
          )}
        </button>

        {/* Submit Status Indicators */}
        {submitStatus === "success" && (
          <div className="mt-4 text-green-400 flex items-center text-sm sm:text-base">
            <Trophy className="mr-2" size={20} />
            Tournaments successfully submitted!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mt-4 text-red-400 flex items-center text-sm sm:text-base">
            Error submitting tournaments. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentManagement;
