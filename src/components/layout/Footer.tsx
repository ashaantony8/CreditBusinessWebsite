import { BsArrowRight } from 'react-icons/bs';
import { MdCall, MdEmail, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

import c4b from '../../assets/images/c4b.png';
import Logo from '../../assets/images/WhiteLogo.png';
import { Useful, whatWeDo } from '../../utils/data';

const Footer = () => {
  const footerIcons = [
    {
      name: '86-90 Paulstreet, London, EC2A 4NE.',
      icon: <MdLocationOn />
    },
    {
      name: 'info@credit4business.co.uk',
      icon: <MdEmail />
    },
    {
      name: '020 8004 9787',
      icon: <MdCall />
    }
  ];
  return (
    <>
      <section id="footer ">
        <div className="relative bg-[#081B2C] py-4 text-white">
          <div className="container mx-auto px-8 py-10 max-sm:px-2">
            <div className="grid grid-cols-12 border-b-2 border-gray-700 px-[2%] pb-12 max-lg:gap-7">
              <div className="col-span-12 lg:col-span-7">
                <h2 className="font-manrope mb-2 text-3xl font-bold leading-tight text-white max-lg:text-center max-sm:text-[16px]">
                  {'Newsletter.'}
                </h2>
                <p className="text-base font-normal text-gray-400 max-lg:text-center max-sm:text-[12px]">
                  {'Get instant news by subscribe to our daily newsletter'}
                </p>
              </div>
              <div className="col-span-12 flex flex-col items-center gap-4 lg:col-span-5">
                <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-full border border-gray-700 bg-white p-2.5 pl-5 transition-all duration-300 focus-within:border-gray-400 hover:border-gray-400 min-[470px]:p-1.5 min-[470px]:pl-7 lg:mr-0">
                  <input
                    type="text"
                    className="placeholder:text[#524F4F] bg-transparent text-base font-normal text-white focus-within:outline-0"
                    placeholder="Enter your Email address"
                  />
                  <button className="rounded-full bg-red-600 p-4 text-base font-semibold text-white shadow-sm shadow-transparent transition-all duration-500 focus-within:bg-red-700 focus-within:outline-0 hover:bg-red-700 min-[470px]:block">
                    <BsArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b-2 border-gray-700 p-[2%] max-sm:mt-2 max-sm:grid-cols-2 max-sm:justify-center max-sm:gap-2">
              {' '}
              <div className="space-y-6">
                <div className="font-bold">
                  <a href="#" className="flex items-center">
                    <img
                      src={Logo}
                      alt="Logo"
                      className="max-lg:w-[180px] max-sm:w-[100px]"
                    />
                  </a>
                </div>

                {footerIcons.map((footerIcons, index) => (
                  <div
                    key={index}
                    className="grid max-lg:text-[14px] max-sm:text-[10px]"
                  >
                    <ul className="text-color-text-primary-dark">
                      <li className="flex gap-x-2 hover:text-color-text-secondary max-sm:gap-x-1">
                        <span className="-ml-2 mt-1 text-2xl text-[#F02E23] max-sm:hidden">
                          {footerIcons.icon}{' '}
                        </span>{' '}
                        <a href="#" className=" ">
                          {footerIcons.name}
                        </a>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>{' '}
              <div className="space-y-2">
                <div className="grid items-start text-[17px] font-bold max-sm:text-[14px]">
                  {'Useful Links'}{' '}
                  <div className="my-1 h-[1.5px] w-7 bg-[#F02E23]"></div>
                </div>
                {Useful.map((item, index) => (
                  <div key={index}>
                    {' '}
                    <ul className="text-color-text-primary-dark max-lg:text-[14px] max-sm:text-[10px]">
                      <li className="flex hover:text-color-text-secondary">
                        <Link to={item.path} className="mt-1">
                          {item.name}
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="grid items-start text-[17px] font-bold max-sm:text-[14px]">
                  {'What We Do'}{' '}
                  <div className="my-1 h-[1.5px] w-7 bg-[#F02E23]"></div>
                </div>
                {whatWeDo.map((whatWeDo, index) => (
                  <div key={index}>
                    {' '}
                    <ul className="text-color-text-primary-dark max-lg:text-[14px] max-sm:text-[10px]">
                      <li className="flex hover:text-color-text-secondary">
                        <a href="#" className="mt-1">
                          {whatWeDo.name}
                        </a>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex items-center gap-2 max-lg:justify-center max-sm:grid max-sm:justify-items-center">
              <span>
                {' '}
                <img src={c4b} alt="Logo" className="max-lg:w-[100px]" />
              </span>
              <span className="text-[16px] font-semibold text-[#b6bbc0] max-lg:text-[8px] max-sm:text-center max-sm:text-[12px]">
                {' '}
                {
                  'trading as Credit4Business, is registered in England and Wales'
                }
                {'under company number: 09833718. Credit4Business is a direct'}
                {'finance provider.'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
