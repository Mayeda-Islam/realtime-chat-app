import { useState } from "react";
import Login from "./pages/Login";
// import Chatroom from "./components/Chatroom";

// function App() {
  // const [username, setUsername] = useState("");
  // const [room, setRoom] = useState("");
  // const [joined, setJoined] = useState(false);

  // const joinRoom = () => {
  //   if (!username.trim() || !room.trim()) {
  //     alert("Please enter username and room ID");
  //     return;
  //   }

  //   setJoined(true);
  // };

 

  // return (
  //   <div className="min-h-screen bg-slate-950 text-white">
  //     {!joined ? (
  //       /* ================= JOIN SCREEN ================= */
  //       <div className="flex min-h-screen items-center justify-center px-4">
  //         <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            
  //           {/* Logo */}
  //           <div className="mb-6 flex justify-center">
  //             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-3xl shadow-lg shadow-violet-600/20">
  //               💬
  //             </div>
  //           </div>

  //           {/* Title */}
  //           <div className="mb-8 text-center">
  //             <h1 className="text-3xl font-bold tracking-tight">
  //               ChitChat
  //             </h1>

  //             <p className="mt-2 text-sm text-slate-400">
  //               Real-time messaging made simple
  //             </p>
  //           </div>

  //           {/* Username */}
  //           <div className="mb-5">
  //             <label className="mb-2 block text-sm font-medium text-slate-300">
  //               Username
  //             </label>

  //             <input
  //               type="text"
  //               placeholder="Enter your username"
  //               value={username}
  //               onChange={(e) => setUsername(e.target.value)}
  //               className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
  //             />
  //           </div>

  //           {/* Room */}
  //           <div className="mb-6">
  //             <label className="mb-2 block text-sm font-medium text-slate-300">
  //               Room ID
  //             </label>

  //             <input
  //               type="text"
  //               placeholder="Enter room ID"
  //               value={room}
  //               onChange={(e) => setRoom(e.target.value)}
  //               onKeyDown={(e) => {
  //                 if (e.key === "Enter") {
  //                   joinRoom();
  //                 }
  //               }}
  //               className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
  //             />
  //           </div>

  //           {/* Join Button */}
  //           <button
  //             onClick={joinRoom}
  //             className="w-full rounded-xl bg-violet-600 py-3 font-semibold transition hover:bg-violet-500 active:scale-[0.98]"
  //           >
  //             Join Chat
  //           </button>
  //         </div>
  //       </div>
  //     ) : (
  //       /* ================= CHAT SCREEN ================= */
  //      <Chatroom username={username} room={room}/>
  //     )}
  //   </div>
  // );
// }
function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Login />
      {/* <Chatroom username={username} room={room} /> */}
    </div>
  );
}

export default App;