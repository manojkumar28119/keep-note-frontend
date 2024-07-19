import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css"
import { FaSignOutAlt } from "react-icons/fa";
 

const Header = (props) =>{

const {onChangeSearchInput} = props
    
const logo = 'https://seeklogo.com/images/G/google-keep-logo-0BC92EBBBD-seeklogo.com.png';

const onClickSignOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace("/signin")
}

 return (
    <div className="header">
        <div className="logo-text-card">
            <img src={logo} alt = "logo" className="logo" />
            <p>Keep Note</p>
        </div>
        <div>
            <input type="search" className="search-input" placeholder="Search notes..." onChange={onChangeSearchInput} />
        </div>
        <FaSignOutAlt onClick={onClickSignOut} className="sign-out-btn" />
    </div>
)
}

export default withRouter(Header)