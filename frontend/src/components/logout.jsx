import { useEffect } from "react";

const Logout = (props) => {
    useEffect(() => {
        localStorage.setItem('user', '');
        window.location.replace("/");
    }, [])
}

export default Logout;