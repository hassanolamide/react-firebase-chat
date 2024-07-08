import { auth, db } from "../../lib/firebase";
import "./detail.css";
import { useUserStore } from "./../../lib/userstore";
import { useChatStore } from "./../../lib/chatstore";
import { doc, updateDoc } from "firebase/firestore";


const Detail = () => {
  
  const {  user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
   
  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;
    
    console.log("Receiver Blocked Status:", isReceiverBlocked);
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ?true:false ,
      });
      changeBlock();
      console.log("Block/Unblock operation successful");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit, amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoitem">
              <div className="photodetail">
                <img src="./i13.jpg" alt="" />
                <span>iphone_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoitem">
              <div className="photodetail">
                <img src="./i13.jpg" alt="" />
                <span>iphone_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoitem">
              <div className="photodetail">
                <img src="./i13.jpg" alt="" />
                <span>iphone_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoitem">
              <div className="photodetail">
                <img src="./i13.jpg" alt="" />
                <span>iphone_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Log out
        </button>
      </div>
    </div>
  );
};
export default Detail;
