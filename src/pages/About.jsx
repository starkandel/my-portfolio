import myphoto from '../assets/myphoto.jpg';

const About = () => {
    return (
        <section className="about">
            <h2>About Me</h2>
            <img src={myphoto} alt="My Photo" className="about-photo" />
            <p>Hi, I'm Girija Prasad Kandel, a passionate web developer focused on creating engaging digital experiences.</p>

        </section>
    );
};

export default About;
