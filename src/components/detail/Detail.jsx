import { auth } from "../../lib/firebase"
import "./detail.css"
const Detail = () =>{
    return(
        <div className="detail">
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>Giwa Mubarak</h2>
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
                        <img src="./download.png" alt=""  className="icon"/>
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
                        <img src="./download.png" alt="" className="icon"/>
                    </div>
                    
                </div>
                </div>
                <div className="option">
                <div className="title">
                <span>Shared  files</span>
                <img src="./arrowUp.png" alt="" />
                </div>
                </div>
                <button>Block User</button>
                <button className="logout" onClick={()=>auth.signOut()}>Log out</button>
            </div>
        </div>
    )
} 
export default Detail