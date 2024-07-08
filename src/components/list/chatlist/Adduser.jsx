import "./adduser.css";
import { db } from "./../../../lib/firebase";
import { useUserStore } from "./../../../lib/userstore";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
const Adduser = ({ onAddChat }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setErrorMessage('');
      } else {
        setErrorMessage('User not found');
        setUser(null);
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setErrorMessage('Error searching for user');
    }
  };

  const handleAdd = async () => {
    console.log("Starting handleAdd");
    const chatRef = collection(db, "chat");
    const UserChatsRef = collection(db, "userchat");
    try {
      console.log("Creating new chat document");
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      console.log("New chat document created");

      const newChat = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.id,
        updatedAt: Date.now(),
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar || "./avatar.png"
        }
      };

      console.log("Updating user chats");
      await updateDoc(doc(UserChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      }); 

      await updateDoc(doc(UserChatsRef, currentUser.id), {
        chats: arrayUnion(newChat),
      });
      console.log("User chats updated");

      onAddChat(newChat);
      console.log("onAddChat called with:", newChat);

      setSuccessMessage('User added successfully!');
      setErrorMessage('');
      setUser(null); 
      return true;
    } catch (err) {
      console.error("Error in handleAdd:", err);
      setErrorMessage('Failed to add user. Please try again.');
      setSuccessMessage('');
      return false;
    }
  };

  const handleAddClick = async () => {
    console.log("handleAddClick started");
    const success = await handleAdd();
    console.log("handleAdd result:", success);
  };
  return (
    <div className="adduser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAddClick}>Add User</button>
        </div>
      )}
    </div>
  );
};
export default Adduser;
