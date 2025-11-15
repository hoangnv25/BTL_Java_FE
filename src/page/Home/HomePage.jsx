import { useEffect, useState } from "react";
import NewArrivals from "./NewArrivals/NAinPage";
import Review from "./Review/Page";
import Sale from "./Sale/Sale";
import homeimg from "../../assets/image/homeimg.png";
import "./HomePage.css";
import { getToken } from "../../service/LocalStorage";
import { Box, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";

export default function HomePage() {
    const [userDetails, setUserDetails] = useState(null);
    
    const getUserDetails = (token) => {
        if (!token) return;
        try {
            // Decode JWT token để lấy thông tin user
            const decodedToken = jwtDecode(token);
            setUserDetails({
                name: decodedToken.fullName || decodedToken.sub, // Ưu tiên fullName từ claim
                // Có thể thêm các thông tin khác từ token nếu cần
            });
        } catch (error) {
            console.error("Error decoding token:", error);
            setUserDetails(null);
        }
    };

    useEffect(() => {
        const token = getToken();
        getUserDetails(token);
        
        // Lắng nghe sự kiện thay đổi token
        const handleTokenChange = () => {
            const newToken = getToken();
            getUserDetails(newToken);
        };
        
        window.addEventListener('tokenChanged', handleTokenChange);
        
        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange);
        };
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