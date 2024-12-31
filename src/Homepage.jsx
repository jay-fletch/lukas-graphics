import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Homepage.css';

const Homepage = () => {
    const [formData, setFormData] = useState({
        package: 'Custom Digital Collage (<20 images)',
        description: '',
        email: '',
        files: [],
        fileURLs: [] // Store URLs of uploaded files
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, files });

        // Upload files to Cloudinary
        const fileURLs = await Promise.all(
            files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'unsigned_upload'); // Replace with your upload preset

                try {
                    const response = await fetch('https://api.cloudinary.com/v1_1/dockszmzz/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    return data.secure_url; // Get the secure URL of the uploaded file
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('Failed to upload file. Please try again.');
                    return null;
                }
            })
        );

        // Filter out null values (failed uploads)
        setFormData((prevState) => ({
            ...prevState,
            fileURLs: fileURLs.filter((url) => url !== null)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const serviceId = 'service_cwf58no';
        const templateId = 'template_6tweh78';
        const userConfirmationTemplateId = 'template_pwmlsx5';
        const publicKey = 'go_6cZA4ULKq9XHpO';

        try {
            // Send the email to you (recipient)
            const recipientData = {
                package: formData.package,
                description: formData.description,
                email: formData.email,
                fileList: formData.fileURLs.join('\n') // Include file URLs
            };

            await emailjs.send(serviceId, templateId, recipientData, publicKey);

            // Send confirmation email to the user
            const userConfirmationData = {
                user_email: formData.email,
                user_package: formData.package
            };

            await emailjs.send(serviceId, userConfirmationTemplateId, userConfirmationData, publicKey);

            alert('Your order has been submitted successfully! A confirmation email has been sent to your address.');
            setFormData({
                package: 'Custom Digital Collage (<20 images)',
                description: '',
                email: '',
                files: [],
                fileURLs: []
            });
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to submit your order. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="homepage">
            {/* Header */}
            <header className="header">
                <div className="logo">Lukas Graphics</div>
                <nav className="nav">
                    <a href="#services">Services</a>
                    <a href="#upload">Get Started</a>
                    <a href="#contact">Contact</a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <h1>Create Stunning Custom Graphics</h1>
                <p>Your vision, our creativity. From digital collages to printed masterpieces, we bring your ideas to life.</p>
                <a href="#services" className="btn">Explore Services</a>
            </section>

            {/* Services Section */}
            <section id="services" className="services">
                <h2>Our Services</h2>
                <div className="service-cards">
                    <div className="card">
                        <h3>Custom Digital Collage</h3>
                        <p>Upload up to 20 images and get a bespoke digital collage.</p>
                    </div>
                    <div className="card">
                        <h3>Printed Collages</h3>
                        <p>High-quality printed collages delivered to your door.</p>
                    </div>
                    <div className="card">
                        <h3>More Coming Soon</h3>
                        <p>Stay tuned for additional custom graphic packages.</p>
                    </div>
                </div>
            </section>

            {/* Upload Section */}
            <section id="upload" className="upload">
                <h2>Get Started</h2>
                <p>Choose your package and upload your images. We'll take care of the rest.</p>
                <form className="upload-form" onSubmit={handleSubmit}>
                    <label>
                        Select Package:
                        <select name="package" value={formData.package} onChange={handleInputChange}>
                            <option>Custom Digital Collage (Less than 20 images)</option>
                            <option>Printed Collage</option>
                        </select>
                    </label>
                    <label>
                        Your Email:
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Upload Images:
                        <input type="file" name="files" multiple onChange={handleFileChange} />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            placeholder="Describe your desired layout, size, and details..."
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </section>

            {/* Footer */}
            <footer id="contact" className="footer">
                <p>&copy; 2024 Lukas Graphics. All rights reserved.</p>
                <div className="socials">
                    <a href="#">Facebook</a>
                    <a href="#">Instagram</a>
                    <a href="#">Twitter</a>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
