import expenseLogo from "../assets/expense_tracker_logo.png"
import { Navigate } from "react-router-dom"
import Cookies from "js-cookie"


const Welcome = () => {
    const token = Cookies.get("jwt_token");
    console.log("Cookie:", token)
    if(token){
        return <Navigate to="/dashboard"></Navigate>
    }
    else{
        return (
        <div className="App">
            <header className="App-header">
                <img
                    src={expenseLogo}
                    className="App-logo"
                    alt="logo"
                />
                <p className="App-heading">Welcome to Expense Tracker</p>
                <a
                    className="getstarted"
                    href="/register"
                    rel="noopener noreferrer"
                >
                    Get started
                </a>
            </header>
        </div>
    )
    }
}

export default Welcome