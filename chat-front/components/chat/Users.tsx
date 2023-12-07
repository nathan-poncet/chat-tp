import { ChatContext } from "@/app/chat/page";
import { useContext, useEffect } from "react";

export default function Users() {
  const { socket, users, setUsers } = useContext(ChatContext);

  useEffect(() => {
    // Listen for incoming messages
    socket?.on("chat-client", (clients) => {
      setUsers(clients);
    });

    // Clean up
    return () => {
      socket?.off("chat-client");
    };
  }, [socket, setUsers]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between text-xs">
        <span className="font-bold">List of users</span>
        <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
          {users?.length}
        </span>
      </div>
      <div className="flex flex-col space-y-1 mt-4 overflow-y-auto">
        {users?.map((user) => (
          <button
            key={user.clientId}
            className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
          >
            <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
              {user.username?.charAt(0)}
            </div>
            <div className="ml-2 text-sm font-semibold">{user.username}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
