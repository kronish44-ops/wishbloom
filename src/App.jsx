
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Gift, Heart, Mail, LockKeyhole, Music2, VolumeX,
  RotateCcw, Sparkles, Search, Copy, Share2
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Turnstile } from "@marsidev/react-turnstile";
import { loveMessages, messageCategories } from "./messages";
import "./App.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const defaultClues = [
  "Someone made this little adventure just for you. 💝",
  "You make ordinary moments feel extraordinary. 💕",
  "There are so many reasons you deserve to smile. 💌",
  "The biggest surprise is still waiting for you. ❤️",
];

const stages = [
  "The Mystery Gift",
  "Catch the Hearts",
  "The Secret Letter",
  "Unlock the Heart",
];

const occasions = {
  birthday: "Birthday",
  romantic: "Romantic / Love",
  love: "Love",
  anniversary: "Anniversary",
  friendship: "Friendship",
  congratulations: "Congratulations",
  other: "Special Surprise",
};

const melodies = {
  birthday: [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46],
  romantic: [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66],
  love: [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66],
  anniversary: [293.66, 369.99, 440, 554.37, 493.88, 440, 369.99, 329.63],
  friendship: [392, 493.88, 587.33, 493.88, 440, 523.25, 659.25, 523.25],
  congratulations: [392, 493.88, 587.33, 783.99, 698.46, 587.33, 659.25, 783.99],
  other: [349.23, 440, 523.25, 659.25, 587.33, 523.25, 440, 392],
};

const heartPositions = [
  { left: "12%", top: "18%" },
  { left: "69%", top: "12%" },
  { left: "39%", top: "47%" },
  { left: "74%", top: "72%" },
  { left: "13%", top: "75%" },
];

async function callFunction(name, body, isForm = false) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase configuration is missing.");
  }

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/${name}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        ...(isForm ? {} : { "Content-Type": "application/json" }),
      },
      body: isForm ? body : JSON.stringify(body),
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || `Request failed (${response.status})`);
  }

  return result;
}

export default function App() {
  const surpriseId = new URLSearchParams(window.location.search).get("s");
  const recipientMode = Boolean(surpriseId);

  const [loading, setLoading] = useState(recipientMode);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("Someone Special");
  const [occasion, setOccasion] = useState("birthday");
  const [message, setMessage] = useState(
    "Wishing you a day full of love, laughter, and beautiful memories!"
  );
  const [clues, setClues] = useState(defaultClues);
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [step, setStep] = useState(0);
  const [giftTaps, setGiftTaps] = useState(0);
  const [caught, setCaught] = useState([]);
  const [letterOpen, setLetterOpen] = useState(false);
  const [puzzle, setPuzzle] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const audioContextRef = useRef(null);
  const musicTimerRef = useRef(null);
  const musicNodesRef = useRef([]);
  const musicIndexRef = useRef(0);
  const photoUrlRef = useRef(null);

  function stopInstrumental() {
    if (musicTimerRef.current) {
      clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }

    musicNodesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch {}
      try {
        node.disconnect();
      } catch {}
    });

    musicNodesRef.current = [];
  }

  function playNote(frequency, duration = 0.8) {
    const context = audioContextRef.current;
    if (!context || context.state !== "running") return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);

    musicNodesRef.current.push(oscillator, gain);
  }

  async function startMusic() {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const context = audioContextRef.current;
      if (context.state === "suspended") await context.resume();

      if (musicTimerRef.current) return;

      setMusicEnabled(true);

      const pattern = melodies[occasion] || melodies.other;

      const tick = () => {
        const index = musicIndexRef.current % pattern.length;
        playNote(pattern[index]);

        if (index % 2 === 0) {
          playNote(pattern[index] / 2, 0.9);
        }

        musicIndexRef.current += 1;
      };

      tick();
      musicTimerRef.current = setInterval(tick, 650);
    } catch (error) {
      console.error("Could not start music:", error);
      setMusicEnabled(false);
    }
  }

  function toggleMusic() {
    if (musicTimerRef.current) {
      stopInstrumental();
      setMusicEnabled(false);
    } else {
      startMusic();
    }
  }

  useEffect(() => {
    stopInstrumental();
    musicIndexRef.current = 0;
    setMusicEnabled(false);
  }, [occasion]);

  useEffect(() => {
    return () => {
      stopInstrumental();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (photoUrlRef.current) {
        URL.revokeObjectURL(photoUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!recipientMode) return;

    let cancelled = false;

    async function loadSurprise() {
      try {
        const data = await callFunction("get-surprise", {
          id: surpriseId,
        });

        if (cancelled) return;

        setName(data.recipient_name);
        setOccasion(data.occasion);
        setMessage(data.message);
        setPhoto(data.photo_url || "");

        if (Array.isArray(data.clues) && data.clues.length === 4) {
          setClues(data.clues);
        }
      } catch (error) {
        if (!cancelled) setLoadError(error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSurprise();
    return () => {
      cancelled = true;
    };
  }, [recipientMode, surpriseId]);

  useEffect(() => {
    if (countdown === null) return;

    const timer = setTimeout(() => {
      if (countdown === 0) {
        setCountdown(null);
        setStep(4);
      } else {
        setCountdown(countdown - 1);
      }
    }, countdown === 0 ? 600 : 850);

    return () => clearTimeout(timer);
  }, [countdown]);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return loveMessages.filter((item) => {
      const categoryMatch =
        category === "all" || item.category === category;

      const searchMatch =
        !query ||
        item.text?.toLowerCase().includes(query) ||
        item.title?.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  function reset() {
    setStep(0);
    setGiftTaps(0);
    setCaught([]);
    setLetterOpen(false);
    setPuzzle([]);
    setCountdown(null);
  }

  function updateClue(index, value) {
    setClues((previous) =>
      previous.map((clue, i) => (i === index ? value : clue))
    );
    setShareLink("");
  }

  function uploadPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size === 0 ||
      file.size > 5 * 1024 * 1024
    ) {
      alert("Choose a JPEG, PNG or WebP photo under 5 MB.");
      event.target.value = "";
      return;
    }

    if (photoUrlRef.current) {
      URL.revokeObjectURL(photoUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    photoUrlRef.current = url;
    setPhoto(url);
    setPhotoFile(file);
    setShareLink("");
  }

  async function createSurprise() {
    setCreateError("");
    setShareLink("");
    setCopySuccess(false);

    if (!name.trim() || name.trim().length > 80) {
      setCreateError("Recipient name must be 1–80 characters.");
      return;
    }

    if (!message.trim() || message.trim().length > 2000) {
      setCreateError("Message must be 1–2000 characters.");
      return;
    }

    if (clues.some((clue) => !clue.trim() || clue.length > 400)) {
      setCreateError("Please complete all four clues (max 400 characters each).");
      return;
    }

    if (!captchaToken) {
      setCreateError("Please complete security verification.");
      return;
    }

    setCreating(true);

    try {
      const form = new FormData();
      form.append("recipient_name", name.trim());
      form.append("occasion", occasion);
      form.append("message", message.trim());
      form.append("music_track", "birthday");
      form.append("clues", JSON.stringify(clues));
      form.append("turnstile_token", captchaToken);

      if (photoFile) form.append("photo", photoFile);

      const result = await callFunction("create-surprise", form, true);

      setShareLink(
        `${window.location.origin}${window.location.pathname}?s=${encodeURIComponent(result.id)}`
      );
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setCreating(false);
      setCaptchaToken("");
      setCaptchaVersion((value) => value + 1);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
    } catch {
      setCreateError("Unable to copy automatically. Select and copy the link.");
    }
  }

  async function shareSurprise() {
    if (!shareLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "A surprise for you 💖",
          text: "Someone made something special just for you!",
          url: shareLink,
        });
      } catch {}
    } else {
      await copyLink();
    }
  }

  const title =
    occasion === "birthday"
      ? `Happy Birthday, ${name}! 🎂`
      : occasion === "anniversary"
      ? `Happy Anniversary, ${name}! 💍`
      : occasion === "congratulations"
      ? `Congratulations, ${name}! 🎉`
      : occasion === "friendship"
      ? `You're Amazing, ${name}! 💛`
      : occasion === "romantic" || occasion === "love"
      ? `For You, ${name}! ❤️`
      : `Surprise, ${name}! ✨`;

  const stageIcons = [Gift, Heart, Mail, LockKeyhole];
  const StageIcon = stageIcons[step];

  return (
    <main className="wish-page">
      <div className="floating-decorations" aria-hidden="true">
        {["💗", "🌸", "✨", "💕", "🦋", "⭐", "💖", "🌷"].map(
          (emoji, index) => (
            <span
              key={index}
              style={{
                left: `${(index * 31 + 7) % 95}%`,
                top: `${(index * 23 + 8) % 90}%`,
                animationDelay: `${index * -0.8}s`,
              }}
            >
              {emoji}
            </span>
          )
        )}
      </div>

      <header className="wish-header">
        <div className="wish-brand">✦ WishBloom</div>
        <button className="wish-music" onClick={toggleMusic}>
          {musicEnabled ? <Music2 size={18} /> : <VolumeX size={18} />}
          {musicEnabled ? "Music On" : "Music Off"}
        </button>
      </header>

      {loading ? (
        <section className="wish-card">
          <h1>Opening your surprise... 💝</h1>
          <p>Gathering a little magic for you.</p>
        </section>
      ) : loadError ? (
        <section className="wish-card">
          <h1>Couldn't open this surprise 💌</h1>
          <p>{loadError}</p>
          <a href="/" className="wish-primary">Visit WishBloom</a>
        </section>
      ) : (
        <div
          className="wish-layout"
          style={
            recipientMode
              ? { gridTemplateColumns: "minmax(0, 750px)", justifyContent: "center" }
              : {}
          }
        >
          <AnimatePresence mode="wait">
            {step < 4 ? (
              <motion.section
                key={step}
                className="wish-card"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="wish-eyebrow">
                  ✨ YOUR SECRET JOURNEY · {step + 1} OF 4
                </div>

                <motion.div
                  className="wish-icon"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <StageIcon size={62} strokeWidth={1.4} />
                </motion.div>

                <div className="wish-dots">
                  {[0, 1, 2, 3].map((index) => (
                    <span key={index} className={index <= step ? "active" : ""} />
                  ))}
                </div>

                <h1>{stages[step]}</h1>

                {step === 0 && (
                  <div className="wish-stage">
                    <p>Someone left a magical gift for you. Tap it three times!</p>
                    <motion.button
                      className="wish-big-emoji"
                      whileTap={{ scale: 0.85, rotate: 10 }}
                      onClick={() => {
                        startMusic();
                        setGiftTaps((value) => Math.min(value + 1, 3));
                      }}
                    >
                      {giftTaps === 3 ? "💝" : "🎁"}
                    </motion.button>
                    <div className="wish-counter">{giftTaps} / 3 taps</div>
                    {giftTaps === 3 && <div className="wish-clue">{clues[0]}</div>}
                    <button
                      className="wish-primary"
                      disabled={giftTaps < 3}
                      onClick={() => setStep(1)}
                    >
                      Continue Adventure <Sparkles size={18} />
                    </button>
                  </div>
                )}

                {step === 1 && (
                  <div className="wish-stage">
                    <p>Catch any three floating hearts to reveal your next clue!</p>
                    <div className="wish-heart-field">
                      {heartPositions.map((position, index) => (
                        <motion.button
                          key={index}
                          className="wish-floating-heart"
                          style={position}
                          animate={
                            caught.includes(index)
                              ? { scale: 0, opacity: 0 }
                              : { y: [0, -15, 0] }
                          }
                          transition={
                            caught.includes(index)
                              ? { duration: 0.2 }
                              : { duration: 2, repeat: Infinity, delay: index * 0.2 }
                          }
                          disabled={caught.includes(index)}
                          onClick={() =>
                            setCaught((old) =>
                              old.includes(index) ? old : [...old, index]
                            )
                          }
                        >
                          💗
                        </motion.button>
                      ))}
                    </div>
                    <div className="wish-counter">💕 {Math.min(caught.length, 3)} / 3 hearts</div>
                    {caught.length >= 3 && <div className="wish-clue">{clues[1]}</div>}
                    <button
                      className="wish-primary"
                      disabled={caught.length < 3}
                      onClick={() => setStep(2)}
                    >
                      Open Secret Letter <Mail size={18} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="wish-stage">
                    <p>A secret letter is waiting for you. Tap to open it!</p>
                    <motion.button
                      className="wish-big-emoji"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLetterOpen(true)}
                    >
                      {letterOpen ? "💌" : "✉️"}
                    </motion.button>
                    {letterOpen ? (
                      <motion.div
                        className="wish-letter"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div>Dear {name},</div>
                        <p>{clues[2]}</p>
                        <div>With love, 💖</div>
                      </motion.div>
                    ) : (
                      <div className="wish-counter">Tap the envelope 💌</div>
                    )}
                    <button
                      className="wish-primary"
                      disabled={!letterOpen}
                      onClick={() => setStep(3)}
                    >
                      Final Mystery <LockKeyhole size={18} />
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="wish-stage">
                    <p>Collect all three heart pieces to unlock your surprise!</p>
                    <div className="wish-lock">{puzzle.length === 3 ? "💖" : "🔒"}</div>
                    <div className="wish-puzzle">
                      {["💗", "💓", "💕"].map((emoji, index) => (
                        <motion.button
                          key={index}
                          className={puzzle.includes(index) ? "selected" : ""}
                          whileTap={{ scale: 0.85 }}
                          disabled={puzzle.includes(index)}
                          onClick={() =>
                            setPuzzle((old) =>
                              old.includes(index) ? old : [...old, index]
                            )
                          }
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                    <div className="wish-counter">{puzzle.length} / 3 heart pieces</div>
                    {puzzle.length === 3 && <div className="wish-clue">{clues[3]}</div>}
                    {countdown !== null ? (
                      <motion.div
                        key={countdown}
                        className="wish-countdown"
                        initial={{ scale: 0.4 }}
                        animate={{ scale: 1 }}
                      >
                        {countdown === 0 ? "✨" : countdown}
                      </motion.div>
                    ) : (
                      <button
                        className="wish-primary"
                        disabled={puzzle.length < 3}
                        onClick={() => setCountdown(3)}
                      >
                        Reveal My Surprise 🎉
                      </button>
                    )}
                  </div>
                )}

                <div className="wish-footer">Made with love, just for you ♡</div>
              </motion.section>
            ) : (
              <motion.section
                key="finale"
                className="wish-card wish-finale"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="wish-confetti" aria-hidden="true">
                  {Array.from({ length: 20 }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        left: `${(index * 47) % 100}%`,
                        animationDelay: `${(index % 8) * 0.3}s`,
                      }}
                    >
                      {["💖", "✨", "🌸", "🎉"][index % 4]}
                    </span>
                  ))}
                </div>
                <div className="wish-eyebrow">THE BIG SURPRISE ✨</div>
                <div className="wish-celebration">🎉 💖 🎊 💖 🎉</div>
                {photo ? (
                  <img className="wish-photo" src={photo} alt="Surprise" />
                ) : (
                  <div className="wish-photo-placeholder">💖</div>
                )}
                <h1>{title}</h1>
                <p className="wish-final-message">{message}</p>
                <button className="wish-primary" onClick={reset}>
                  <RotateCcw size={18} /> Replay Surprise
                </button>
                {recipientMode && (
                  <a href="/" className="wish-primary">Make Your Own Surprise 💗</a>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {!recipientMode && (
            <aside className="wish-settings">
              <h2>🌸 Create Your Surprise</h2>
              <p>Personalize the magical journey and share it with someone special.</p>

              <label>Recipient's Name</label>
              <input
                value={name}
                maxLength={80}
                onChange={(event) => {
                  setName(event.target.value);
                  setShareLink("");
                }}
                placeholder="Enter their name"
              />

              <label>Occasion</label>
              <select
                value={occasion}
                onChange={(event) => {
                  setOccasion(event.target.value);
                  setShareLink("");
                }}
              >
                {Object.entries(occasions).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>

              <h3>💌 Adventure Clues</h3>
              {clues.map((clue, index) => (
                <div className="wish-clue-editor" key={index}>
                  <label>Stage {index + 1}: {stages[index]}</label>
                  <textarea
                    rows={2}
                    maxLength={400}
                    value={clue}
                    onChange={(event) => updateClue(index, event.target.value)}
                  />
                </div>
              ))}

              <h3>💖 Choose a Final Message</h3>
              <label>Message Category</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All Messages ({loveMessages.length})</option>
                {messageCategories.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>

              <div className="wish-search">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search messages..."
                />
              </div>

              <div className="wish-message-list">
                {filteredMessages.length === 0 ? (
                  <p>No messages found.</p>
                ) : (
                  filteredMessages.map((item) => (
                    <button
                      key={item.id}
                      className={message === item.text ? "active" : ""}
                      onClick={() => {
                        setMessage(item.text);
                        setShareLink("");
                      }}
                    >
                      {item.text}
                    </button>
                  ))
                )}
              </div>

              <label>Your Final Message</label>
              <textarea
                rows={5}
                maxLength={2000}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setShareLink("");
                }}
              />

              <label className="wish-upload">
                📸 Upload Recipient's Photo (Optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadPhoto}
                />
              </label>

              <div className="music-studio">
                <h3>🎵 Original Instrumental Music</h3>
                <p>
                  Original melodies are generated by your browser.
                  No YouTube player, music files, or downloads are required.
                </p>
                <p><strong>Selected:</strong> {occasions[occasion]}</p>
                <button type="button" className="wish-primary" onClick={toggleMusic}>
                  {musicEnabled ? "Pause Music" : "Preview Music"}
                </button>
              </div>

              <h3>🔐 Security Verification</h3>
              {TURNSTILE_KEY ? (
                <Turnstile
                  key={captchaVersion}
                  siteKey={TURNSTILE_KEY}
                  options={{ theme: "light" }}
                  onSuccess={setCaptchaToken}
                  onExpire={() => setCaptchaToken("")}
                  onError={() => setCaptchaToken("")}
                />
              ) : (
                <p>Missing VITE_TURNSTILE_SITE_KEY in your environment.</p>
              )}

              {captchaToken && <p className="wish-verified">✓ Verification successful</p>}

              {createError && (
                <p role="alert" style={{ color: "#b42350", fontWeight: 700 }}>
                  {createError}
                </p>
              )}

              <button
                className="wish-primary"
                disabled={creating || !captchaToken}
                onClick={createSurprise}
              >
                <Share2 size={18} />
                {creating ? "Creating Your Surprise..." : "Create & Share Surprise"}
              </button>

              {shareLink && (
                <div className="wish-clue">
                  <strong>🎉 Your surprise is ready!</strong>
                  <p>Send this link to your recipient:</p>
                  <input
                    value={shareLink}
                    readOnly
                    onFocus={(event) => event.target.select()}
                    aria-label="Shareable surprise link"
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button className="wish-primary" onClick={copyLink}>
                      <Copy size={16} /> {copySuccess ? "Copied!" : "Copy Link"}
                    </button>
                    <button className="wish-primary" onClick={shareSurprise}>
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>
              )}

              <button className="wish-restart" onClick={reset}>
                <RotateCcw size={16} /> Preview From Beginning
              </button>
            </aside>
          )}
        </div>
      )}
    </main>
  );
}
