import { useEffect, useState } from "react";
import "./chatlist.css";
import Adduser from "./Adduser";
import { useUserStore } from "../../../lib/userstore";
import { useChatStore } from "../../../lib/chatstore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Chatlist = () => {
  const [addMore, setAddmore] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(
      doc(db, "userchat", currentUser.id),
      async (res) => {
        if (res.exists()) {
          const items = res.data().chats || [];
          console.log("Fetched items:", items);

          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data();

            return { ...item, user };
          });

          const chatData = await Promise.all(promises);
          console.log("Processed chat data:", chatData);
          chatData.forEach(chat => console.log("Chat ID:", chat.chatId));
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        } else {
          console.log("No chats found for user");
          setChats([]);
        }
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  const addNewChat = (newChat) => {
    console.log("addNewChat called with:", newChat);
    setChats((prevChats) => {
      console.log("Updating chats state");
      return [newChat, ...prevChats];
    });
  };

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const {...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true;
    }

    const userChatsRef = doc(db, "userchat", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };
 
  const filterChats = chats.filter(e => {
    if (e && e.user && e.user.username && input) {
      return e.user.username.toLowerCase().includes(input.toLowerCase());
    }
    return true; 
  });

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="search" onChange={(e)=>setInput(e.target.value)}/>
        </div>
        <img
          src={addMore ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddmore((prev) => !prev)}
        />
      </div>
      {chats.length === 0 ? (
        <div>No chats available</div>
      ) : (
        filterChats.map((chat, index) => {

          return (
            <div
              className="item"
              key={`${chat.chatId}-${index}`} 
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <img src={chat.user?.avatar || "./avatar.png"} alt="" />
              <div className="text">
                <span>{chat.user?.username || "Unknown User"}</span>
                <p>{chat.lastMessage}</p>
              </div>
            </div>
          );
        })
      )}
      {addMore && <Adduser onAddChat={addNewChat} />}
    </div>
  );
};

export default Chatlist;
