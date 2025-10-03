import Book from "./Book/Book";
import Discover from "./Discover/Discover";
import "./Main.css"
import Reviews from "./Reviews/Reviews";
import Rooms from "./Rooms/Rooms";
import Services from "./Services/Services";

const Main = () => {
    return (
        <main className="main">
            <div className="main__container content">
                <Book/>
                <Services/>
                <Discover/>
                <Reviews/>
            </div>
        </main>
    )
}
export default Main;