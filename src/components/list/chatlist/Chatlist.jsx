import { useEffect, useState } from "react";
import "./chatlist.css";
import Adduser from "./Adduser";
import { useUserStore } from "../../../lib/userstore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
const Chatlist = () => {
  const [addMore, setAddmore] = useState(false);
  const [chats, setChats] = useState([]);

  const { currentUser } = useUserStore();

  useEffect(() => {
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
  }, [currentUser.id]);

  const addNewChat = (newChat) => {
    console.log("addNewChat called with:", newChat);
    setChats(prevChats => {
      console.log("Updating chats state");
      return [newChat, ...prevChats];
    });
    };
    setAddmore(false);
  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="search" />
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
        chats.map((chat) => {
          console.log("Rendering chat:", chat);
          return (
            <div className="item" key={chat.chatId}>
              <img src={chat.user?.avatar || "./avatar.png"} alt="" />
              <div className="text">
                <span>{chat.user?.username || 'Unknown User'}</span>
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