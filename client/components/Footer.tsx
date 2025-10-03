"use client";


export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand / Logo Section */}
        <div className="col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-md flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-black"></div>
            </div>
            <span className="text-black font-bold text-xl">Triloe</span>
          </div>
          <p className="text-xl text-gray-700 mb-6 max-w-sm" style={{ fontFamily: "poppines" }}>
            Unlock performance with data-driven campaigns, creative
            storytelling, and impactful branding
          </p>
          
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="font-bold text-black mb-4">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: "poppines" }}>
            <li><a href="#">What We Offer</a></li>
            <li><a href="#">Case Studies</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-black mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: "poppines" }}>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-black mb-4">Legal Links</h3>
          <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: "poppines" }}>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>

        {/* Request a Demo */}
        <div className="col-span-2 md:col-span-1" style={{ fontFamily: "poppines" }}>
          <h3 className="font-bold text-black mb-4">Request a Demo</h3>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 px-4 py-2 text-black font-medium rounded-r-md hover:bg-yellow-500 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 mt-8 py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-700">
        <p>© Triloe Inc. All Rights Reserved.</p>
        <a href="#top" className="flex items-center space-x-2 mt-2 md:mt-0 hover:text-black">
          <span>Back to top</span>
          <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-700">
            
          </span>
        </a>
      </div>
    </footer>
  );
}
