import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
  // Configuration for the carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Hide arrows for a cleaner look
    responsive: [
      {
        breakpoint: 768, // Adjust the breakpoints for responsiveness
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <section className="py-10 mb-10 bg-white">
      <div className="container mx-auto text-center">
        <Slider {...settings}>
          {/* Slide 1: Manage Your Stocks */}
          <div>
            <div className="rounded-lg overflow-hidden shadow-lg flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">Manage Your Stocks</h2>
              <img src="src/images/1.png" alt="Manage Your Stocks" className="md:w-[50vh] w-fit text-center rounded-lg" />
              <div className="px-6 py-4">
                <p className="text-gray-700 text-base p-2 rounded-lg">Efficiently track and manage your inventory with real-time updates and detailed analytics.</p>
              </div>
            </div>
          </div>
+
          {/* Slide 2: Sales */}
          <div>
            <div className="rounded-lg overflow-hidden shadow-lg flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">Track Your Sales</h2>
              <img src="src/images/2.png" alt="Track Your Sales" className="md:w-[50vh] w-fit text-center rounded-lg" />
              <div className="px-6 py-4">
                <p className="text-gray-700 text-base">Analyze your sales performance and trends to optimize your business strategy.</p>
              </div>
            </div>
          </div>

          {/* Slide 3: Transactions */}
          <div>
            <div className="rounded-lg overflow-hidden shadow-lg flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">Manage Transactions</h2>
              <img src="src/images/3.png" alt="Manage Transactions" className="md:w-[50vh]  text-center rounded-lg" />
              <div className="px-6 py-4">
                <p className="text-gray-700 text-base">Streamline your financial transactions and ensure accuracy in every transaction process.</p>
              </div>
            </div>
          </div>

          {/* Add more slides as needed */}
        </Slider>
      </div>
    </section>
  );
};

export default Carousel;
