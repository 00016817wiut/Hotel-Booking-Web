import About from "../../components/Main/About/About";
import Contact from "../../components/Main/Contact/Contact";
import Faq from "../../components/Main/Faq/Faq";
import "./Main.css"
import Reviews from "../../components/Main/Reviews/Reviews";
import Services from "../../components/Main/Services/Services";

const Main = () => {
    return (
        <main className="main">
            <div className="main__container content">
                <About/>
                <Services/>
                <Contact/>
                <Faq/>
                <Reviews/>
            </div>
        </main>
    )
}
export default Main;
