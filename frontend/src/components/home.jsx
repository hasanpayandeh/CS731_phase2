import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(props.user._id!=""&&props.user._id!=null) {
            navigate("/restaurants");
        }
        else {
            navigate("/login");
        }
    }, [])
}

export default Home;