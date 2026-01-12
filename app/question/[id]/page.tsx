"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { questions as fallbackQuestions } from "@/app/data/questions";
import AnimatedBar from "@/app/data/components/AnimatedBar";

type VoteOptions = "yes" | "no" | "undecided";

interface Votes {
  yes: number;
  no: number;
  undecided: number;
}

interface Question {
  id: string;
  title: string;
  context: string;
  votes: Votes;
  argumentsFor: string[];
  argumentsAgainst: string[];
  startsAt: string; // ISO dato
  endsAt: string; // ISO dato
}

export default function QuestionPage() {
  const params = useParams();
  const questionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [authUser, setAuthUser] = useState<{
    id: string;
    email: string;
    emailVerifiedAt?: string | null;
  } | null>(null);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");

  useEffect(() => {
    if (!questionId) {
      setLoading(false);
      return;
    }

    const loadQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${questionId}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setQuestion(data);
      } catch {
        const fallback = fallbackQuestions.find((q) => q.id === questionId);
        setQuestion(fallback ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [questionId]);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        setAuthUser(data.user ?? null);
      } catch {
        setAuthUser(null);
      }
    };

    loadMe();
  }, []);

  // State
  const [selectedVote, setSelectedVote] = useState<VoteOptions | null>(null);
  const [votes, setVotes] = useState<Votes>({ yes: 0, no: 0, undecided: 0 });
  const [newArgFor, setNewArgFor] = useState("");
  const [newArgAgainst, setNewArgAgainst] = useState("");
  const [argumentsFor, setArgumentsFor] = useState<string[]>([]);
  const [argumentsAgainst, setArgumentsAgainst] = useState<string[]>([]);

  useEffect(() => {
    if (!question) return;
    setVotes(question.votes);
    setArgumentsFor(question.argumentsFor);
    setArgumentsAgainst(question.argumentsAgainst);
  }, [question]);

  if (loading) return <p>Indlæser...</p>;
  if (!question) return <p>Spørgsmål ikke fundet</p>;

  // Tidsvariabler
  const now = new Date();
  const startsAt = new Date(question.startsAt);
  const endsAt = new Date(question.endsAt);
  const isOpen = now >= startsAt && now <= endsAt;

  const handleLogin = async (mode: "login" | "register") => {
    setAuthError("");
    setAuthMessage("");

    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setAuthError(data.error ?? "Login fejlede");
        return;
      }

      const data = await res.json();
      setAuthUser(data);
      setAuthMessage("Du er nu logget ind.");
    } catch {
      setAuthError("Login fejlede");
    }
  };

  const handleMagicLink = async () => {
    setAuthError("");
    setAuthMessage("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: magicEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error ?? "Kunne ikke sende magic-link");
        return;
      }

      if (data.link) {
        setAuthMessage(`Magic-link (dev): ${data.link}`);
      } else {
        setAuthMessage("Magic-link sendt. Tjek din email.");
      }
    } catch {
      setAuthError("Kunne ikke sende magic-link");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthUser(null);
    setAuthMessage("Du er logget ud.");
  };

  const handleVerifyEmail = async () => {
    setAuthError("");
    setAuthMessage("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authUser?.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error ?? "Kunne ikke sende bekræftelse");
        return;
      }

      if (data.link) {
        setAuthMessage(`Bekræftelseslink (dev): ${data.link}`);
      } else {
        setAuthMessage("Bekræftelseslink sendt. Tjek din email.");
      }
    } catch {
      setAuthError("Kunne ikke sende bekræftelse");
    }
  };

  const handleVote = async () => {
    if (!selectedVote) return;

    if (!authUser) {
      setAuthError("Du skal være logget ind for at stemme.");
      return;
    }

    const res = await fetch(`/api/questions/${questionId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice: selectedVote }),
    });

    if (res.status === 403) {
      setAuthError("Bekræft din email for at stemme.");
      return;
    }

    if (res.status === 409) {
      setHasVoted(true);
      setSelectedVote(null);
      return;
    }

    if (!res.ok) {
      setAuthError("Din stemme kunne ikke gemmes.");
      return;
    }

    setVotes((prev) => ({
      ...prev,
      [selectedVote]: prev[selectedVote] + 1,
    }));
    setHasVoted(true);
    setSelectedVote(null);
  };

  const totalVotes = votes.yes + votes.no + votes.undecided;
  const percent = (count: number) =>
    totalVotes === 0 ? 0 : ((count / totalVotes) * 100).toFixed(0);

  const handleAddArgument = async (type: "for" | "against") => {
    if (!authUser) {
      setAuthError("Du skal være logget ind for at tilføje argumenter.");
      return;
    }

    const content = type === "for" ? newArgFor : newArgAgainst;
    if (!content.trim()) return;

    const res = await fetch(`/api/questions/${questionId}/arguments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }),
    });

    if (res.status === 403) {
      setAuthError("Bekræft din email for at tilføje argumenter.");
      return;
    }

    if (!res.ok) {
      setAuthError("Argumentet kunne ikke gemmes.");
      return;
    }

    if (type === "for") {
      setArgumentsFor([...argumentsFor, content.trim()]);
      setNewArgFor("");
    } else {
      setArgumentsAgainst([...argumentsAgainst, content.trim()]);
      setNewArgAgainst("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold mb-2">Login</h2>
        {authUser ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700">
              <p>Logget ind som {authUser.email}</p>
              <p className="text-xs text-gray-500">
                {authUser.emailVerifiedAt ? "Email bekræftet" : "Email ikke bekræftet"}
              </p>
            </div>
            <button
              className="px-4 py-2 text-sm rounded bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              Log ud
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-3">
              <input
                className="border rounded px-3 py-2 text-sm"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                className="border rounded px-3 py-2 text-sm"
                type="password"
                placeholder="Adgangskode"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 text-sm rounded bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => handleLogin("login")}
                >
                  Log ind
                </button>
                <button
                  className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                  onClick={() => handleLogin("register")}
                >
                  Opret
                </button>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <input
                className="border rounded px-3 py-2 text-sm md:col-span-2"
                placeholder="Email til magic-link"
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
              />
              <button
                className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                onClick={handleMagicLink}
              >
                Send magic-link
              </button>
            </div>
          </div>
        )}
        {authUser && !authUser.emailVerifiedAt && (
          <button
            className="mt-3 px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
            onClick={handleVerifyEmail}
          >
            Send bekræftelses-email
          </button>
        )}
        {authError && <p className="text-sm text-red-600 mt-2">{authError}</p>}
        {authMessage && <p className="text-sm text-green-700 mt-2">{authMessage}</p>}
      </div>

      <button className="mb-4 text-blue-600 hover:underline" onClick={() => window.history.back()}>
        Tilbage
      </button>

      <h1 className="text-2xl font-bold mb-2">{question.title}</h1>

      <div className="mb-4 text-sm">
        {isOpen ? (
          <span className="text-green-700">
            Afstemningen er åben - lukker {endsAt.toLocaleDateString("da-DK")}
          </span>
        ) : (
          <span className="text-red-700 font-medium">Afstemningen er lukket</span>
        )}
      </div>

      <p className="text-gray-600 mb-6">{question.context}</p>

      {isOpen ? (
        <div className="mb-8">
          <h2 className="font-semibold mb-2">Stem her:</h2>

          <div className="flex gap-4 mb-2">
            {(["yes", "no", "undecided"] as VoteOptions[]).map((option) => (
              <button
                key={option}
                onClick={() => setSelectedVote(option)}
                className={`px-4 py-2 rounded ${
                  selectedVote === option
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {option === "yes" ? "Ja" : option === "no" ? "Nej" : "Uafklaret"}
              </button>
            ))}
          </div>

          <button
            onClick={handleVote}
            disabled={hasVoted || !selectedVote || !authUser || !authUser.emailVerifiedAt}
            className={`px-4 py-2 rounded ${
              hasVoted || !selectedVote || !authUser || !authUser.emailVerifiedAt
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {hasVoted ? "Du har allerede stemt" : "Send stemme"}
          </button>
          {!authUser && (
            <p className="text-sm text-gray-600 mt-2">Log ind for at kunne stemme.</p>
          )}
          {authUser && !authUser.emailVerifiedAt && (
            <p className="text-sm text-gray-600 mt-2">
              Bekræft din email for at kunne stemme.
            </p>
          )}
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-gray-700 font-medium">Afstemningen er lukket</p>
          <p className="text-sm text-gray-600">Resultaterne vises herunder</p>
        </div>
      )}
      {selectedVote && (
        <p className="text-sm text-gray-600 mt-2">
          Du har valgt:{" "}
          <span className="font-medium">
            {selectedVote === "yes" ? "Ja" : selectedVote === "no" ? "Nej" : "Uafklaret"}
          </span>
        </p>
      )}

      <div className="mt-4">
        {!isOpen || hasVoted ? (
          <div className="space-y-2">
            <div className="space-y-2">
              <p className="text-sm">Ja: {percent(votes.yes)}%</p>
              <AnimatedBar percentage={Number(percent(votes.yes))} color="#2563EB" />

              <p className="text-sm">Nej: {percent(votes.no)}%</p>
              <AnimatedBar percentage={Number(percent(votes.no))} color="#DC2626" />

              <p className="text-sm">Uafklaret: {percent(votes.undecided)}%</p>
              <AnimatedBar percentage={Number(percent(votes.undecided))} color="#FBBF24" />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">Resultater vises efter du har stemt</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="font-semibold mb-2">Argumenter FOR</h3>
          <ul className="list-disc list-inside mb-2">
            {argumentsFor.map((arg, idx) => (
              <li key={idx}>{arg}</li>
            ))}
          </ul>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Skriv argument for"
            value={newArgFor}
            onChange={(e) => setNewArgFor(e.target.value)}
            rows={3}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleAddArgument("for")}
          >
            Tilføj argument
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Argumenter IMOD</h3>
          <ul className="list-disc list-inside mb-2">
            {argumentsAgainst.map((arg, idx) => (
              <li key={idx}>{arg}</li>
            ))}
          </ul>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Skriv argument imod"
            value={newArgAgainst}
            onChange={(e) => setNewArgAgainst(e.target.value)}
            rows={3}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleAddArgument("against")}
          >
            Tilføj argument
          </button>
        </div>
      </div>
    </main>
  );
}
