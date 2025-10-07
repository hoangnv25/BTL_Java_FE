import NewArrivals from "./NewArrivals/NAinPage";
import Review from "./Review/Page";
import Sale from "./Sale/Sale";
import homeimg from "../../assets/image/homeimg.png";
import "./HomePage.css";

export default function HomePage() {
    return (
        <div className="home-page">
            <img className="homeimg" src={homeimg} alt="homeimg" />
            <Sale />
            <NewArrivals />
            <Review />
        </div>
    )
}