import pro1 from '../assets/pro1.png';
import pro2 from '../assets/pro2.png';
import pro3 from '../assets/pro3.png';

const Projects = () => {
    return (
        <section className="projects">
            <h2>Projects</h2>
            <div className="project-list">
                <div className="project-card">
                    <img src={pro1} alt="Project 1" height={100} />
                    <h3>Movies App</h3>
                    <p>A flutter app that showcase the UI of Movies App using TMDB API. Is is dynamic and listed data from the api.</p>
                </div>
                <div className="project-card">
                    <img src={pro2} alt="Project 2" height={100} />
                    <h3>Nepali Driving License App</h3>
                    <p>A flutter app that helps to prepare for the written test of Nepali Driving License. It has 1000+ downloads in Play Store.</p>
                </div>
                <div className="project-card">
                    <img src={pro3} alt="Project 3" height={100} />
                    <h3>Rental App</h3>
                    <p>A flutter app that showcase the UI of Rent Finder App.</p>
                </div>
            </div>
        </section>
    );
};

export default Projects;
