import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatstore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userstore";
import upload from "../../lib/upload";
const Chat = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);


  const isCurrentUserBlocked = false;
  const isReciverBlocked = false;

  console.log('isCurrentUserBlocked:',isCurrentUserBlocked);
  console.log('isReceiverBlocked:', isReciverBlocked);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      const chatRef = doc(db, "chats", chatId);
      const chatSnapshot = await getDoc(chatRef);

      if (chatSnapshot.exists()) {
        await updateDoc(chatRef, {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
            ...(imgUrl && { img: imgUrl }),
          }),
        });
      } else {
        await setDoc(chatRef, {
          messages: [
            {
              senderId: currentUser.id,
              text,
              createdAt: new Date(),
            },
          ],
        });
      }

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchat", id);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();
          const chatIndex = userChatData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          if (chatIndex !== -1) {
            userChatData.chats[chatIndex].lastMessage = text;
            userChatData.chats[chatIndex].isSeen =
              id === currentUser.id ? true : false;
            userChatData.chats[chatIndex].updatedAt = Date.now();
          } else {
            userChatData.chats.push({
              chatId,
              lastMessage: text,
              isSeen: id === currentUser.id ? true : false,
              updatedAt: Date.now(),
            });
          }

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        } else {
          await setDoc(userChatRef, {
            chats: [
              {
                chatId,
                lastMessage: text,
                isSeen: id === currentUser.id ? true : false,
                updatedAt: Date.now(),
              },
            ],
          });
        }
      });

      setText("");
    } catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: "",
    });
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar|| "avatar.png"} alt="" />
          <div className="text">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={message.senderId === currentUser?.id ?"message own" :"message"}
           style={{display:"flex" ,flexDirection:"column"}}
            key={message?.createdAt}
          >
            {message.img && <img src={message.img} alt="" />}
            <div className="texts">
              <p>{message.text} </p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>

          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        
        <input
          type="text"
          
          placeholder={isCurrentUserBlocked || isReciverBlocked ?"You cannot send a message" : "Type a message...."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReciverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendbut" onClick={handleSend} disabled={isCurrentUserBlocked || isReciverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;


