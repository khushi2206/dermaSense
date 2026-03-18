import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Sparkles, CheckCircle, Loader2, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { getCurrentUser, saveLocalProfile } from "@/lib/session";
import { generateGeminiAnalysis, GeminiAnalysis } from "@/lib/gemini";

// ─── Questionnaire definition ────────────────────────────────────
const QUESTIONS = [
  {
    id: "endOfDayFeel",
    question: "How does your skin feel by the END of the day? (not after washing)",
    options: [
      { label: "Tight / dry", value: "feels tight or dry by day end" },
      { label: "Oily / greasy", value: "feels oily or greasy by day end" },
      { label: "Normal", value: "stays comfortable and balanced" },
      { label: "Mix (oily T-zone, dry cheeks)", value: "oily T-zone but cheeks stay dry" },
    ],
  },
  {
    id: "biggestIssue",
    question: "What’s your biggest recurring issue? (be honest)",
    options: [
      { label: "Acne / pimples", value: "acne or frequent pimples" },
      { label: "Dark spots / pigmentation", value: "dark spots or pigmentation" },
      { label: "Dullness", value: "skin looks dull" },
      { label: "Texture (bumps, uneven)", value: "uneven texture or bumps" },
      { label: "Sensitivity (redness, burning)", value: "sensitive with redness or burning" },
    ],
  },
  {
    id: "productReaction",
    question: "How does your skin react to new products?",
    options: [
      { label: "No reaction (chill skin)", value: "handles new products fine" },
      { label: "Slight breakouts sometimes", value: "sometimes slight breakouts" },
      { label: "Frequent breakouts", value: "often breaks out" },
      { label: "Irritation / redness / burning", value: "irritation, redness or burning" },
    ],
  },
];

// ─── Result type ─────────────────────────────────────────────────
type PredictionResult = GeminiAnalysis;
interface CustomQA {
  id: number;
  question: string;
  answer: string;
}

// ─── Component ───────────────────────────────────────────────────
const SkinAnalysis = () => {
  const [stepIndex, setStepIndex]       = useState(0);
  const [answers,   setAnswers]         = useState<Record<string, string[]>>({});
  const [customQAs, setCustomQAs]       = useState<CustomQA[]>([]);
  const [newQuestion, setNewQuestion]   = useState("");
  const [newAnswer, setNewAnswer]       = useState("");
  const [loading,   setLoading]         = useState(false);
  const [result,    setResult]          = useState<PredictionResult | null>(null);
  const [error,     setError]           = useState("");
  const [testLoading, setTestLoading]   = useState(false);
  const [testMessage, setTestMessage]   = useState<string | null>(null);
  const navigate = useNavigate();

  const baseSteps   = QUESTIONS.length;
  const totalSteps  = baseSteps + 1; // last step = custom Q&A stage
  const isCustomStep = stepIndex === baseSteps;
  const currentQ    = isCustomStep ? null : QUESTIONS[stepIndex];
  const progress    = Math.round((stepIndex / totalSteps) * 100);
  const selectedAns = currentQ ? (answers[currentQ.id] ?? []) : [];
  const MAX_QUESTIONS = 15;
  const maxCustom = Math.max(0, MAX_QUESTIONS - QUESTIONS.length);
  const canAddCustom = customQAs.length < maxCustom && newQuestion.trim() && newAnswer.trim();

  const toggleAnswer = (value: string) => {
    if (!currentQ) return;
    setAnswers(prev => {
      const existing = prev[currentQ.id] ?? [];
      const next = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];
      return { ...prev, [currentQ.id]: next };
    });
  };

  const goNext = async () => {
    if (!isCustomStep && !selectedAns.length) return;

    if (stepIndex < totalSteps) {
      setStepIndex(i => i + 1);
    }

    if (stepIndex === totalSteps - 1) {
      await submitAnswers();
    }
  };

  const goBack = () => setStepIndex(i => Math.max(0, i - 1));

  const reset = () => {
    setStepIndex(0);
    setAnswers({});
    setResult(null);
    setError("");
    setCustomQAs([]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const submitAnswers = async () => {
    setLoading(true);
    setError("");
    try {
      const payload: Record<string, string[]> = {};
      QUESTIONS.forEach(q => {
        payload[q.question] = answers[q.id] ?? [];
      });

      customQAs.forEach((qa, idx) => {
        payload[`Custom Q${idx + 1}: ${qa.question}`] = [qa.answer];
      });

      const raw = await generateGeminiAnalysis(payload);
      setResult(raw);
    } catch (err) {
      setError("We could not generate your analysis. Check your API key and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runTestPing = async () => {
    setTestLoading(true);
    setTestMessage(null);
    try {
      const sample = await generateGeminiAnalysis({
        "How does your skin feel by the END of the day?": ["feels oily or greasy by day end"],
        "What’s your biggest recurring issue?": ["acne or frequent pimples"],
        "How does your skin react to new products?": ["handles new products fine"],
      });
      setTestMessage(`OK: ${sample.skinType} / ${sample.concern}`);
    } catch (e: any) {
      setTestMessage(`Error: ${e?.message ?? "Gemini unreachable"}`);
    } finally {
      setTestLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!result) return;
    const user = getCurrentUser();
    const userId = user?.id ?? 1;

    try {
      await api.post("/skin-profiles", {
        skinType: result.skinType,
        concern:  result.concern,
        userId,
      });
      navigate("/profile");
    } catch (err) {
      saveLocalProfile({ skinType: result.skinType, concern: result.concern, userId });
      console.error(err);
      navigate("/profile");
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────
  const skinTypeColor: Record<string, string> = {
    Dry:         "bg-blue-50   text-blue-700   border-blue-200",
    Oily:        "bg-green-50  text-green-700  border-green-200",
    Combination: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Normal:      "bg-rose-50   text-rose-700   border-rose-200",
    Sensitive:   "bg-purple-50 text-purple-700 border-purple-200",
  };

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">

            {/* ── Header ── */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-rose-light/60 border border-border/40 px-4 py-2 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="font-body text-[10px] uppercase tracking-[0.25em] text-primary font-medium">Gemini Analysis</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-foreground mb-4">
                Skin Intelligence
              </h1>
              <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
                Answer 7 quick prompts, select all that apply, and Gemini will predict your skin type, priority concern, and a simple routine.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 border border-border/50 bg-card px-4 py-3 text-left">
                <div>
                  <p className="font-body text-[11px] uppercase tracking-widest text-muted-foreground">Check Gemini</p>
                  <p className="font-body text-xs text-muted-foreground">Send a tiny sample to verify your API key.</p>
                </div>
                <button
                  onClick={runTestPing}
                  disabled={testLoading}
                  className="border border-primary text-primary px-3 py-2 font-body text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-rose-light/30 transition-colors"
                >
                  {testLoading ? "Testing..." : "Test"}
                </button>
              </div>
              {testMessage && (
                <p className="mt-3 font-body text-xs text-muted-foreground">{testMessage}</p>
              )}
            </div>

            {/* ── Loading ── */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
                <div className="w-20 h-20 bg-rose-light flex items-center justify-center border border-border/40">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="font-display text-2xl text-foreground">Analysing your skin...</p>
                <p className="font-body text-xs text-muted-foreground">Gemini is reviewing your selections</p>
              </div>
            )}

            {/* ── Error ── */}
            {error && !loading && (
              <div className="border border-red-200 bg-red-50 p-8 text-center animate-fade-in">
                <p className="font-body text-sm text-red-600 mb-6">{error}</p>
                <button onClick={reset} className="bg-primary text-primary-foreground px-8 py-3 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all">
                  Try Again
                </button>
              </div>
            )}

            {/* ── Result ── */}
            {result && !loading && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <p className="font-body text-sm text-accent font-medium">Analysis Complete</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`border p-6 text-center ${skinTypeColor[result.skinType] ?? "bg-rose-50 border-rose-200 text-rose-700"}`}>
                    <p className="font-body text-[9px] uppercase tracking-widest mb-2 opacity-70">Skin Type</p>
                    <p className="font-display text-3xl">{result.skinType}</p>
                  </div>
                  <div className="bg-sage-light/60 border border-green-200 text-green-700 p-6 text-center">
                    <p className="font-body text-[9px] uppercase tracking-widest mb-2 opacity-70">Primary Concern</p>
                    <p className="font-display text-3xl">{result.concern}</p>
                  </div>
                </div>

                <div className="bg-card border border-border/50 p-8">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3">AI Diagnosis</p>
                  <p className="font-body text-sm text-foreground leading-relaxed">{result.explanation}</p>
                </div>

                <div className="bg-rose-light/30 border border-border/50 p-8">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Your Personalised Routine</p>
                  <ul className="font-body text-sm text-foreground leading-relaxed space-y-2 list-disc list-inside">
                    {result.routine
                      .split(/\n+/)
                      .map(line => line.trim())
                      .filter(Boolean)
                      .map(line => (
                        <li key={line}>{line}</li>
                      ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={saveProfile}
                    className="flex-1 bg-primary text-primary-foreground py-4 font-body text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
                  >
                    Save to My Profile
                  </button>
                  <Link
                    to="/products"
                    className="flex-1 border border-primary/40 text-primary py-4 font-body text-[11px] uppercase tracking-[0.2em] hover:bg-rose-light transition-all text-center"
                  >
                    Shop Recommendations →
                  </Link>
                </div>

                <button onClick={reset} className="w-full flex items-center justify-center gap-2 font-body text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mt-2">
                  <RefreshCw className="h-3.5 w-3.5" /> Retake Analysis
                </button>
              </div>
            )}

            {/* ── Questionnaire ── */}
            {!loading && !result && !error && (
              <div className="animate-fade-in">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                    {isCustomStep ? "Add follow-up details" : `Question ${stepIndex + 1} of ${totalSteps}`}
                  </p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{progress}%</p>
                </div>
                <div className="h-0.5 bg-border/50 mb-10 overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>

                {!isCustomStep && currentQ && (
                  <>
                    <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
                      {currentQ.question}
                    </h2>
                    <p className="font-body text-xs text-muted-foreground mb-6">Select all that apply. You can pick multiple options.</p>

                    <div className="space-y-3 mb-10">
                      {currentQ.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => toggleAnswer(opt.value)}
                          className={`w-full flex items-center justify-between border px-6 py-4 text-left transition-all group ${
                            selectedAns.includes(opt.value)
                              ? "bg-rose-light border-primary"
                              : "border-border/60 hover:border-primary/40 hover:bg-rose-light/20"
                          }`}
                        >
                          <span className="font-body text-sm text-foreground">{opt.label}</span>
                          {selectedAns.includes(opt.value) && (
                            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {isCustomStep && (
                  <div className="border border-border/60 bg-card p-5 mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Add your own question</p>
                        <p className="font-body text-[11px] text-muted-foreground">Help Gemini with extra context (up to {maxCustom} custom questions).</p>
                      </div>
                      <span className="font-body text-[11px] text-muted-foreground">{customQAs.length}/{maxCustom}</span>
                    </div>
                    <div className="space-y-3">
                      <input
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g., How does your skin react to sunscreen?"
                        className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary transition-colors"
                      />
                      <textarea
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Your answer"
                        className="w-full border border-border bg-transparent outline-none p-3 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary transition-colors min-h-[90px]"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={!canAddCustom}
                          onClick={() => {
                            if (!canAddCustom) return;
                            setCustomQAs(prev => ([...prev, { id: Date.now(), question: newQuestion.trim(), answer: newAnswer.trim() }]));
                            setNewQuestion("");
                            setNewAnswer("");
                          }}
                          className="border border-primary text-primary px-4 py-2 font-body text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-rose-light/40 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {customQAs.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {customQAs.map((qa) => (
                          <div key={qa.id} className="flex items-start justify-between gap-3 border border-border/60 px-3 py-2">
                            <div>
                              <p className="font-body text-sm text-foreground">{qa.question}</p>
                              <p className="font-body text-xs text-muted-foreground">{qa.answer}</p>
                            </div>
                            <button
                              type="button"
                              className="font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                              onClick={() => setCustomQAs(prev => prev.filter(item => item.id !== qa.id))}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={goBack}
                    disabled={stepIndex === 0}
                    className="flex items-center gap-2 font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={isCustomStep ? submitAnswers : goNext}
                    disabled={!isCustomStep && !selectedAns.length}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-3 font-body text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-all"
                  >
                    {isCustomStep ? "Analyse My Skin" : "Next"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkinAnalysis;
