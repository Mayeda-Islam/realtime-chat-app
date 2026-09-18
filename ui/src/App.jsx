import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");

  const joinRoom = () => {
    if (!username.trim() || !room.trim()) {
      alert("Please enter username and room ID");
      return;
    }

    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    console.log("Message:", message);

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {!joined ? (
        /* ================= JOIN SCREEN ================= */
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-3xl shadow-lg shadow-violet-600/20">
                💬
              </div>
            </div>

            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                ChitChat
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Real-time messaging made simple
              </p>
            </div>

            {/* Username */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Room */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Room ID
              </label>

              <input
                type="text"
                placeholder="Enter room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    joinRoom();
                  }
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Join Button */}
            <button
              onClick={joinRoom}
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold transition hover:bg-violet-500 active:scale-[0.98]"
            >
              Join Chat
            </button>
          </div>
        </div>
      ) : (
        /* ================= CHAT SCREEN ================= */
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
              
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl">
                  💬
                </div>

                <div>
                  <h2 className="font-bold">ChitChat</h2>
                  <p className="text-xs text-slate-400">
                    Real-time chat
                  </p>
                </div>
              </div>

              {/* Room */}
              <div className="rounded-lg bg-slate-800 px-4 py-2 text-right">
                <p className="text-xs text-slate-500">
                  Room
                </p>

                <p className="text-sm font-semibold text-violet-400">
                  {room}
                </p>
              </div>
            </header>

            {/* Messages */}
            <main className="flex-1 space-y-4 overflow-y-auto bg-slate-950/60 p-5">

              {/* Empty State */}
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 text-5xl">
                  💬
                </div>

                <h3 className="text-lg font-semibold">
                  No messages yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Start the conversation!
                </p>
              </div>

              {/* 
                Later you will render messages here.

                Example:

                <div className="flex justify-end">
                  <div className="max-w-[70%] rounded-2xl rounded-br-md bg-violet-600 px-4 py-3">
                    <p>Hello!</p>
                    <span className="text-xs text-violet-200">
                      10:30 PM
                    </span>
                  </div>
                </div>
              */}
            </main>

            {/* Input */}
            <div className="border-t border-slate-800 bg-slate-900 p-4">
              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="rounded-xl bg-violet-600 px-5 text-xl transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ➤
                </button>

              </div>
            </div>

            {/* Status */}
            <div className="border-t border-slate-800 bg-slate-900 px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>

                Connected as
                <span className="font-semibold text-slate-200">
                  {username}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;