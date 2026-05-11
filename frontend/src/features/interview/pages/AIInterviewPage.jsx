// src/features/interview/pages/AIInterviewPage.jsx — NEW FILE
// ✅ FIX #3: AI Interview frontend implementation
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Brain, ChevronRight, CheckCircle, Loader } from "lucide-react";
import interviewService from "../interviewService";
import toast from "react-hot-toast";

const AIInterviewPage = () => {
  const { jobId } = useParams();
  const navigate  = useNavigate();

  const [questions,    setQuestions]    = useState([]);
  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [answer,       setAnswer]       = useState("");
  const [results,      setResults]      = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase,        setPhase]        = useState("start"); // start | interview | complete

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const qs = await interviewService.generateQuestions(jobId);
      setQuestions(Array.isArray(qs) ? qs : []);
      setPhase("interview");
    } catch (e) {
      toast.error("Failed to generate interview questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before continuing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const q = questions[currentIdx];
      const result = await interviewService.submitAnswer(q.id, answer);
      setResults(prev => [...prev, { question: q.questionText, answer, ...result }]);
      setAnswer("");

      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setPhase("complete");
      }
    } catch (e) {
      toast.error("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (phase === "start") {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Brain size={32} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-3">AI Interview</h1>
        <p className="text-surface-500 mb-8">
          You'll be asked 5 AI-generated questions tailored to this job. Your answers will
          be evaluated for relevance, confidence, and communication quality.
        </p>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-60 transition-colors"
        >
          {isGenerating ? (
            <><Loader size={16} className="animate-spin" /> Generating Questions…</>
          ) : (
            <><Brain size={16} /> Start AI Interview</>
          )}
        </button>
      </div>
    );
  }

  if (phase === "complete") {
    const avgScore = results.length
      ? Math.round(results.reduce((s, r) => s + (r.score ?? 0), 0) / results.length)
      : 0;
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <CheckCircle size={48} className="text-success-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Interview Complete!</h1>
        <p className="text-surface-500 mb-6">Average score: <span className="font-bold text-primary-600">{avgScore}%</span></p>
        <div className="space-y-4 text-left mb-8">
          {results.map((r, i) => (
            <div key={i} className="bg-surface-50 rounded-xl p-4">
              <p className="font-medium text-surface-700 mb-1">Q{i+1}: {r.question}</p>
              <p className="text-sm text-surface-500 mb-2">{r.feedback}</p>
              <div className="flex gap-4 text-xs font-medium">
                <span className="text-primary-600">Score: {r.score ?? "—"}%</span>
                <span className="text-surface-400">Confidence: {r.confidenceScore ?? "—"}%</span>
                <span className="text-surface-400">Communication: {r.communicationScore ?? "—"}%</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Job
        </button>
      </div>
    );
  }

  const current = questions[currentIdx];
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-2 text-sm text-surface-400 mb-6">
        <Brain size={14} /> Question {currentIdx + 1} of {questions.length}
      </div>
      <div className="bg-white border border-surface-200 rounded-2xl p-6 mb-6 shadow-sm">
        <p className="text-lg font-semibold text-surface-800">{current?.questionText}</p>
        {current?.category && (
          <span className="mt-2 inline-block text-xs font-medium px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
            {current.category}
          </span>
        )}
      </div>
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Type your answer here…"
        rows={6}
        className="w-full border border-surface-200 rounded-xl p-4 text-surface-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 mb-4"
      />
      <button
        onClick={handleSubmitAnswer}
        disabled={isSubmitting || !answer.trim()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-60 transition-colors"
      >
        {isSubmitting ? (
          <><Loader size={16} className="animate-spin" /> Evaluating…</>
        ) : (
          <>{currentIdx + 1 < questions.length ? "Next Question" : "Finish Interview"} <ChevronRight size={16} /></>
        )}
      </button>
    </div>
  );
};

export default AIInterviewPage;
