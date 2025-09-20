import "./Discover.css"
import vid from "../../../assets/images/vid.png"
import play from "../../../assets/icons/play_icon.svg"

const Discover = () => {
    return (
        <section className="discover">
            <div className="discover__container">
                <div className="discover__info">
                    <div className="discover__info-container">
                        <h1>Discover Our History</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                        <div className="buttons">
                            <button>Explore More</button>
                            <div className="watch__vid">
                                <img src={play} alt="" />
                                <p>Watch video</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="discover__vid">
                    <img src={vid} alt="vid" />
                    <div className="discover__vid-filter"></div>
                </div>
            </div>
        </section>
    )
}
export default Discover  