const Contact = () => {
    return (
        <section className="contact">
            <h2>Contact Me</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Form Submitted!'); }}>
                <input type="text" placeholder="First Name" required />
                <input type="text" placeholder="Last Name" required />
                <input type="tel" placeholder="Contact Number" required />
                <input type="email" placeholder="Email Address" required />
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit" className="btn">Submit</button>
            </form>
        </section>
    );
};

export default Contact;
