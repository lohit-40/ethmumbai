import React, { useState, useEffect } from 'react';
import { Share2, Ticket, MapPin, ChevronRight, Check, X as XIcon, Wallet, Loader2, Trophy, Users, Home } from 'lucide-react';
import { ethers } from 'ethers';
import HeroSection from './components/HeroSection';
import FloatingTokens from './components/FloatingTokens';

// Questions customized for the vibe
const questions = [
  {
    text: "The conductor asks for your ticket. You show him:",
    options: [
      { text: "A paper ticket", points: 0 },
      { text: "My MetaMask QR Code", points: 10 },
      { text: "A 100 Rupee note", points: 2 }
    ]
  },
  {
    text: "Which layer moves faster through Mumbai traffic?",
    options: [
      { text: "Layer 1 (The Bus)", points: 5 },
      { text: "Layer 2 (The Local Train)", points: 10 },
      { text: "Auto Rickshaws", points: 0 }
    ]
  },
  {
    text: "Finish the slogan: 'Code is ...'",
    options: [
      { text: "Money", points: 0 },
      { text: "Law", points: 10 },
      { text: "Complicated", points: 0 }
    ]
  },
  {
    text: "Where is the ETHMumbai afterparty?",
    options: [
      { text: "Gateway of India", points: 5 },
      { text: "In the Metaverse", points: 0 },
      { text: "Wherever Vitalik is", points: 10 }
    ]
  }
];

const getRank = (score) => {
  if (score >= 35) return { title: "BEST DRIVER", subtitle: "GIGA MAXI", color: "bg-brand-yellow text-brand-black" };
  if (score >= 20) return { title: "DAILY COMMUTER", subtitle: "VERIFIED DEGEN", color: "bg-brand-blue text-white" };
  return { title: "TICKETLESS TRAVELER", subtitle: "ETH TOURIST", color: "bg-gray-400 text-white" };
};

// Backend API Integration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchXScore = async (handle) => {
  console.log(`Fetching score for @${handle}...`);
  try {
    const response = await fetch(`${API_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle }),
    });
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    return {
      verified: data.verified,
      interactionScore: data.interactionScore,
      memberLevel: data.memberLevel
    };
  } catch (error) {
    console.error("Failed to fetch score:", error);
    throw error;
  }
};

const fetchLeaderboard = async () => {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard`);
    return await res.json();
  } catch (e) {
    console.error("Leaderboard fetch failed", e);
    return [];
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, checker, leaderboard
  const [step, setStep] = useState('landing'); // landing, quiz, result (for checker)
  const [currentQ, setCurrentQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [xScore, setXScore] = useState(0);
  const [handle, setHandle] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [xInput, setXInput] = useState('');
  const [loadingX, setLoadingX] = useState(false);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (currentView === 'leaderboard') {
      fetchLeaderboard().then(setLeaderboard);
    }
  }, [currentView]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed!");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleXSubmit = async (e, skip = false) => {
    if (e) e.preventDefault();
    if (!xInput) return;

    setLoadingX(true);
    try {
      const cleanHandle = xInput.replace('@', '').trim();
      const result = await fetchXScore(cleanHandle);

      setHandle(cleanHandle);
      setXScore(result.interactionScore);
      setStep(skip ? 'result' : 'quiz');
    } catch (err) {
      console.error(err);
      setError("Failed to verify X handle");
    } finally {
      setLoadingX(false);
    }
  };

  const handleAnswer = (points) => {
    setQuizScore(quizScore + points);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep('result');
    }
  };

  const totalScore = quizScore + xScore;
  const rank = getRank(totalScore);

  const tweetText = `🚎 I just checked my ETHMumbai status!\n\n🎟️ Rank: ${rank.subtitle}\n💯 Score: ${totalScore}/40\n\nAre you on the bus? Check your level at ethmumbai.in\n\n@ethmumbai #ETHMumbai`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <div className="min-h-screen font-body text-brand-black selection:bg-brand-yellow relative bg-gray-50/50">

      {/* Floating Background Elements */}
      <FloatingTokens />

      {/* Navbar */}
      <nav className="fixed w-full bg-brand-black/90 backdrop-blur-sm text-brand-yellow border-b border-white/10 p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className="font-headline font-bold text-xl tracking-wider flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-8 h-8 border-2 border-brand-yellow rounded-full flex items-center justify-center">
              <span className="text-lg">♦</span>
            </div>
            ETHMUMBAI
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'home' ? 'bg-brand-yellow text-brand-black' : 'text-white/70 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('checker')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'checker' ? 'bg-brand-yellow text-brand-black' : 'text-white/70 hover:text-white'}`}
            >
              Maxi Checker
            </button>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'leaderboard' ? 'bg-brand-yellow text-brand-black' : 'text-white/70 hover:text-white'}`}
            >
              Leaderboard
            </button>
          </div>

          <div className="hidden md:block font-local text-lg text-white opacity-50">ईथ मुंबई</div>
        </div>
      </nav>

      {/* Persistent Hero Background */}
      <HeroSection />

      {/* Main Content Area - Overlaying Hero */}
      <div className="relative z-40 pt-32 pb-12 px-4 min-h-screen flex flex-col items-center justify-start pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">

          {/* --- HOME VIEW --- */}
          {currentView === 'home' && (
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5">
              <div className="bg-brand-black p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
                <div className="absolute top-1 left-0 w-full h-1 bg-brand-green"></div>

                <h1 className="font-headline text-4xl font-black text-white uppercase mb-2">
                  Welcome to <br /><span className="text-brand-yellow">ETHMumbai</span>
                </h1>
                <p className="text-white/60 text-sm font-mono tracking-widest uppercase">The Official Community Hub</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4 text-center">
                  <p className="text-lg font-bold text-brand-black leading-tight">
                    Are you a true Mumbai Ethereum Maxi?
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This platform is designed to test your knowledge, verify your on-chain activity, and rank you among the elite of the ETHMumbai community.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                    <Trophy className="w-6 h-6 text-brand-red mx-auto mb-2" />
                    <h3 className="font-bold text-sm">Compete</h3>
                    <p className="text-xs text-gray-500">Climb the leaderboard</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                    <Check className="w-6 h-6 text-brand-green mx-auto mb-2" />
                    <h3 className="font-bold text-sm">Verify</h3>
                    <p className="text-xs text-gray-500">Check your score</p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('checker')}
                  className="w-full bg-brand-red text-white font-headline font-bold text-lg py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-brand-red/30"
                >
                  Start the Challenge →
                </button>
              </div>
            </div>
          )}

          {/* --- CHECKER VIEW --- */}
          {currentView === 'checker' && (
            <>
              {step === 'landing' && (
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(226,35,26,0.5)] animate-in zoom-in-95 duration-300">
                  <div className="bg-brand-red p-6 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-brand-yellow"></div>
                    <div className="absolute top-2 left-0 w-full h-2 bg-brand-green"></div>

                    <div className="mt-2 mb-1 inline-block bg-brand-black/20 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                      Official Challenge
                    </div>
                    <h1 className="font-headline text-3xl font-black mb-1 uppercase leading-none">
                      Maxi Checker
                    </h1>
                  </div>

                  <div className="p-6 space-y-4">
                    {!walletAddress ? (
                      <div className="space-y-4">
                        <p className="text-center text-gray-600 font-medium text-sm">
                          First, connect your wallet to board.
                        </p>
                        <button
                          onClick={connectWallet}
                          disabled={isConnecting}
                          className="w-full group relative overflow-hidden bg-brand-black text-white font-headline font-bold text-md py-3 rounded-xl hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-3"
                        >
                          {isConnecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wallet className="w-4 h-4 text-brand-yellow" />
                          )}
                          {isConnecting ? "Connecting..." : "Connect User"}
                        </button>
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                      </div>
                    ) : (
                      <form onSubmit={handleXSubmit} className="space-y-4 animate-in fade-in duration-300">
                        <div className="text-center space-y-1">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mb-1">
                            <Check className="w-4 h-4" />
                          </div>
                          <p className="text-gray-600 font-medium text-sm">Wallet Connected!</p>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 font-bold">@</span>
                          </div>
                          <input
                            type="text"
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-brand-black focus:ring-0 outline-none font-bold text-md transition-colors placeholder:font-normal"
                            placeholder="vitalikbuterin"
                            value={xInput}
                            onChange={(e) => setXInput(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loadingX || !xInput}
                          className="w-full group relative overflow-hidden bg-black text-white font-headline font-bold text-md py-3 rounded-xl hover:scale-[1.02] transition-transform duration-200 disabled:opacity-70 disabled:hover:scale-100 mb-2"
                        >
                          {loadingX ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Checking...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <XIcon className="w-4 h-4" />
                              <span>Verify</span>
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleXSubmit(null, true)}
                          disabled={loadingX || !xInput}
                          className="w-full text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Skip Quiz & Generate Pass →
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {step === 'quiz' && (
                <div className="space-y-6 w-full animate-in slide-in-from-right-10 duration-300">
                  <div className="flex justify-between items-end px-2">
                    <span className="text-brand-yellow font-bold text-xl font-headline drop-shadow-md">Stop {currentQ + 1}</span>
                    <span className="text-white font-bold text-sm drop-shadow-md">{questions.length - currentQ - 1} stops remaining</span>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-xl min-h-[300px] flex flex-col justify-between border border-gray-100">
                    <h2 className="font-headline text-2xl font-bold leading-tight mb-8">
                      {questions[currentQ].text}
                    </h2>

                    <div className="space-y-3">
                      {questions[currentQ].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(opt.points)}
                          className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-brand-red hover:bg-red-50 transition-all font-semibold flex justify-between items-center group"
                        >
                          {opt.text}
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-red" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 'result' && (
                <div className="space-y-6 w-full animate-in zoom-in duration-300">
                  <div className="bg-[#f0f0f0] rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="bg-brand-red text-white p-6 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold opacity-80 tracking-widest">ETHMUMBAI AUTHORITY</p>
                          <h2 className="font-headline text-3xl font-black mt-1">PASS</h2>
                        </div>
                        <div className="text-right">
                          <p className="font-local text-xl">बृहन्मुंबई</p>
                        </div>
                      </div>
                      <div className="absolute -bottom-3 left-0 w-full flex justify-between px-4">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-full bg-brand-black"></div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 pt-10 bg-white">
                      <div className="flex justify-between items-center mb-6 border-b-2 border-dashed border-gray-200 pb-6">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Passenger</p>
                          <div className="flex items-center gap-3">
                            {xScore > 0 ? (
                              <img
                                src={`https://unavatar.io/twitter/${handle}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"; }}
                                alt={handle}
                                className="w-12 h-12 rounded-full border-2 border-brand-black"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400">
                                <Users className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <p className="text-xl font-bold font-headline">@{handle}</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-1">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                          <p className="text-xl font-bold">29 DEC</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded text-xs font-bold ${rank.color}`}>
                            {rank.title}
                          </div>
                          {xScore > 0 && (
                            <div className="px-2 py-1 rounded text-[10px] bg-blue-100 text-blue-600 font-bold flex items-center gap-1">
                              <XIcon className="w-3 h-3" /> +{xScore}
                            </div>
                          )}
                        </div>
                        <h1 className="text-4xl font-black font-headline text-brand-black uppercase leading-none">
                          {rank.subtitle}
                        </h1>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 text-brand-red" />
                        <span>Valid at ethmumbai.in</span>
                      </div>
                    </div>

                    <div className="bg-brand-black p-4 flex justify-between items-center text-white/40">
                      <div className="font-mono text-xs tracking-[0.5em]">*2025*ETH*MUM*</div>
                    </div>
                  </div>

                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#1DA1F2] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-[#1a91da] transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Ticket on X
                  </a>

                  <button
                    onClick={() => {
                      setStep('landing');
                      setQuizScore(0);
                      setXScore(0);
                      setCurrentQ(0);
                      setCurrentView('leaderboard'); // Go to leaderboard after checking
                      fetchLeaderboard().then(setLeaderboard);
                    }}
                    className="w-full bg-white text-brand-black font-bold py-3 rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    View Leaderboard
                  </button>
                </div>
              )}
            </>
          )}

          {/* --- LEADERBOARD VIEW --- */}
          {currentView === 'leaderboard' && (
            <div className="w-full bg-white rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(226,35,26,0.1)] animate-in fade-in slide-in-from-bottom-5">
              <div className="bg-brand-black p-6 text-left border-b border-white/10 flex justify-between items-center sticky top-0 z-20">
                <div>
                  <h2 className="font-headline text-2xl font-bold uppercase text-brand-yellow">Leaderboard</h2>
                  <p className="text-white/60 text-xs">Top Passengers</p>
                </div>
                <Trophy className="w-6 h-6 text-brand-yellow opacity-50" />
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">Rank</th>
                      <th className="px-6 py-3 font-medium">Passenger</th>
                      <th className="px-6 py-3 font-medium text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-400 text-sm">
                          No passengers yet. Be the first!
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 font-bold text-gray-400 text-sm">#{idx + 1}</td>
                          <td className="px-6 py-3 flex items-center gap-3">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.handle} className="w-8 h-8 rounded-full border border-gray-200" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                <Users className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-brand-black text-sm">@{user.handle}</div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wide">{user.level}</div>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right font-bold text-brand-red">{user.score}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <button
                  onClick={() => setCurrentView('checker')}
                  className="text-xs font-bold text-brand-red hover:underline"
                >
                  Join the race →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}