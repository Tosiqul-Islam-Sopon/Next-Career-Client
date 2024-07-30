// src/components/AboutUs.js
import img1 from '../../../../assets/Images/about/about1.jpg';
import img2 from '../../../../assets/Images/about/about2.jpg';
import img3 from '../../../../assets/Images/about/about3.jpg';
import img4 from '../../../../assets/Images/about/about4.jpg';

const AboutUs = () => {
    return (
        <div className='my-8 px-4 md:px-12 '>
            <h1 className='text-4xl font-black mb-7 text-center'>About Us</h1>
            <div className="flex flex-col md:flex-row gap-8 ">
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <img className="w-full h-full object-cover rounded-lg shadow-md" src={img1} alt="About us 1" />
                    <img className="w-full h-full object-cover rounded-lg shadow-md" src={img2} alt="About us 2" />
                    <img className="w-full h-full object-cover rounded-lg shadow-md" src={img3} alt="About us 3" />
                    <img className="w-full h-full object-cover rounded-lg shadow-md" src={img4} alt="About us 4" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-6 text-justify">Welcome to Next Career</h1>
                    <p className="text-lg mb-4 text-justify">
                        At Next Career, we are dedicated to helping you find the perfect job that matches your skills and passions.
                        Our platform connects you with top employers looking for talented professionals just like you.
                    </p>
                    <p className="text-lg text-justify">
                        Join our community and take the next step in your career journey. Whether you&apos;re looking for a new challenge,
                        a better opportunity, or a complete career change, Next Career is here to support you every step of the way.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
