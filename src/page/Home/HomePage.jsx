import { useEffect, useState } from "react";
import NewArrivals from "./NewArrivals/NAinPage";
import Review from "./Review/Page";
import Sale from "./Sale/Sale";
import homeimg from "../../assets/image/homeimg.png";
import "./HomePage.css";
import { getToken } from "../../service/LocalStorage";
import { Box, Typography } from "@mui/material";

export default function HomePage() {
    const [userDetails, setUserDetails] = useState(null);
    
    const getUserDetails = async (accessToken) => {
        if (!accessToken) return;
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&accessToken=${accessToken}`
        );
        const data = await response.json();
        setUserDetails(data);
    };

    const getFacebookUserDetails = async (accessToken) => {
        if (!accessToken) return;
        const response = await fetch(
            `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`
        );
        const data = await response.json();
        setUserDetails(data);
    };

    useEffect(() => {
        const accessToken = getToken();
        getUserDetails(accessToken);
        getFacebookUserDetails(accessToken);
    }, []);
    return (
        <div className="home-page">
            {userDetails && (
                <Box sx={{ padding: 2, textAlign: 'center' }}>
                    <Typography variant="h5">
                        Xin chào, {userDetails.name}!
                    </Typography>
                </Box>
            )}
            <img className="homeimg" src={homeimg} alt="homeimg" />
            <Sale />
            <NewArrivals />
            <Review />
        </div>
    )
}