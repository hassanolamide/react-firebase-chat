import Adduser from "./chatlist/Adduser"
import Chatlist from "./chatlist/Chatlist"
import "./list.css"
import Userinfo from "./userinfo/Userinfo"
const List = () =>{
    console.log(Chatlist)
    return(
        <div className="list">
        <Userinfo/>
        <Chatlist/>
        
        </div>
    )
} 
export default List