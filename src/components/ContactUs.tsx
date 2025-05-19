import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FiPhoneCall } from 'react-icons/fi';
import { IoCaretDownSharp } from 'react-icons/io5';
import { LiaEnvelopeOpenTextSolid, LiaFaxSolid } from 'react-icons/lia';

import { contactUsApi } from '../api/userServices';
import { NotificationType } from '../utils/hooks/toastify/enums';
import useToast from '../utils/hooks/toastify/useToast';
import { ContactUsSchema } from '../utils/Schema';
import { ContactFormData } from '../utils/types';

const ContactUs = () => {
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const methods = useForm<ContactFormData>({
    resolver: yupResolver(ContactUsSchema)
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = methods;
  const { showToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('How did you find us?');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (data: ContactFormData) => {
    data.howDidYouFindUs = selectedOption;
    try {
      const response = await contactUsApi(data);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        reset();
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-center bg-custom-gradient">
      <section className="container mx-auto p-6 lg:px-12">
        <div className="mx-auto">
          <div className="grid grid-cols-1 gap-8 bg-white md:grid-cols-2">
            <div>
              <div className="mx-auto max-w-full overflow-hidden rounded-lg">
                <motion.div
                  className="max-sm:order-2"
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeInLeft}
                >
                  <FormProvider {...methods}>
                    <form
                      className="pl-12 max-sm:pl-2 max-sm:pr-2"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <p className="text-center font-Playfair font-bold text-color-text-primary max-sm:text-[30px] md:text-[36px] lg:text-[48px]">
                        {'Get in '}
                        <a className="text-[#1A439A]">{'Touch'}</a>
                      </p>
                      <p className="my-2 text-[14px]">
                        {'Enim tempor eget pharetra facilisis sed maecenas'}
                        {
                          'adipiscing. Eu leo molestie vel, ornare non id blandit'
                        }
                        {'netus.'}
                      </p>
                      <div>
                        <div className="-mx-4 my-4 flex flex-wrap">
                          <div className="w-full p-4">
                            <div className="mb-4">
                              <input
                                className="focus:shadow-outline w-full appearance-none border px-3 py-3 leading-tight placeholder:text-sm placeholder:font-light placeholder:text-[#828282] focus:outline-none"
                                type="text"
                                placeholder="Name"
                                {...register('name')}
                              />
                              {errors.name && (
                                <p className="text-red-500">
                                  {errors.name.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-4">
                              <input
                                className="focus:shadow-outline w-full appearance-none border px-3 py-3 leading-tight placeholder:text-sm placeholder:font-light placeholder:text-[#828282] focus:outline-none"
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                              />
                              {errors.email && (
                                <p className="text-red-500">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            <div className="mb-4">
                              <input
                                className="focus:shadow-outline w-full appearance-none border px-3 py-3 leading-tight placeholder:text-sm placeholder:font-light placeholder:text-[#828282] focus:outline-none"
                                type="phone_number"
                                placeholder="Phone number"
                                {...register('phone_number')}
                              />
                              {errors.phone_number && (
                                <p className="text-red-500">
                                  {errors.phone_number.message}
                                </p>
                              )}
                            </div>
                            <div className="focus:shadow-outline w-full appearance-none border px-3 py-3 leading-tight focus:outline-none">
                              <div
                                className="relative cursor-pointer"
                                ref={dropdownRef}
                              >
                                <div
                                  className="flex items-center justify-between space-x-5 bg-white"
                                  onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                  <a className="menu-hover text-sm font-light text-[#828282]">
                                    {selectedOption}
                                  </a>
                                  <span>
                                    <IoCaretDownSharp size={24} />
                                  </span>
                                </div>

                                {dropdownOpen && (
                                  <div className="absolute z-50 flex w-full flex-col bg-gray-100 px-4 py-1 text-gray-800 shadow-xl">
                                    <a
                                      className="my-2 block border-b border-gray-100 py-1 font-light text-gray-500 hover:text-black md:mx-2"
                                      onClick={() => {
                                        setSelectedOption('Instagram');
                                        setDropdownOpen(false);
                                      }}
                                    >
                                      {'Instagram'}
                                    </a>
                                    <a
                                      className="my-2 block border-b border-gray-100 py-1 font-light text-gray-500 hover:text-black md:mx-2"
                                      onClick={() => {
                                        setSelectedOption('Facebook');
                                        setDropdownOpen(false);
                                      }}
                                    >
                                      {'Facebook'}
                                    </a>
                                    <a
                                      className="my-2 block border-b border-gray-100 py-1 font-light text-gray-500 hover:text-black md:mx-2"
                                      onClick={() => {
                                        setSelectedOption('Conference');
                                        setDropdownOpen(false);
                                      }}
                                    >
                                      {'Conference'}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="my-4 w-full transform bg-color-text-secondary px-10 py-2 uppercase text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-800"
                            >
                              {'Submit'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <ul className="mb-4 flex flex-wrap justify-between max-sm:justify-start">
                        <li className="my-4 max-sm:my-1">
                          <a
                            href="#"
                            aria-label="INSTAGRAM"
                            target="_blank"
                            rel="noopener"
                            className="flex items-center rounded-md px-1 py-1 text-black transition hover:no-underline"
                          >
                            <motion.div
                              className="flex items-center justify-center max-sm:mt-7"
                              whileHover={{ rotateY: 180 }}
                              transition={{ duration: 0.6 }}
                            >
                              {' '}
                              <FiPhoneCall size={24} />{' '}
                            </motion.div>
                            <span className="ml-3 grid">
                              {'PHONE'}
                              <a className="text-[13px] font-normal text-[#1A439A]">
                                {'020 8004 9787'}
                              </a>
                            </span>
                          </a>
                        </li>
                        <li className="my-4 max-sm:my-1">
                          <a
                            href="#"
                            aria-label="LINKEDIN"
                            target="_blank"
                            rel="noopener"
                            className="flex items-center rounded-md px-1 py-1 text-black transition hover:no-underline"
                          >
                            <motion.div
                              className="flex items-center justify-center max-sm:mt-7"
                              whileHover={{ rotateY: 180 }}
                              transition={{ duration: 0.6 }}
                            >
                              {' '}
                              <LiaFaxSolid size={28} />{' '}
                            </motion.div>
                            <span className="ml-3 grid">
                              {'FAX'}
                              <a className="text-[13px] font-normal text-[#1A439A]">
                                {'03 5432 1234'}
                              </a>
                            </span>
                          </a>
                        </li>
                        <li className="my-4 max-sm:my-1">
                          <a
                            href="#"
                            aria-label="FACEBOOK"
                            target="_blank"
                            rel="noopener"
                            className="flex items-center rounded-md px-1 py-1 text-black transition hover:no-underline"
                          >
                            <motion.div
                              className="flex items-center justify-center max-sm:mt-7"
                              whileHover={{ rotateY: 180 }}
                              transition={{ duration: 0.6 }}
                            >
                              {' '}
                              <LiaEnvelopeOpenTextSolid size={26} />{' '}
                            </motion.div>
                            <span className="ml-3 grid">
                              {'EMAIL'}
                              <a className="text-[13px] font-normal text-[#1A439A]">
                                {'info@credit4business.co.uk'}
                              </a>
                            </span>
                          </a>
                        </li>
                      </ul>
                    </form>
                  </FormProvider>
                </motion.div>{' '}
              </div>
            </div>
            <div className="overflow-hidden max-sm:-mt-4 max-sm:w-full">
              <motion.div
                aria-hidden="true"
                className="mt-10 max-sm:order-1 lg:mt-0"
                initial="hidden"
                whileInView="visible"
                variants={slideUp}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11672.945750644447!2d-122.42107853750231!3d37.7730507907087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858070cc2fbd55%3A0xa71491d736f62d5c!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1619524992238!5m2!1sen!2sus"
                  width="100%"
                  height="600"
                  style={{ border: '0' }}
                  loading="lazy"
                ></iframe>
              </motion.div>{' '}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
