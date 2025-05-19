import { AiOutlineFundView, AiOutlineQuestionCircle } from 'react-icons/ai';
import { BsBriefcase } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { CiLock, CiMail, CiMobile3, CiPassport1 } from 'react-icons/ci';
import {
  FaGlobeEurope,
  FaRegWindowClose,
  FaSortAlphaDown
} from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';
import { GiCash, GiFallingRocks } from 'react-icons/gi';
import { GrDocumentPpt, GrNotes } from 'react-icons/gr';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { IoIosPerson, IoMdCash, IoMdLock } from 'react-icons/io';
import { IoDocumentsOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { LiaHandshake } from 'react-icons/lia';
import {
  LuClipboardList,
  LuHandHelping,
  LuUserCheck,
  LuUsers
} from 'react-icons/lu';
import {
  MdAccountBalance,
  MdCheckCircleOutline,
  MdCreditCard,
  MdEditCalendar,
  MdOutlineLocalOffer,
  MdOutlinePersonSearch,
  MdOutlineUploadFile,
  MdOutlineWebAsset
} from 'react-icons/md';
import { PiHandCoins } from 'react-icons/pi';
import { PiUserFocus } from 'react-icons/pi';
import {
  RiListSettingsFill,
  RiMoneyEuroBoxLine,
  RiUserFollowLine,
  RiUserLine,
  RiUserReceivedLine
} from 'react-icons/ri';
import { RiCommunityLine } from 'react-icons/ri';
import { RxDashboard } from 'react-icons/rx';
import {
  TbBell,
  TbUserCog,
  TbUserSearch,
  TbUserShield,
  TbUserStar
} from 'react-icons/tb';
import { TfiWrite } from 'react-icons/tfi';
import { TiGroupOutline } from 'react-icons/ti';

import addressbook from '../assets/svg/address-book.svg';
import amount from '../assets/svg/amout.svg';
import bank from '../assets/svg/bank.svg';
import bill from '../assets/svg/bill.svg';
import build from '../assets/svg/build.svg';
import clock from '../assets/svg/calender-clock.svg';
import camera from '../assets/svg/camera.svg';
import directory from '../assets/svg/directory.svg';
import duration from '../assets/svg/duration.svg';
import files from '../assets/svg/files.svg';
import identy from '../assets/svg/identy.svg';
import city from '../assets/svg/la_city.svg';
import company from '../assets/svg/mdi_company.svg';
import email from '../assets/svg/oui_email.svg';
import lock from '../assets/svg/passwordlock.svg';
import pin from '../assets/svg/pin.svg';
import home from '../assets/svg/solar_home-linear.svg';
import date from '../assets/svg/system-uicons_calendar-date.svg';
import bag from '../assets/svg/uit_bag.svg';
import user from '../assets/svg/user.svg';
import store from '../store/index';
import { Roles } from './enums';
import {
  CommonClassesInterface,
  CommonStyleConstant,
  FundingFormFieldType
} from './types';

const currentDate = new Date();

export const LoanWizardStages = [
  {
    id: 1,
    key: 'personalInformation',
    label: 'Personal Information',
    width: 'w-[120px]'
  },
  {
    id: 2,
    key: 'businessDetails',
    label: 'Business Details',
    width: 'w-[100px]'
  },
  {
    id: 3,
    key: 'businessPremiseDetails',
    label: 'Business Premise Details',
    width: 'w-[140px]'
  },
  {
    id: 4,
    key: 'directorOrProprietorDetails',
    label: 'Director or Proprietor Details',
    width: 'w-[170px]'
  },
  {
    id: 5,
    key: 'marketPreference',
    label: 'Market Preference',
    width: 'w-[110px]'
  },
  {
    id: 6,
    key: 'documentsUpload',
    label: 'Documents Upload',
    width: 'w-[110px]'
  },
  { id: 7, key: 'guarantor', label: 'Guarantor', width: 'w-[60px]' },
  {
    id: 8,
    key: 'identityVerification',
    label: 'Identity Verification',
    width: 'w-[120px]'
  },
  {
    id: 9,
    key: 'gocardless',
    label: 'GoCardless',
    width: 'w-[65px]'
  },
  {
    id: 10,
    key: 'affordability',
    label: 'Affordability',
    width: 'w-[80px]'
  },
  {
    id: 11,
    key: 'disbursementAdvice',
    label: 'Disbursement Advice',
    width: 'w-[130px]'
  },
  {
    id: 12,
    key: 'contract',
    label: 'Contract',
    width: 'w-[60px]'
  }
];

export const CustomertabsStages = [
  {
    id: 1,
    key: 'ContactDetails',
    label: 'Contact Details',
    width: 'w-[120px]'
  },
  {
    id: 2,
    key: 'PaymentDetails',
    label: 'Payment Details',
    width: 'w-[120px]'
  },
  {
    id: 3,
    key: 'PaymentHistory',
    label: 'Payment History',
    width: 'w-[120px]'
  },
  { id: 4, key: 'PhotoID', label: 'Photo ID', width: 'w-[90px]' },
  { id: 5, key: 'AddressProof', label: 'Address Proof', width: 'w-[100px]' }
];

export const contactUsInputFields: FundingFormFieldType[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your Name'
  },
  {
    name: 'company',
    label: 'Company',
    type: 'text',
    placeholder: 'Your company'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'johndoe@gmail.com'
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    rows: 4,
    placeholder: 'Your message'
  },
  {
    name: 'phone',
    label: 'Telephone',
    type: 'tel',
    placeholder: '+44 06 34 29 20 54'
  }
];

export const loginForm: FundingFormFieldType[] = [
  {
    name: 'username',
    // label: "Pincode",
    type: 'email',
    placeholder: 'Username',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'password',
    // label: "Address",
    type: 'password',
    placeholder: 'Password',
    icon: () => {
      return (
        <>
          <CiLock className="h-5 w-5 rtl:rotate-[270deg]" />
        </>
      );
    }
  },
  {
    name: 'remember_me',
    label: 'Remember me',
    type: 'checkbox',
    // placeholder: "Date of Birth",
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  }
];

export const changePasswordInputs: FundingFormFieldType[] = [
  {
    name: 'old_password',
    // label: "Address",
    type: 'password',
    placeholder: 'Old Password',
    icon: () => {
      return (
        <div className="w-6 text-gray-400">
          <img src={lock} />
        </div>
      );
    }
  },
  {
    name: 'new_password',
    // label: "Address",
    type: 'password',
    placeholder: 'New Password',
    icon: () => {
      return (
        <div className="w-6 text-gray-400">
          <img src={lock} />
        </div>
      );
    }
  },
  {
    name: 'confirm_password',
    // label: "Address",
    type: 'password',
    placeholder: 'Confirm Password',
    icon: () => {
      return (
        <div className="w-6 text-gray-400">
          <img src={lock} />
        </div>
      );
    }
  }
];

export const loanFormPersonalInformation: FundingFormFieldType[] = [
  {
    name: 'pincode',
    // label: "Pincode",
    isRequired: true,
    type: 'text',
    placeholder: 'Postcode',
    icon: () => {
      return (
        <div>
          <img src={pin} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </div>
      );
    }
  },
  {
    name: 'address',
    isRequired: true,
    type: 'textarea',
    placeholder: 'Address',
    rows: 3,
    isDisabled: true,
    icon: () => {
      return (
        <div>
          <img src={addressbook} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </div>
      );
    }
  },
  {
    name: 'email',
    isRequired: true,
    // label: "Email",
    type: 'email',
    placeholder: 'Email',
    icon: () => {
      return (
        <>
          <CiMail className="h-5 w-5 rtl:rotate-[270deg]" />
        </>
      );
    }
  },
  {
    name: 'is_major',
    isRequired: true,
    label: 'is user 18+',
    type: 'checkbox',
    // placeholder: "Date of Birth",
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    labelClass: ' text-[14px] ml-2 text-[#929292] mt-2',
    errorClass: 'text-red-500 text-[10px]  mb-2  ',
    fieldClass: 'text-[14px] text-[#929292] focus:outline-none p-2 mt-2',
    wrapperClass: `flex items-center 
    p-[10px]    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2 `
  },
  {
    name: 'phone_number',
    isRequired: true,
    // label: "Phone Number",
    type: 'tel',
    placeholder: 'Mobile Number',
    icon: () => {
      return (
        <div>
          <CiMobile3 className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'title',
    // label: "Title",
    isRequired: true,
    placeholder: 'Title',
    type: 'dropdown',
    options: ['Mr', 'Mrs', 'Miss'],
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'first_name',
    isRequired: true,
    type: 'text',
    placeholder: 'First Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'send',
    isRequired: true,
    type: 'text',
    placeholder: 'Send'
  },
  {
    name: 'last_name',
    isRequired: true,
    type: 'text',
    placeholder: 'Last Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'fund_request_amount',
    isRequired: true,
    // label: "Fund Request",
    type: 'number',
    placeholder: 'Amount you Need',
    icon: () => {
      return (
        <div className=" ">
          <img src={amount} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    },
    min: 0
  },
  {
    name: 'repayment_day_of_week',
    isRequired: true,
    placeholder: 'Repayment Day of week',
    type: 'dropdown',
    options: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
      // 'Custom'
    ],
    icon: () => {
      return (
        <div className="w-7 pr-2 text-gray-400">
          <img src={duration} />
        </div>
      );
    }
  },
  {
    name: 'fund_request_duration_weeks',
    isRequired: true,
    placeholder: 'Duration (In weeks)',
    type: 'number',
    icon: () => {
      return (
        <div>
          <img src={clock} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    },
    min: 5,
    max: 40
  },
  {
    name: 'agree_terms_and_conditions',
    isRequired: true,
    label: `I agree to
      
    Terms and Conditions 

      and authorize Credit4bussiness to contact me.`,
    type: 'checkbox'
  },
  {
    name: 'agree_communication_authorization',
    isRequired: true,
    label:
      'I agree to receive communications and authorize Credit4bussiness to contact me through SMS, Mail and Whatsapp.',
    type: 'checkbox'
  },
  {
    name: 'company.company_name',
    isRequired: true,
    type: 'text',
    placeholder: 'Your Company Name',
    icon: () => {
      return (
        <div>
          <img src={build} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'company.business_type',
    isRequired: true,
    placeholder: 'Business Type',
    type: 'dropdown',
    options: ['Limited Company', 'Limited Partnership', 'Sole Trader'],
    icon: () => {
      return (
        <>
          <BsBriefcase className="h-5 w-4 rtl:rotate-[270deg]" />
        </>
      );
    }
  },
  {
    name: 'company.trading_style',
    isRequired: true,
    type: 'text',
    placeholder: 'Your Trading Style',
    icon: () => {
      return (
        <div>
          <LiaHandshake className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'company.company_number',
    isRequired: true,
    type: 'text',
    placeholder: 'Your Company Number',
    icon: () => {
      return (
        <div>
          <img src={build} className="h-5 w-4 rtl:rotate-[270deg]" />{' '}
        </div>
      );
    }
  },
  {
    name: 'company.funding_purpose',
    isRequired: true,
    // label: "Funding Purpose",
    placeholder: 'Funding Purpose',
    type: 'dropdown',
    options: [
      'Hire Staff',
      'Management Buyout',
      'Marketing',
      'Moving premises',
      'Full-fill a order or contract',
      'Pay a due bill',
      'Pay HMRC',
      'Pay Staff',
      'Purchase Stock',
      'Purchase equipment',
      'Refinance Debt',
      'Upgrade Website',
      'Business Expansion',
      'Working Capital/Cash flow',
      'Other (please specify)'
    ],
    icon: () => {
      return (
        <div className=" ">
          <img src={amount} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'company.other_funding_purpose',
    isRequired: true,
    type: 'text',
    placeholder: 'Other Funding Purpose',
    icon: () => {
      return (
        <div>
          <img src={amount} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'mode_of_application',
    isRequired: true,
    label: 'Mode of application',
    type: 'radioButton',
    options: ['Self', 'Representative']
  },
  {
    name: 'agree_authorization',
    isRequired: true,
    label:
      'I hereby agree to authorize Representative name to collect the data and submit the application.',
    type: 'checkbox'
  },
  {
    name: 'is_pending_threatened_or_recently',
    isRequired: true,
    label:
      'I also Agree that there is no pending. threatened or recently field CCJ claims against me or my partners or guarantors. Iam also in no intention of selling the business/transferring my shares in the next 12 months. I have never been filed with a Bankruptcy or involuntary Arrangement by previous credits.',
    type: 'checkbox'
  },
  {
    name: 'representatives',
    // label: "Select the Representative",
    placeholder: 'Representative id',
    type: 'number'
  },
  {
    name: 'company.company_status',
    // label: "Select the Representative",
    // placeholder: "Enter The Representative Name",
    type: 'number'
  }
];

export const declarationCheckboxStyle: CommonClassesInterface = {
  labelClass: ' text-[11px]  font-normal  text-[#1A439A]',
  errorClass: ' text-red-500 text-[10px]  mb-2  ',
  fieldClass: ` text-blue-600 bg-gray-100 border-gray-300
focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2
dark:bg-gray-700 dark:border-gray-600 mr-2`,
  wrapperClass: 'flex items-center  my-2 '
};

export const loanFormBusinessDetails: FundingFormFieldType[] = [
  {
    type: 'dropdown',
    // label: "Business Type:",
    name: 'business_type',
    placeholder: 'Business Type',
    options: ['Limited Company', 'Limited Partnership', 'Sole Trader'],
    icon: () => {
      return (
        <>
          <img src={bag} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </>
      );
    }
  },
  {
    name: 'number_of_directors',
    type: 'number',
    placeholder: 'Number of Directors',
    icon: () => {
      return (
        <>
          <img src={directory} className="h-5 w-4 rtl:rotate-[270deg]" />
        </>
      );
    }
  },
  {
    type: 'radioButton',
    // label: "Business started trading?",
    name: 'has_started_trading',
    options: ['Yes', 'No'],
    optionLabelClass: `flex   justify-between  items-center text-[#929292]
     -ml-2 `
  },
  {
    type: 'date',
    // label: "When did your business start trading?",
    name: 'start_trading_date',
    excludeDateIntervals: [
      { start: currentDate, end: new Date(8640000000000000) }
    ],
    icon: () => {
      return (
        <div className="-ml-1 w-7 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    labelClass: 'flex text-[14px]  text-[#929292] mr-2'
  },
  {
    type: 'radioButton',
    // label: "In the last 12 months has your business been profitable?",
    name: 'is_profitable',
    options: ['Yes', 'No'],
    optionLabelClass: `flex   justify-between  items-center text-[#929292]
     -ml-2 `
  },
  {
    type: 'radioButton',
    // label: "Does your business accept card payment?",
    name: 'accepts_card_payment',
    options: ['Yes', 'No'],
    // icon: () => {
    //   return (
    //     <div className=" text-gray-400 pr-2  ">
    //       <img src={quest} />
    //     </div>
    //   );
    // },
    optionLabelClass: `flex   justify-between  items-center text-[#929292]
       -ml-2 `
  },
  {
    type: 'range',
    // label: "Average weekly card sales:",
    name: 'average_weekly_card_sales',
    min: 1000,
    max: 250000,
    showInput: true,
    isDecimal: true
  },
  {
    type: 'range',
    // label: "Average monthly total turnover:",
    name: 'average_monthly_turnover',
    min: 4000,
    max: 1000000,
    // icon: () => {
    //   return (
    //     <div className=" text-gray-400 pr-2 w-6 ">
    //       <img src={money} />
    //     </div>
    //   );
    // },
    showInput: true,
    isDecimal: true
  },
  {
    type: 'dropdown',
    // label: "Business Sector:",
    placeholder: 'Business Sector',
    name: 'business_sector',
    icon: () => {
      return (
        <div>
          <img
            src={bag}
            className="h-[18px] w-[18px] rtl:rotate-[270deg]"
          ></img>
        </div>
      );
    },
    options: [
      'Offlicense',
      'Restaurant',
      'Courier/Logistics',
      'Wholesaler/Distributor',
      'Convenience store',
      'Petrol Pump',
      'Car/vehicle service & sales',
      'Other business'
    ]
  },

  {
    type: 'text',

    placeholder: 'Other business opted',
    // label: "Name of business",
    name: 'other_business_name',
    icon: () => {
      return <AiOutlineQuestionCircle size={20} color="1A439A" />;
    }
  }
];

export const profileEditDetails: FundingFormFieldType[] = [
  {
    name: 'image',
    label: 'Profile Image',
    type: 'file'
  },
  {
    name: 'first_name',
    // label: "First Name",
    isRequired: true,
    type: 'text',
    placeholder: 'First Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },

  {
    name: 'last_name',
    // label: "Last Name",
    isRequired: true,
    type: 'text',
    placeholder: 'Last Name'
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Email Address'
  },
  {
    name: 'company_name',
    label: 'Company Name',
    type: 'text',
    placeholder: 'Company Name'
  },
  {
    name: 'date_of_birth',
    type: 'date',
    placeholder: 'Date of Birth',
    isRequired: true,
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    }
  },
  {
    name: 'number',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Phone Number',
    icon: () => {
      return (
        <div>
          <CiMobile3 className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'address',
    type: 'textarea',
    label: 'Address',
    rows: 3,
    placeholder: 'Address'
  },
  {
    name: 'description',
    type: 'textarea',
    rows: 3,
    label: 'Description',
    placeholder: 'Description'
  },
  {
    name: 'credit_score',
    type: 'number',
    label: 'Credit Score',
    placeholder: 'Credit Score'
  },
  {
    name: 'risk_score',
    type: 'number',
    label: 'Risk Score',
    placeholder: 'Risk Score'
  }
];

export const unitProfileEditDetails: FundingFormFieldType[] = [
  {
    name: 'id',
    label: 'Contract ID',
    type: 'text',
    placeholder: 'Contract ID',
    isRequired: true
  },
  {
    name: 'company_name',
    label: 'Company Name',
    type: 'text',
    placeholder: 'Company Name',
    isRequired: true
  },
  {
    name: 'last_name',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Last Name',
    isRequired: true
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Phone Number',
    isRequired: true,
    icon: () => {
      return (
        <div>
          <CiMobile3 className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'company_status',
    label: 'Company Status',
    type: 'text',
    placeholder: 'Company Status',
    isRequired: true
  },
  {
    name: 'customer',
    label: 'Customer',
    type: 'text',
    placeholder: 'Customer'
  },
  {
    name: 'business_type',
    label: 'Business Type',
    type: 'text',
    placeholder: 'Business Type',
    isRequired: true
  },
  {
    name: 'funding_purpose',
    label: 'Funding Purpose',
    type: 'text',
    placeholder: 'Funding Purpose',
    isRequired: true
  },
  {
    name: 'trading_style',
    label: 'Trading Style',
    type: 'text',
    placeholder: 'Trading Style',
    isRequired: true
  },
  {
    name: 'company_number',
    label: 'Company Number',
    type: 'text',
    placeholder: 'Company Number',
    isRequired: true
  },
  {
    name: 'other_funding_purpose',
    label: 'Other Funding Purpose',
    type: 'text',
    placeholder: 'Other Funding Purpose'
  }
];

export const manageFieldAgent: FundingFormFieldType[] = [
  {
    name: 'title',
    // label: "Title",
    placeholder: 'Title',
    isRequired: true,
    type: 'dropdown',
    options: ['Mr', 'Mrs', 'Miss'],
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'first_name',
    type: 'text',
    isRequired: true,
    placeholder: 'First Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },

  {
    name: 'last_name',
    // label: "Last Name",
    isRequired: true,
    type: 'text',
    placeholder: 'Last Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'email',
    isRequired: true,
    type: 'email',
    placeholder: 'Email',
    icon: () => {
      return (
        <>
          <img src={email} className="h-5 w-4 rtl:rotate-[270deg]" />
        </>
      );
    }
  },
  {
    name: 'description',
    type: 'textarea',
    rows: 3,
    placeholder: 'Description',
    icon: () => {
      return (
        <div className="mb-1">
          <img src={addressbook} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </div>
      );
    }
  },
  {
    name: 'address',
    type: 'textarea',
    placeholder: 'Address',
    rows: 3,
    icon: () => {
      return (
        <div className="w-7 pr-2 text-gray-400">
          <img src={city} />
        </div>
      );
    }
  },
  {
    name: 'phone_number',
    // label: "Phone Number",
    isRequired: true,
    type: 'tel',
    placeholder: 'Mobile Number',
    icon: () => {
      return (
        <div>
          <CiMobile3 className="-ml-1 h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
    //   wrapperClass: `flex
    //  pb-2   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`,
  }
];

export const manageManageFinanceManager: FundingFormFieldType[] = [
  {
    name: 'title',
    // label: "Title",
    placeholder: 'Title',
    isRequired: true,
    type: 'dropdown',
    options: ['Mr', 'Mrs', 'Miss'],
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'first_name',
    type: 'text',
    isRequired: true,
    placeholder: 'First Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },

  {
    name: 'last_name',
    // label: "Last Name",
    isRequired: true,
    type: 'text',
    placeholder: 'Last Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'email',
    isRequired: true,
    type: 'email',
    placeholder: 'Email',
    icon: () => {
      return (
        <>
          <img src={email} className="h-5 w-4 rtl:rotate-[270deg]" />
        </>
      );
    }
  },
  {
    name: 'description',
    type: 'textarea',
    rows: 3,
    placeholder: 'Description',
    icon: () => {
      return (
        <div className="mb-1">
          <img src={addressbook} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </div>
      );
    }
  },
  {
    name: 'address',
    type: 'textarea',
    placeholder: 'Address',
    rows: 3,
    icon: () => {
      return (
        <div className="w-7 pr-2 text-gray-400">
          <img src={city} />
        </div>
      );
    }
  },
  {
    name: 'phone_number',
    // label: "Phone Number",
    isRequired: true,
    type: 'tel',
    placeholder: 'Mobile Number',
    icon: () => {
      return (
        <div>
          <CiMobile3 className="-ml-1 h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
    //   wrapperClass: `flex
    //  pb-2   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`,
  }
];

export const manageunderWriter: FundingFormFieldType[] = [
  {
    name: 'title',
    placeholder: 'Title',
    isRequired: true,
    type: 'dropdown',
    options: ['Mr', 'Mrs', 'Miss'],
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={user} />
        </div>
      );
    }
  },
  {
    name: 'first_name',
    type: 'text',
    isRequired: true,
    placeholder: 'First Name',
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={user} />
        </div>
      );
    }
  },
  {
    name: 'last_name',
    isRequired: true,
    type: 'text',
    placeholder: 'Last Name'
  },
  {
    name: 'email',
    isRequired: true,
    type: 'email',
    placeholder: 'Email',
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={email} />
        </div>
      );
    }
  },
  {
    name: 'description',
    type: 'textarea',
    rows: 3,
    placeholder: 'Description'
  },
  {
    name: 'address',
    type: 'textarea',
    placeholder: 'Address',
    rows: 3,
    icon: () => {
      return (
        <div className="w-7 pr-2 text-gray-400">
          <img src={city} />
        </div>
      );
    }
  },
  {
    name: 'phone_number',
    isRequired: true,
    type: 'tel',
    placeholder: 'Mobile Number',
    icon: () => {
      return (
        <div>
          <CiMobile3 className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    },
    wrapperClass: `flex pb-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`
  },
  {
    name: 'assigned_manager',
    isRequired: true,
    type: 'dropdown',
    placeholder: 'Manager',
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={user} />
        </div>
      );
    }
  },
  {
    name: 'date_of_birth',
    type: 'date',
    placeholder: 'Date of Birth',
    isRequired: true,
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    }
  },
  {
    name: 'image',
    type: 'file',
    placeholder: 'Upload Image',
    isRequired: false,
    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          {/* <img src={uploadIcon} /> */}
        </div>
      );
    }
  }
];

export const manageLead: FundingFormFieldType[] = [
  {
    name: 'email',
    // label: "Email",
    type: 'email',
    isRequired: true,
    placeholder: 'Email',
    icon: () => {
      return (
        <div>
          <img src={email} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },

  {
    name: 'phone_number',
    // label: "Phone Number",
    type: 'tel',
    isRequired: true,
    placeholder: 'Mobile Number',
    icon: () => {
      return (
        <div>
          <CiMobile3 className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  }
];

export const referalformDetails: FundingFormFieldType[] = [
  {
    name: 'title',
    // label: "Title",
    isRequired: true,
    placeholder: 'Title',
    type: 'dropdown',
    options: ['Mr', 'Mrs', 'Miss'],
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'first_name',
    // label: "First Name",
    isRequired: true,
    type: 'text',
    placeholder: 'First Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },

  {
    name: 'last_name',
    // label: "Last Name",
    isRequired: true,
    type: 'text',
    placeholder: 'Last Name',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'email',
    // label: "Email",
    isRequired: true,
    type: 'email',
    placeholder: 'Email',
    icon: () => {
      return (
        <>
          <img src={email} className="h-4 w-4 rtl:rotate-[270deg]" />
        </>
      );
    }
  },
  {
    name: 'phone_number',
    // label: "Phone Number",
    isRequired: true,
    type: 'tel',
    placeholder: 'Mobile Number',
    icon: () => {
      return (
        <div>
          <CiMobile3 className="-ml-1 h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'business_name',
    // label: "Business Type",
    placeholder: 'Business Name',
    isRequired: true,
    type: 'text',

    icon: () => {
      return (
        <div>
          <img src={bag} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },

  {
    name: 'bank_details.account_holder_name',
    // label: "Business Type",
    placeholder: 'Account Holder Name',
    isRequired: true,
    type: 'text',

    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={bag} />
        </div>
      );
    }
  },
  {
    name: 'bank_details.account_number',
    // label: "Business Type",
    placeholder: 'Account Number',
    isRequired: true,
    type: 'text',

    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={bag} />
        </div>
      );
    }
  },
  {
    name: 'bank_details.sort_code',
    // label: "Business Type",
    placeholder: 'Sort Code',
    isRequired: true,
    type: 'text',

    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={bag} />
        </div>
      );
    }
  },
  {
    name: 'bank_details.bank_name',
    // label: "Business Type",
    placeholder: 'Bank Name',
    isRequired: true,
    type: 'text',

    icon: () => {
      return (
        <div className="w-6 pr-2 text-gray-400">
          <img src={bag} />
        </div>
      );
    }
  }
];

export const assignFieldAgentformFields: FundingFormFieldType[] = [
  {
    name: 'field_agent_id',
    // label: "Title",
    placeholder: 'Field Agent',
    type: 'dropdown',
    icon: () => {
      return (
        <div>
          <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  }
];

export const BusinessDetailTabModalDetails: FundingFormFieldType[] = [
  {
    type: 'dropdown',
    // label: "Business Type:",
    name: 'businessType',
    placeholder: 'Business Type',
    options: [
      'Corporation',
      'Limited Company',
      'Limited Partnership',
      'Sole Trader'
    ]
    // icon: () => {
    //   return (
    //     <div className=" text-gray-400 pr-2 w-6 ">
    //       <img src={bag} />
    //     </div>
    //   );
    // },
  },
  {
    name: 'numberofDirectors',
    // label: "Number of Directors",
    type: 'number',
    placeholder: 'Number of Directors'
    // icon: () => {
    //   return (
    //     <div className=" text-gray-400 pr-2 w-4 ">
    //       <img src={directory} />
    //     </div>
    //   );
    // },
  },

  {
    type: 'text',
    label: 'Has your business started trading?',
    name: 'businessStartedTrading',

    // icon: () => {
    //   return (
    //     <div className=" text-gray-400 pr-2 w-6 ">
    //       <img src={quest} />
    //     </div>
    //   );
    // },
    labelClass: ' text-[12px]  text-[#929292] ',
    wrapperClass:
      ' mb-4 text-[12px] max-sm:text-[8px]  w-full border-b-2 focus:outline-none focus:border-color-text-secondary pb-4 ',
    fieldClass: 'mt-4  focus:outline-none font-medium'
  },
  {
    type: 'date',
    label: 'When did your business start trading?',
    name: 'startTradingDate',
    // icon: () => {
    //   return (
    //     <div className=" text-gray-400 pr-2 w-6 ">
    //       <img src={date} />
    //     </div>
    //   );
    // },
    labelClass: ' text-[12px]  text-[#929292]  ',
    wrapperClass:
      ' mb-4 text-[12px] max-sm:text-[8px]  w-full border-b-2 focus:outline-none focus:border-color-text-secondary pb-4 ',
    fieldClass: 'mt-4  focus:outline-none font-medium'
  },
  {
    type: 'text',
    label: 'In the last 12 months has your business been profitable?',
    name: 'profitableLast12Months',
    // options: ["Yes", "No"],
    // icon: () => {
    //   return (
    //     <div className=" text-gray-400 pr-2 w-6 ">
    //       <img src={quest} />
    //     </div>
    //   );
    // },
    labelClass: ' text-[12px]  text-[#929292] ',
    wrapperClass:
      ' mb-4 text-[12px] max-sm:text-[8px]  w-full border-b-2 focus:outline-none focus:border-color-text-secondary pb-4 ',
    fieldClass: 'mt-4  focus:outline-none font-medium'
  }
];

export const loginFormCommonStyleConstant: CommonStyleConstant = {
  email: {
    labelClass: 'mb-2 text-[12px]  ',
    errorClass: 'text-red-500 text-[10px]  mb-2  ',
    fieldClass: 'text-[12px] text-[#929292] focus:outline-none p-2',
    wrapperClass: `flex items-center 
    pb-2   mb-4  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`
  },
  password: {
    labelClass: 'mb-2 text-[12px]   ',
    errorClass: 'text-red-500 text-[10px]   mb-2  ',
    fieldClass: 'text-[12px] text-[#929292] focus:outline-none p-2',
    wrapperClass: `flex items-center 
     mb-4 py-2 pt-2   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`
  }
};

export const manageUserFormCommonStyleConstant: CommonStyleConstant = {
  text: {
    labelClass: ' text-[12px]  ',
    errorClass: 'text-red-500 text-[10px] mt-2   ',
    fieldClass: ' text-[12px] text-[#929292] focus:outline-none  ',
    wrapperClass: `flex items-center 
     mb-2 py-2 pt-2   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2  w-full`
  },

  email: {
    labelClass: 'mb-2 text-[12px]  ',
    errorClass: 'text-red-500 text-[10px]  mt-2  ',
    fieldClass: ' text-[12px] text-[#929292] focus:outline-none  ',
    wrapperClass: `flex items-center 
    pb-2  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2  w-full`
  },
  password: {
    labelClass: 'mb-2 text-[12px]  ',
    errorClass: 'text-red-500 text-[10px]  mb-2  ',
    fieldClass: ' text-[12px] text-[#929292] focus:outline-none  ',
    wrapperClass: `flex items-center 
    pb-2   mb-4  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`
  },
  range: {
    labelClass: 'mb-2  text-[12px] text-[#929292]',
    errorClass: 'text-red-500 text-[10px]  mb-2  ',
    fieldClass: `text-[12px] text-[#929292] w-full h-[2px] my-2 rounded-lg 
   appearance-none cursor-pointer range-sm bg-[#929292]`,
    wrapperClass: `grid items-center 
    pb-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-[12px] text-[#929292] `
  },
  textarea: {
    labelClass: 'mb-2 text-[12px] ',
    errorClass: 'text-red-500 text-[10px]  mb-2 ',
    fieldClass:
      ' text-[12px] text-[#929292] focus:outline-none  w-full resize-none ',
    wrapperClass: `flex 
    mb-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`
  },
  tel: {
    labelClass: 'mb-2 text-[12px]   ',
    errorClass: 'text-red-500 text-[10px]  mt-2  ',
    fieldClass: ' text-[12px] text-[#929292] focus:outline-none  ',
    wrapperClass: `flex items-center 
    mb-1  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2  mt-1`
  },
  number: {
    labelClass: 'mb-2 text-[12px] text-[#929292]',
    errorClass: 'text-red-500 text-[10px]    ',
    fieldClass: ' ml-2 text-[12px] text-[#929292] focus:outline-none  ',
    wrapperClass: `flex items-center 
    py-2   mb-4  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2 `
  },

  dropdown: {
    labelClass: 'text-[12px]  ',
    errorClass: 'text-red-500 text-[10px]  ',
    fieldClass: ' text-[12px] text-[#929292] focus:outline-none ',
    wrapperClass: `flex 
    mb-1 py-2  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`
  },

  checkbox: {
    labelClass: 'ml-2 ',
    errorClass: 'text-red-500 text-[10px]    ',
    fieldClass: 'border p-2',
    wrapperClass: 'flex items-center text-[#929292]  mt-8'
  },
  radioButton: {
    labelClass: `flex mb-2 text-[12px] text-[#929292]  `,
    errorClass: 'text-red-500 text-[10px]   ',
    fieldClass: 'flex mr-4 gap-4 text-[12px]   ',
    wrapperClass: 'flex  mb-2 border-b-2 ',
    optionLabelClass:
      'flex mb-4  justify-between  items-center text-[#929292]  ml-2 '
  },
  file: {
    labelClass: 'mb-2 ',
    errorClass: 'text-red-500 text-[10px]  mb-2 ',
    fieldClass: 'mr-4',
    wrapperClass: 'flex mb-4 justify-center items-center mb-2 hidden '
  },
  multiCheckbox: {
    labelClass: '  text-[12px]  text-[#929292] flex gap-2 py-3 ',
    errorClass: 'text-red-500 text-[10px] ',
    fieldClass: 'border p-2 py mr-2',
    wrapperClass: ' mb-4 flex flex-wrap  border-b-2 mt-4',
    optionLabelClass: 'text-black  text-[12px]  py-2 my-1'
  },
  date: {
    labelClass: 'flex text-[12px]  text-[#929292] pt-1 mr-2',
    errorClass: 'text-red-500 text-[10px]   mb-2  mt-2',
    fieldClass: ' text-[12px] text-[#929292] focus:outline-none  ',
    wrapperClass: `flex  
    pb-2   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-b-2`
  }
};

// export const loanFormCommonStyleConstant: CommonStyleConstant = {
//   text: {
//     labelClass: "mb-2 text-[14px]  text-[#929292] ml-4",
//     errorClass: "text-red-500 text-[10px]  mb-2  ",
//     fieldClass:
//       " flex items-center p-[6px] border-2 rounded h-[44px]  w-full resize-none",
//     wrapperClass: `flex items-center p-[6px] border-2 rounded h-[50px] w-[340px]
//     `,
//   },

//   email: {
//     labelClass: "mb-2 text-[14px]  text-[#929292]",
//     errorClass: "text-red-500 text-[10px]  mb-2  ",
//     fieldClass: " flex items-center p-[6px] border-2 rounded h-[44px]  w-full ",
//     wrapperClass: `flex items-center p-[6px]  focus:outline-none
//     focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-2 rounded
//     `,
//   },
//   password: {
//     labelClass: "mb-2 text-[14px]  text-[#929292]",
//     errorClass: "text-red-500 text-[10px]  mb-2  ",
//     fieldClass:
//       " flex items-center p-[6px] border-2 rounded h-[44px]  w-full resize-none",
//     wrapperClass: `flex items-center p-[6px] border-2 rounded h-[50px] w-[340px]
//     `,
//   },
//   range: {
//     labelClass: "mb-2  text-[14px] text-[#929292]",
//     errorClass: "text-red-500 text-[10px]  mb-2  ",
//     fieldClass: `text-[12px] text-[#929292] w-full h-[2px] my-2
//     rounded-lg
//    appearance-none cursor-pointer range-sm bg-[#929292]`,
//     wrapperClass: `grid items-center
//     pb-2 focus:outline-none focus:ring-2 focus:ring-red-500
//      focus:ring-offset-2 text-[12px] text-[#929292] `,
//   },
//   textarea: {
//     labelClass: "mb-2 text-[14px] ",
//     errorClass: "text-red-500 text-[10px]  mb-2 ",
//     fieldClass:
//       " flex items-center p-[6px] border-2 rounded  w-full resize-none ",
//     wrapperClass: `flex items-start p-[10px]  focus:outline-none
//     focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-2 rounded
//     `,
//   },
//   tel: {
//     labelClass: "mb-2 text-[14px]  text-[#929292]",
//     errorClass: "text-red-500 text-[10px]  mb-2  ",
//     fieldClass: " flex items-center p-[6px] border-2 rounded h-[44px]  w-full",
//     wrapperClass: `flex items-center p-[6px]  focus:outline-none
//     focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-2 rounded
//     `,
//   },
//   number: {
//     labelClass: "mb-2 text-[14px]  text-[#929292]",
//     errorClass: "text-red-500 text-[10px]  mb-2  ",
//     fieldClass: " flex items-center p-[6px] border-2 rounded h-[44px]  w-full",
//     wrapperClass: `flex items-center p-[6px]  focus:outline-none
//     focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-2 rounded
//     `,
//   },

//   dropdown: {
//     labelClass: "text-[14px]  ",
//     errorClass: "text-red-500 text-[10px]  mb-2 ",
//     fieldClass: " flex items-center border-2 rounded h-[44px] w-full",
//     wrapperClass: `flex
//     p-[10px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-2 rounded`,
//   },

//   checkbox: {
//     labelClass: "ml-2 text-[12.5px]  ",
//     errorClass: "text-red-500 text-[10px]    ",
//     fieldClass: "border p-2",
//     wrapperClass: "flex items-center text-red  mt-8 ",
//   },
//   radioButton: {
//     labelClass: `flex mb-2 text-[14px] text-[#929292] px-[10px] mt-2 `,
//     errorClass: "text-red-500 text-[10px]   ",
//     fieldClass: "flex mr-4 gap-4 text-[14px]  ",
//     wrapperClass: "flex    ",
//     optionLabelClass: `flex   justify-between  items-center text-[#929292]
//         ml-2 `,
//   },
//   file: {
//     labelClass: "mb-2 ",
//     errorClass: "text-red-500 text-[10px]  mb-2 ",
//     fieldClass: "mr-4",
//     wrapperClass: "flex mb-4 justify-center items-center mb-2 hidden ",
//   },
//   multiCheckbox: {
//     labelClass: "  text-[12px]  text-[#929292] flex gap-2 py-3 ",
//     errorClass: "text-red-500 text-[10px] ",
//     fieldClass: "border p-2 py mr-2",
//     wrapperClass: " mb-4 flex flex-wrap  border-b-2 mt-4",
//     optionLabelClass: "text-black  text-[12px]  py-2 my-1",
//   },
//   date: {
//     labelClass: "mb-2 text-[14px]  text-[#929292]",
//     errorClass: "text-red-500 text-[10px]  mb-2  ",
//     fieldClass:
//       " flex items-center p-[6px] border-2 rounded h-[44px]  w-full resize-none pl-10",
//     wrapperClass: ``,
//   },
// };

export const loanFormCommonStyleConstant: CommonStyleConstant = {
  text: {
    labelClass: ` -top-3 absolute cursor-text text-sm text-gray-500  start-8 mt-1 
         bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
          peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all `,
    errorClass: 'text-red-500 text-[10px]  my-1  ',
    fieldClass: `peer bg-transparent h-12 w-full rounded-lg 
        text-black  placeholder-transparent  px-8 
         focus:outline-none focus:border-gray-500 border border-stone-300
                        `
  },

  email: {
    labelClass: `-top-3 absolute cursor-text text-sm text-gray-500  start-8 mt-1 
    bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
     peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all `,
    errorClass: 'text-red-500 text-[10px]  my-1  ',
    fieldClass: `peer bg-transparent h-12 w-full rounded-lg 
   text-black  placeholder-transparent  px-8 
    focus:outline-none focus:border-gray-500 border border-stone-300
                   `
  },
  password: {
    labelClass: ` -top-3 absolute cursor-text text-sm text-gray-500  start-8 mt-1 
    bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
     peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all `,
    errorClass: 'text-red-500 text-[10px]  my-1  ',
    fieldClass: `peer bg-transparent h-12 w-full rounded-lg 
   text-black  placeholder-transparent  px-8 
    focus:outline-none focus:border-gray-500 border border-stone-300
                   `
  },
  range: {
    labelClass: '  text-[14px] text-[#929292]',
    errorClass: 'text-red-500 text-[10px]  mb-2  ',
    fieldClass: `text-[12px] text-[#929292] w-full h-[2px] my-2 
    rounded-lg 
   appearance-none cursor-pointer range-sm bg-[#929292]`,
    wrapperClass: `grid items-center 
    pb-2 focus:outline-none focus:ring-2 focus:ring-red-500
     focus:ring-offset-2 text-[12px] text-[#929292] px-2 `
  },
  textarea: {
    labelClass: `absolute cursor-text  start-8 -top-3 text-sm
             text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
          peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all `,
    errorClass: 'text-red-500 text-[10px]  my-1  ',
    fieldClass: `peer bg-transparent
              w-full rounded-lg  text-black  placeholder-transparent
               px-8 pt-2
         focus:outline-none focus:border-gray-500 border border-stone-300 resize-none `
  },
  tel: {
    labelClass: ` -top-3 absolute cursor-text text-sm text-gray-500  start-8 mt-1 
    bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
     peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all `,
    errorClass: 'text-red-500 text-[10px]  my-1  ',
    fieldClass: `peer bg-transparent h-12 w-full rounded-lg 
   text-black  placeholder-transparent  px-8 
    focus:outline-none focus:border-gray-500 border border-stone-300
                   `
  },
  number: {
    labelClass: `-top-3 absolute cursor-text text-sm text-gray-500  start-8 mt-1 
    bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
     peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all `,
    errorClass: 'text-red-500 text-[10px]  my-1  ',
    fieldClass: `peer bg-transparent h-12 w-full rounded-lg 
   text-black  placeholder-transparent  px-8 
    focus:outline-none focus:border-gray-500 border border-stone-300
                   `
  },

  dropdown: {
    labelClass: `absolute cursor-text text-[16px] text-gray-500 start-8 mt-1 
               bg-inherit mx-1 px-1 transition-all duration-200 ease-in-out`,
    errorClass: 'text-red-500 text-[10px]  my-1 ',
    fieldClass: `peer bg-transparent h-12 w-full rounded-lg text-black placeholder-transparent  
              focus:outline-none focus:border-gray-500 border border-stone-300 px-2`
  },

  checkbox: {
    labelClass: 'ml-2 text-[12.5px]   ',
    errorClass: 'text-red-500 text-[10px]    ',
    fieldClass: 'border p-2',
    wrapperClass: 'flex items-center text-red  mt-8  '
  },
  radioButton: {
    labelClass: `flex mb-2 text-[14px] text-[#929292] px-[10px] mt-2 `,
    errorClass: 'text-red-500 text-[10px]   ',
    fieldClass:
      'flex mr-4 gap-2 text-[13px] max-sm:text-[8.5px]  font-medium text-[#2C2C2E] ',
    wrapperClass: 'flex    ',
    optionLabelClass: `flex   justify-between  items-center 
        ml-2 `
  },
  file: {
    labelClass: 'mb-2 ',
    errorClass: 'text-red-500 text-[10px]  mb-2 ',
    fieldClass: 'mr-4',
    wrapperClass: 'flex mb-4 justify-center items-center mb-2 hidden '
  },
  multiCheckbox: {
    labelClass:
      '  text-[14px] max-sm:text-[10px]  font-medium text-[#2C2C2E] flex gap-2 py-3 ',
    errorClass: 'text-red-500 text-[10px] ',
    fieldClass: 'border p-2 py mr-2',
    wrapperClass: 'flex flex-wrap  ',
    optionLabelClass:
      'text-black  text-[12.5px] max-sm:text-[8.5px]  font-medium'
  },
  date: {
    labelClass: ` -top-3 absolute cursor-text text-sm text-gray-500  start-8 mt-1 
    bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
     peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all `,
    errorClass: 'text-red-500 text-[10px]  my-1  ',
    fieldClass: `peer bg-transparent h-12  w-full rounded-lg 
   text-black  placeholder-transparent  px-8 
    focus:outline-none focus:border-gray-500 border border-stone-200
                   `
  }
};

export const contactUsStyleConstant: CommonStyleConstant = {
  text: {
    labelClass: 'mb-2 max-sm:text-[12px] text-[16px]',
    errorClass: 'text-red-500 text-[10px]   mb-2  ',
    fieldClass:
      'mt-1 lg:p-2 w-full border-b focus:outline-none focus:border-color-text-secondary',
    wrapperClass: 'flex flex-col mb-4 text-[12px] max-sm:text-[8px] '
  },
  email: {
    labelClass: 'mb-2 max-sm:text-[12px] text-[16px]',
    errorClass: 'text-red-500 text-[10px]   mb-2  ',
    fieldClass:
      'mt-1 lg:p-2 w-full border-b focus:outline-none focus:border-color-text-secondary',
    wrapperClass: 'flex flex-col mb-4 text-[12px] max-sm:text-[8px] '
  },
  textarea: {
    labelClass: 'mb-2 max-sm:text-[12px] text-[16px] ',
    errorClass: 'text-red-500 text-[10px]   mb-2  ',
    fieldClass:
      'mt-1 lg:p-2 w-full border-b focus:outline-none focus:border-color-text-secondary ',
    wrapperClass: 'flex flex-col mb-4 text-[12px] max-sm:text-[8px]   '
  },
  tel: {
    labelClass: 'mb-2 max-sm:text-[12px] text-[16px]',
    errorClass: 'text-red-500 text-[10px]   mb-2  ',
    fieldClass:
      'mt-1 lg:p-2 w-full border-b focus:outline-none focus:border-color-text-secondary',
    wrapperClass: 'flex flex-col mb-4 text-[12px] max-sm:text-[8px]  '
  },
  number: {
    labelClass: 'mb-2 max-sm:text-[12px] text-[16px]',
    errorClass: 'text-red-500',
    fieldClass: 'border p-2',
    wrapperClass: 'flex flex-col mb-4'
  },
  dropdown: {
    labelClass: 'mb-2',
    errorClass: 'text-red-500',
    fieldClass: 'border p-2',
    wrapperClass: 'flex flex-col mb-4'
  },
  checkbox: {
    labelClass: 'mb-2',
    errorClass: 'text-red-500',
    fieldClass: 'border p-2',
    wrapperClass: 'flex mb-4 '
  },
  radioButton: {
    labelClass: 'mb-2',
    errorClass: 'text-red-500',
    fieldClass: 'mr-4',
    wrapperClass: 'flex mb-4'
  }
};

export const loanFormBusinessPremiseDetails: FundingFormFieldType[] = [
  {
    name: 'trading_address.address_line',
    // label: "Address line 1",
    type: 'textarea',
    isDisabled: true,
    rows: 3,
    placeholder: 'Address line*',
    icon: () => {
      return (
        <>
          <img src={home} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </>
      );
    }
  },
  {
    name: 'trading_address.town_city',
    // label: "Town city*",
    type: 'text',
    placeholder: 'Town city*',
    icon: () => {
      return (
        <>
          <img src={company} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </>
      );
    }
  },
  {
    name: 'trading_address.post_code', // from api
    // label: "Post code",

    type: 'dropdown',
    options: ['674656', '674657', '674658'],
    icon: () => {
      return (
        <>
          <img src={pin} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </>
      );
    }
  },
  {
    name: 'trading_address.premise_type',
    // label: "Premise Type",
    placeholder: 'Premise Type',
    type: 'dropdown',
    options: ['Freehold', 'Leasehold', 'Registered Lease'],
    icon: () => {
      return (
        <div className="mb-1">
          <img src={addressbook} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </div>
      );
    }
  },
  {
    name: 'trading_address.start_date',
    label: 'Start Date',
    placeholder: 'Start Date',
    type: 'date',
    icon: () => {
      return (
        <div className="-ml-1 w-7 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    }
  },
  {
    name: 'trading_address.end_date',
    label: 'End Date',
    placeholder: 'End Date',
    type: 'date',
    icon: () => {
      return (
        <div className="-ml-1 w-7 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    }
  },
  {
    name: 'trading_address.document',
    // label: "Address File Upload",
    type: 'file',
    isMultiple: false,
    isRequired: true,
    memTypes:
      'image/jpg, image/gif, image/png, image/jpeg, image/svg+xml, image/webp, application/pdf',
    icon: () => {
      return (
        <CiPassport1 color="#929292" className="h-4 w-4 rtl:rotate-[270deg]" />
      );
    }
  },
  {
    name: 'trading_same_as_registered',
    label: 'Trading Same As Registered',
    type: 'checkbox'
  },
  {
    name: 'registered_address.address_line',
    // label: "Address line 1",
    type: 'textarea',
    isDisabled: true,
    rows: 3,
    placeholder: 'Address line*',
    icon: () => {
      return (
        <>
          <img src={home} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </>
      );
    }
  },
  {
    name: 'registered_address.town_city',
    // label: "Town city",
    type: 'text',
    placeholder: 'Town city*',
    icon: () => {
      return (
        <>
          <img src={company} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </>
      );
    }
  },
  {
    name: 'registered_address.post_code', // from api
    // label: "Post code",
    type: 'dropdown',
    options: ['674656', '674657', '674658'],
    icon: () => {
      return (
        <>
          <img src={pin} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </>
      );
    }
  },
  {
    name: 'registered_address.premise_type',
    // label: "Premise Type",
    placeholder: 'Premise Type',
    type: 'dropdown',
    options: ['Freehold', 'Leasehold', 'Registered Lease'],
    icon: () => {
      return (
        <div className="mb-1">
          <img src={addressbook} className="h-4 w-4 rtl:rotate-[270deg]"></img>
        </div>
      );
    }
  },
  {
    name: 'registered_address.start_date',
    placeholder: 'Start Date',
    label: 'Start date',
    icon: () => {
      return (
        <div className="-ml-1 w-7 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    type: 'date'
  },
  {
    name: 'registered_address.end_date',
    placeholder: 'End Date',
    label: 'End Date',
    type: 'date',
    icon: () => {
      return (
        <div className="-ml-1 w-7 pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    }
  },
  {
    name: 'registered_address.document',
    // label: "Address File Upload",
    type: 'file',
    isMultiple: false,
    isRequired: true,
    memTypes:
      'image/jpg, image/gif, image/png, image/jpeg, image/svg+xml, image/webp, application/pdf,',
    icon: () => {
      return (
        <CiPassport1 color="#929292" className="h-4 w-4 rtl:rotate-[270deg]" />
      );
    }
  }
];

export const loanFormDirectorOrProprietorDetails: FundingFormFieldType[] = [];

export const loanFormMarketingPreferences: FundingFormFieldType[] = [
  {
    name: 'receiving_marketing_info',
    label: `I consent to receiving marketing information form credit4business
    Funding and its trading group of companies on products related to my
    current product by:`,
    type: 'multiCheckbox',
    icon: () => {
      return (
        <>
          <AiOutlineQuestionCircle size={28} color="1A439A" />
        </>
      );
    },
    labelClass:
      '  text-[15px] max-sm:text-[10px]  font-medium text-[#2C2C2E] flex gap-2 py-3 ',
    options: [
      { key: 'email', label: 'Email' },
      { key: 'post', label: 'Post' },
      { key: 'sms', label: 'SMS' },
      {
        key: 'social_media',
        label: 'Social Media'
      },
      {
        key: 'telephone',
        label: 'Telephone'
      }
    ]
  },

  {
    name: 'sending_marketing_information',
    label: ` I consent to credit4business Funding and its trading group of
    companies sending me marketing information on products unrelated to
    my current agreement:`,
    type: 'multiCheckbox',
    icon: () => {
      return (
        <>
          <AiOutlineQuestionCircle size={28} color="1A439A" />
        </>
      );
    },
    labelClass:
      '  text-[15px] max-sm:text-[10px]  font-medium text-[#2C2C2E] flex gap-2 py-3 ',
    options: [
      { key: 'email', label: 'Email' },
      { key: 'post', label: 'Post' },
      { key: 'sms', label: 'SMS' },
      {
        key: 'social_media',
        label: 'Social Media'
      },
      {
        key: 'telephone',
        label: 'Telephone'
      }
    ]
  },
  {
    name: 'third_party_sharing',
    label: `I consent to Credit4business Funding sharing my data with affiliated
    third-party companies for the purposes of goods and services that
    may be of interest to me:`,
    type: 'multiCheckbox',
    labelClass:
      '  text-[15px] max-sm:text-[10px]  font-medium text-[#2C2C2E] flex gap-2 py-3 ',
    icon: () => {
      return (
        <>
          <AiOutlineQuestionCircle size={28} color="1A439A" />
        </>
      );
    },
    options: [
      {
        key: 'email',
        label: 'Email'
      },
      {
        key: 'post',
        label: 'Post'
      },
      {
        key: 'sms',
        label: 'SMS'
      },
      {
        key: 'social_media',
        label: 'Social Media'
      },
      {
        key: 'telephone',
        label: 'Telephone'
      }
    ]
  }
];

export const loanFormDocumentationUploads: FundingFormFieldType[] = [
  {
    name: 'photo',
    label: 'Photo of owner in business premises',
    type: 'file',
    isMultiple: false,
    memTypes:
      'image/jpg, image/gif, image/png, image/jpeg, image/svg+xml, image/webp, application/pdf',
    icon: () => {
      return <img src={camera} className="h-5 w-5 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'passport',
    label: 'Passport',
    type: 'file',
    isMultiple: false,
    memTypes:
      'image/jpg, image/gif, image/png, image/jpeg, image/svg+xml, image/webp, application/pdf',
    icon: () => {
      return <CiPassport1 color="#929292" size={24} />;
    }
  },
  {
    name: 'driving_license',
    label: 'Driving License',
    type: 'file',
    isMultiple: false,
    memTypes:
      'image/jpg, image/gif, image/png, image/jpeg, image/svg+xml, image/webp, application/pdf',
    icon: () => {
      return <CiPassport1 color="#929292" size={24} />;
    }
  },
  {
    name: 'council_tax',
    label: 'Council tax',
    type: 'file',
    isMultiple: false,
    memTypes: 'application/pdf',
    icon: () => {
      return <img src={bill} className="h-5 w-5 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'utility_bill',
    label: 'Latest Utility bill of Trading Business',
    type: 'file',
    isMultiple: false,
    memTypes: 'application/pdf',
    icon: () => {
      return <img src={bill} className="h-5 w-5 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'lease_deed',
    label: 'Business premises lease deed',
    type: 'file',
    isMultiple: false,
    memTypes: 'application/pdf',
    icon: () => {
      return <img src={user} />;
    }
  },
  // {
  //   name: 'business_account_statements',
  //   label: 'Business account statement for 6 months',
  //   type: 'file',
  //   memTypes:
  //     'application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   icon: () => {
  //     return <img src={bill} className='w-5 h-5 rtl:rotate-[270deg] ' />
  //   }
  // },

  {
    name: 'other_files',
    label: 'Other Files',
    type: 'file',
    memTypes:
      'image/jpg, image/gif, image/png, image/jpeg, image/svg+xml, image/webp, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: () => {
      return <img src={files} className="h-6 w-6 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'document_upload_self_declaration',
    label: 'Self declared acknowledgment statement',
    type: 'checkbox'
  }
];

export const profileFormDocumentationUploads = [
  {
    name: 'title',
    label: 'Title',
    type: 'dropdown',
    options: ['Mr', 'Mrs', 'Miss']
  },
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter your First Name'
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter your Last Name'
  },
  {
    name: 'photoId',
    label: 'Photo Id',
    type: 'file',
    isMultiple: false,
    options: ['Passport', 'Driving Licence']
  },
  // {
  //   name: "passport_or_driving_license",
  //   label: "Passport/Driving License",
  //   type: "file",
  //   isMultiple: true,
  // },
  // New fields added
  {
    name: 'drivingLicense',
    label: 'Driving License',
    type: 'file',
    isMultiple: true
  },
  {
    name: 'passport',
    label: 'Passport',
    type: 'file',
    isMultiple: true
  },

  // {
  //   name: "addressProof",
  //   label: "Address Proof ",
  //   type: "dropdown",
  //   options: ["Council Tax", "Utility Bill", "Driving Licence"],
  // },
  {
    name: 'councilTax',
    label: 'Council Tax',
    type: 'file',
    isMultiple: true
  },
  {
    name: 'utilityBill',
    label: 'Utility Bill',
    type: 'file',
    isMultiple: true
  },
  {
    name: 'drivingLicence',
    label: 'Driving Licence',
    type: 'file',
    isMultiple: true
  },

  {
    name: 'paymentDetails',
    label: 'Payment Details',
    type: 'file',
    isMultiple: true
  },

  {
    name: 'image',
    label: 'Images',
    type: 'file',
    isMultiple: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter your Description'
  },
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    placeholder: 'Enter your Location'
  },
  {
    name: 'businessName',
    label: 'Business Name',
    type: 'text',
    placeholder: 'Enter your Business Name'
  }
];

export const loanFormGuarantor: FundingFormFieldType[] = [];

export const PermittedRoutes = {
  common: [
    '/profile',
    '/change-password',
    '/notification',
    '/funding-form/:id'
  ],
  [Roles.Leads]: [],
  [Roles.Customer]: [
    '/profile/',
    '/profile/funding-form',
    '/profile/units',
    '/profile/documents',
    '/profile/identity-verification',
    '/profile/notification',
    '/profile/security'
  ],
  [Roles.FieldAgent]: [
    '/funding',
    '/funding/:id',
    '/units',
    '/units/:id',
    '/leads',
    '/leads/:id',
    '/dashboard',
    '/credit-monitoring',
    '/default/:id',
    '/customer',
    '/customer/:id'
  ],
  [Roles.UnderWriter]: [
    '/funding',
    '/funding/:id',
    '/units',
    '/units/:id',
    '/leads',
    '/leads/:id',
    '/dashboard',
    '/customer',
    '/field-agent',
    '/customer/:id',
    '/credit-monitoring',
    '/default/:id',
    '/pap',
    '/pap-details/:planId',
    '/cash-receipt',
    '/cash-receipt/:id',
    '/transaction-sorting',
    '/mandate',
    '/mandate/:id',
    '/affordability',
    '/reports',
    '/reports/default-user',
    '/reports/customer',
    '/reports/good-standing',
    '/reports/default',
    '/reports/pending-due',
    '/reports/payment',
    '/reports/funding',
    '/reports/outstanding',
    '/reports/summary',
    '/reports/agent-performance',
    '/reports/agent',
    '/reports/contract-expiring',
    '/reports/contract-expired',
    '/reports/snapshot',
    '/reports/referral',
    '/disbursement-advice'
  ],
  [Roles.Manager]: [
    '/funding',
    '/funding/:id',
    '/units',
    '/units/:id',
    '/leads',
    '/leads/:id',
    '/dashboard',
    '/customer',
    '/field-agent',
    '/finance-manager',
    '/manager',
    '/underwriter',
    '/approval-list',
    '/referral',
    '/customer/:id',
    '/credit-monitoring',
    '/default/:id',
    '/pap',
    '/pap-details/:planId',
    '/cash-receipt',
    '/cash-receipt/:id',
    '/transaction-sorting',
    '/mandate',
    '/mandate/:id',
    '/reports',
    '/reports/default-user',
    '/reports/customer',
    '/reports/good-standing',
    '/reports/default',
    '/reports/pending-due',
    '/reports/payment',
    '/reports/funding',
    '/reports/outstanding',
    '/reports/summary',
    '/reports/agent-performance',
    '/reports/agent',
    '/reports/contract-expiring',
    '/reports/contract-expired',
    '/reports/snapshot',
    '/reports/referral',
    '/disbursement-advice',
    '/funding-offer',
    '/disbursement-advice',
    '/affordability'
  ],
  [Roles.Admin]: [
    '/funding',
    '/funding/:id',
    '/units',
    '/units/:id',
    '/leads',
    '/leads/:id',
    '/dashboard',
    '/bulk-upload-funding',
    '/bulk-upload-funding/:id',
    '/customer',
    '/field-agent',
    '/finance-manager',
    '/referral',
    '/manager',
    '/underwriter',
    '/approval-list',
    '/customer/:id',
    '/credit-monitoring',
    '/default/:id',
    '/pap',
    '/pap-details/:planId',
    '/cash-receipt',
    '/cash-receipt/:id',
    '/transaction-sorting',
    '/mandate',
    '/mandate/:id',
    '/reports',
    '/reports/default-user',
    '/reports/customer',
    '/reports/good-standing',
    '/reports/default',
    '/reports/pending-due',
    '/reports/payment',
    '/reports/funding',
    '/reports/outstanding',
    '/reports/summary',
    '/reports/agent-performance',
    '/reports/agent',
    '/reports/contract-expiring',
    '/reports/contract-expired',
    '/reports/snapshot',
    '/reports/referral',
    '/disbursement-advice',
    '/affordability'
  ],
  [Roles.FinanceManager]: [
    '/dashboard',
    '/assets',
    '/liabilities',
    '/equity',
    '/income',
    '/expense',
    '/bp',
    '/bp-groups',
    '/entry',
    '/entry/:id',
    // "/add-entry",
    '/entry-details',
    '/reports',
    '/reports/default-user',
    '/reports/customer',
    '/reports/good-standing',
    '/reports/default',
    '/reports/pending-due',
    '/reports/payment',
    '/reports/funding',
    '/reports/outstanding',
    '/reports/summary',
    '/reports/agent-performance',
    '/reports/agent',
    '/reports/contract-expiring',
    '/reports/contract-expired',
    '/reports/snapshot',
    '/reports/referral',
    '/statements',
    '/statements/pl',
    '/statements/trial-balance',
    '/statements/bp-trial-balance',
    '/statements/balance-sheet',
    '/statements/ledger'
  ]
};

export const commonMenu = [
  { name: 'Dashboard', link: `/dashboard`, icon: RxDashboard },
  { name: 'Master', link: '/assets', icon: MdOutlineWebAsset },
  { name: 'Business Partner', link: '/bp', icon: LuUsers },
  { name: 'Business Partner Groups', link: '/bp-groups', icon: TiGroupOutline },
  { name: 'Entry', link: '/entry', icon: TfiWrite },
  { name: 'Lead', link: `/leads`, icon: RiUserLine },
  { name: 'Customer', link: `/customer`, icon: RiUserFollowLine },
  { name: 'Funding', link: `/funding`, icon: GiCash },
  { name: 'Unit', link: `/units`, icon: RiCommunityLine },
  {
    name: 'Field Agent',
    link: '/field-agent',
    icon: TbUserCog
  },
  { name: 'Underwriter', link: '/underwriter', icon: TbUserSearch },
  {
    name: 'Manager',
    link: '/manager',
    icon: TbUserShield
  },
  {
    name: 'Financial Manager',
    link: '/finance-manager',
    icon: TbUserStar
  },
  { name: 'Approval List', link: '/approval-list', icon: FaListCheck },
  { name: 'Pap', link: '/pap', icon: GrDocumentPpt },
  {
    name: 'Credit Monitoring',
    link: '/credit-monitoring',
    icon: MdOutlinePersonSearch
  },
  // { name: "Affordability", link: "/affordability", icon: LuStickyNote },
  // { name: "Disbursement Advice", link: "/disbursement-advice", icon: LuStickyNote },
  { name: 'Cash Payment Receipt', link: '/cash-receipt', icon: IoMdCash },
  {
    name: 'Transaction Sorting settings',
    link: '/transaction-sorting',
    icon: RiListSettingsFill
  },
  { name: 'Mandates', link: '/mandate', icon: LuClipboardList },
  {
    name: 'Financial Statement',
    link: '/statements/pl',
    icon: IoDocumentsOutline
  },
  { name: 'Report', link: '/reports/default-user', icon: GrNotes },
  {
    name: 'Referral',
    link: '/referral',
    icon: RiUserReceivedLine
  },
  { name: 'Notification', link: '/notification', icon: TbBell },
  {
    name: 'Bulk Upload Funding',
    link: '/bulk-upload-funding',
    icon: MdOutlineUploadFile
  }
];

export const fundingMenu = [
  { name: 'Funding Form', link: `funding-form`, icon: AiOutlineFundView },
  {
    name: 'Application Status',
    link: `application-status`,
    icon: MdCheckCircleOutline
  },
  {
    name: 'Unit Profile',
    link: `unit-profile`,
    icon: RiCommunityLine
  },
  // {
  //   name: 'Identity Verification',
  //   link: `identityVerification`,
  //   icon: PiUserFocus
  // },
  // { name: 'Go Cardless', link: `gocardless`, icon: MdCreditCard },
  // { name: 'Disbursement Advise', link: `disbursement-advice`, icon: LuStickyNote },
  // { name: 'Affordability', link: `affordability`, icon: IoBagCheckOutline },
  // { name: 'Contract', link: `contract`, icon: contrt },
  { name: 'Funding Offers', link: `funding-offer`, icon: MdOutlineLocalOffer },
  { name: 'Mandates', link: 'mandate', icon: LuClipboardList },
  { name: 'Pap', link: 'pap', icon: GrDocumentPpt },
  { name: 'Cash Payment Receipt', link: 'cash-receipt', icon: IoMdCash }
];

export const masterSubMenu = [
  { name: 'Assets', link: '/assets', icon: PiHandCoins },
  { name: 'Liabilities', link: '/liabilities', icon: GiFallingRocks },
  { name: 'Equity', link: '/equity', icon: LuHandHelping },
  { name: 'Income', link: '/income', icon: RiMoneyEuroBoxLine },
  { name: 'Expense', link: '/expense', icon: FaRegWindowClose }
];

export const reportMenu = [
  { name: 'Default Users Report', link: 'default-user', icon: GrNotes },
  { name: 'Customer Report', link: 'customer', icon: GrNotes },
  { name: 'Good Standing Report', link: 'good-standing', icon: GrNotes },
  { name: 'Default Report', link: 'default', icon: GrNotes },
  { name: 'Pending Due Report', link: 'pending-due', icon: GrNotes },
  { name: 'Payment Report', link: 'payment', icon: GrNotes },
  { name: 'Funding Report', link: 'funding', icon: GrNotes },
  { name: 'Outstanding Report', link: 'outstanding', icon: GrNotes },
  { name: 'Summary Reports', link: 'summary', icon: GrNotes },
  {
    name: 'Field Agent Performance Report',
    link: 'agent-performance',
    icon: GrNotes
  },
  { name: 'Field Agent Report', link: 'agent', icon: GrNotes },
  { name: 'Expiring Contracts', link: 'contract-expiring', icon: GrNotes },
  { name: 'Expired Contracts', link: 'contract-expired', icon: GrNotes },
  { name: 'Snapshot', link: 'snapshot', icon: GrNotes },
  { name: 'Referral', link: 'referral', icon: GrNotes }
];

// Sub-menu items for "Financial Statement"
export const financialSubMenu = [
  {
    name: 'Profit & Loss',
    link: '/statements/pl',
    icon: HiOutlineDocumentText
  },
  {
    name: 'Trial Balance',
    link: '/statements/trial-balance',
    icon: HiOutlineDocumentText
  },
  {
    name: 'BP Trial Balance',
    link: '/statements/bp-trial-balance',
    icon: HiOutlineDocumentText
  },
  {
    name: 'Balance Sheet',
    link: '/statements/balance-sheet',
    icon: HiOutlineDocumentText
  },
  { name: 'Ledger', link: '/statements/ledger', icon: HiOutlineDocumentText }
];

export const unitMenu = [
  {
    name: 'Unit Profile',
    link: `unit-profile`,
    icon: MdCheckCircleOutline
  },
  { name: 'Customers Linked ', link: `bp`, icon: LuUserCheck },
  { name: 'Funding Form', link: `funding-form`, icon: AiOutlineFundView },
  { name: 'Documents', link: `documents`, icon: IoDocumentTextOutline },
  { name: 'Edit Approval', link: 'edit-approval', icon: MdEditCalendar }
  // { name: 'Notification', link: `notification`, icon: TbBell }
];

export const leadMenu = [
  { name: 'Profile', link: `profile`, icon: RiUserLine },
  { name: 'Funding Form', link: `funding-form`, icon: AiOutlineFundView },
  { name: 'Edit Approval', link: `edit-approval`, icon: MdEditCalendar },
  { name: 'Notification', link: `notification`, icon: TbBell }
];

export const CustomerMenu = [
  { name: 'Profile', link: `profile`, icon: RiUserLine },
  { name: 'Unit', link: `units`, icon: RiCommunityLine },
  { name: 'Funding', link: `funding-form`, icon: GiCash },
  {
    name: 'Identity Verification',
    link: `identity-verification`,
    icon: identy
  },
  { name: 'Edit Approval', link: `edit-approval`, icon: MdEditCalendar },
  { name: 'Notification', link: `notification`, icon: TbBell }
];

//Da = Disbursement Advice

export const DirectorsDefaultValuesDisbursementForm = [
  {
    name: '',
    creditScore: 5,
    riskScore: 2
  }
];

export const DaFields = [
  // { key: 'contractId', label: 'Contract ID' },
  { key: 'unit_name', label: 'Unit Name', disabled: true },
  { key: 'field_agent_name', label: 'Field Agent Name', disabled: true },
  {
    key: 'customer_relation_start_date',
    label: 'Customer Relation Start Date',
    disabled: true
  },
  {
    key: 'no_of_contracts_executed',
    label: 'Number of Contracts Executed',
    disabled: true
  },
  {
    key: 'value_of_total_contracts',
    label: 'Value of Total Contracts',
    disabled: true
  },
  { key: 'income_earned', label: 'Income Earned', disabled: true },
  { key: 'present_outstanding', label: 'Present Outstanding', disabled: true },
  { key: 'pending_dues', label: 'Pending Dues', disabled: true },
  {
    key: 'no_of_missed_payments',
    label: 'Number of Missed Payments',
    disabled: true
  },
  { key: 'active_contracts', label: 'Active Contracts', disabled: true }
];

export const DaPresentLoanFields = [
  { key: 'total_sales', label: 'Total Sales', disabled: true },
  { key: 'card_sales', label: 'Card Sales', disabled: true },
  { key: 'amount_to_be_adjusted', label: 'Adjustments', disabled: true },
  {
    key: 'amount_to_be_disbursed',
    label: 'Amount to be Disbursed',
    disabled: true
  },
  { key: 'repayment_period', label: 'Repayment Period', disabled: true },
  { key: 'repayment_amount', label: 'Repayment Amount', disabled: true },
  {
    key: 'remarks_by_recommender',
    label: 'Remarks by Recommender',
    disabled: true
  },
  { key: 'remarks_by_approver', label: 'Remarks by Approver', disabled: true }
];

export const DaBankDetailsFields = [
  { key: 'account_holder_name', label: 'Account Holder Name', disabled: true },
  // { key: 'address', label: 'Address' },
  { key: 'bank_account_number', label: 'Account Number', disabled: true },
  { key: 'bank_sort_code', label: 'Sort Code', disabled: true },
  { key: 'bank_name', label: 'Bank Name', disabled: true }
];

export const DaDirectorDetailsFields = [
  { key: 'name', label: 'Name', disabled: true },
  { key: 'credit_score', label: 'Credit Score', disabled: true },
  { key: 'risk_score', label: 'Risk Score', disabled: true }
];
export const GuarantorDetailsFields = [
  { key: 'name', label: 'Name', disabled: true },
  { key: 'credit_score', label: 'Credit Score', disabled: true },
  { key: 'risk_score', label: 'Risk Score', disabled: true }
];

export const PapFields = [
  // { key: 'contractId', label: 'Contract ID' },
  { key: 'company_name', label: 'Company Name' },
  { key: 'customer_name', label: 'Customer Name' },
  { key: 'account_number', label: 'Account Number' },
  { key: 'sort_code', label: 'Sort Code' },
  { key: 'bank', label: 'Bank' },
  { key: 'application_number', label: 'Application No' },
  { key: 'advanced_amount', label: 'Advanced Amount' },
  { key: 'period', label: 'Period' },
  { key: 'total_repayable_amount', label: 'Total Repayable Amount' },
  { key: 'pending_due', label: 'Pending Due' }
];

export const subscriptionFields = [
  { key: 'company_name', label: 'Company Name' },
  { key: 'customer_name', label: 'Customer Name' },
  { key: 'account_number', label: 'Account Number' },
  { key: 'sort_code', label: 'Sort Code' },
  { key: 'bank', label: 'Bank' },
  { key: 'refererence_number', label: 'Reference No' }
];

export const PapPlanFields = [
  {
    name: 'day_of_debit',
    placeholder: 'Day of Debit',
    type: 'dropdown',
    options: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
      'Custom'
    ]
  },
  {
    name: 'amount',
    type: 'text',
    placeholder: 'Amount'
  },
  {
    type: 'date',
    name: 'start_date',
    placeholder: 'Day of Debit'
  },
  {
    name: 'no_of_installments',
    placeholder: 'No of Installments',
    type: 'number'
  },
  {
    name: 'total_amount_collected',
    placeholder: 'Total Amount to collect',
    type: 'number'
  }
];

export const subscriptionPlanFields = [
  {
    name: 'day_of_debit',
    placeholder: 'Day of Debit',
    type: 'dropdown',
    options: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
      'Custom'
    ],
    isRequired: true
  },
  {
    name: 'amount',
    type: 'text',
    placeholder: 'Amount',
    isRequired: true
  },
  {
    type: 'date',
    name: 'start_date',
    placeholder: 'Day of Debit'
  },
  {
    name: 'period',
    placeholder: 'Period',
    type: 'number',
    isRequired: true
  },
  {
    name: 'reference_number',
    placeholder: 'Reference Number',
    type: 'number'
  }
];

export const weekDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

export const PapDynamicPlanFieldDefault = [
  {
    day_of_debit: '',
    amount: 0,
    start_date: new Date(),
    no_of_installments: 0,
    total_amount_collected: 0
  }
];

export const cashReceiptFields = [
  { key: 'company_name', label: 'Company Name' },
  { key: 'customer_name', label: 'Customer Name' },
  { key: 'application_number', label: 'Application No' },
  { key: 'advanced_amount', label: 'Advanced Amount' },
  { key: 'period', label: 'Period' },
  { key: 'total_repayable_amount', label: 'Total Repayable Amount' },
  { key: 'pending_due', label: 'Pending Due' },
  { key: 'outstanding_amount', label: 'Outstanding Amount' }
];

export const failedMandatesFields = [
  { key: 'slNo', label: 'Sl No' },
  { key: 'contractId', label: 'Contract ID' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'receivedDate', label: 'Received Date' },
  { key: 'receivedAmount', label: 'Received Amount' }
];

export const failedMandatesDefaultValues = [
  {
    slNo: 0,
    contractId: '',
    date: '',
    amount: 0,
    status: 'failed',
    receivedDate: '',
    receivedAmount: 0
  }
];

export const fieldClass = `peer bg-transparent h-12 w-full rounded-lg 
text-black placeholder-transparent px-6
focus:outline-none focus:border-gray-500 border border-stone-300
`;

export const labelClass = `-top-3 absolute cursor-text text-sm text-gray-500 start-3 mt-1 
bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-gray-600 peer-focus:text-sm transition-all
`;

export const roleTabs = {
  [Roles.Customer]: [
    {
      name: 'profileDetails',
      label: 'Profile',
      icon: CgProfile
    },
    {
      name: 'funding',
      label: 'Funding ',
      icon: GiCash
    },
    {
      name: 'units',
      label: 'Unit',
      icon: RiCommunityLine
    },
    {
      name: 'identityVerification',
      label: 'Identity Verification',
      icon: PiUserFocus
    },
    {
      name: 'notification',
      label: 'Notification',
      icon: TbBell
    },
    {
      name: 'security',
      label: 'Security',
      icon: IoMdLock
    },
    {
      name: 'requestPending',
      label: 'Request Pending',
      icon: IoMdLock
    }
  ],
  [Roles.Leads]: [
    {
      name: 'profileDetails',
      label: 'Profile Details',
      icon: CgProfile
    },
    {
      name: 'funding',
      label: 'Funding',
      icon: GiCash
    },
    {
      name: 'notification',
      label: 'Notification',
      icon: TbBell
    },
    {
      name: 'security',
      label: 'Security',
      icon: IoMdLock
    },
    {
      name: 'requestPending',
      label: 'Request Pending',
      icon: IoMdLock
    }
  ],
  [Roles.FieldAgent]: [
    {
      name: 'profileDetails',
      label: 'Profile Details',
      icon: CgProfile
    },
    { name: 'security', label: 'Security', icon: IoMdLock }
  ],
  [Roles.Admin]: [
    {
      name: 'profileDetails',
      label: 'Profile Details',
      icon: CgProfile
    },
    { name: 'security', label: 'Security', icon: IoMdLock }
  ],
  [Roles.UnderWriter]: [
    {
      name: 'profileDetails',
      label: 'Profile Details',
      icon: CgProfile
    },
    { name: 'security', label: 'Security', icon: IoMdLock }
  ],
  [Roles.Manager]: [
    {
      name: 'profileDetails',
      label: 'Profile Details',
      icon: CgProfile
    },
    { name: 'security', label: 'Security', icon: IoMdLock }
  ],
  [Roles.FinanceManager]: [
    {
      name: 'profileDetails',
      label: 'Profile Details',
      icon: CgProfile
    },
    { name: 'security', label: 'Security', icon: IoMdLock }
  ]
};

export const getFundingTabs = () => {
  const state = store.getState();
  const role = state.auth.user.role;
  return [
    { name: 'fundingDetails', label: 'Funding', icon: IoMdLock },
    ...(Roles.Customer === role
      ? [{ name: 'contract', label: 'Contract', icon: IoMdLock }]
      : []),
    { name: 'fundingUnitProfile', label: 'Unit Profile', icon: IoMdLock },
    { name: 'goCardLess', label: 'GoCardless', icon: MdCreditCard },
    { name: 'fundingOffer', label: 'Funding Offer', icon: IoMdLock }
  ];
};

export const unitTabs = [
  { name: 'unitProfile', label: 'Unit Profile', icon: IoMdLock },
  { name: 'unitFunding', label: 'Funding', icon: GiCash },
  { name: 'photoId', label: 'Photo ID', icon: IoMdLock },
  { name: 'customerLinked', label: 'Customer Linked', icon: IoMdLock },
  { name: 'addressProof', label: 'Address Proof', icon: IoMdLock },
  { name: 'otherFiles', label: 'Other Files', icon: IoMdLock },
  { name: 'bankStatement', label: 'Bank Statement', icon: IoMdLock },
  { name: 'unitRequestPending', label: 'Request Pending', icon: IoMdLock }
];

export const fundingOffer: FundingFormFieldType[] = [
  {
    name: 'offer_amount',
    isRequired: true,
    // label: "Fund Request",
    type: 'number',
    placeholder: 'Amount you Need',
    icon: () => {
      return (
        <div className=" ">
          <img src={amount} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    },
    min: 0
  },
  {
    name: 'offer_number_of_weeks',
    isRequired: true,
    placeholder: 'Duration (In weeks)',
    type: 'number',
    icon: () => {
      return (
        <div>
          <img src={clock} className="h-5 w-4 rtl:rotate-[270deg]" />
        </div>
      );
    },
    min: 5,
    max: 40
  }
];

export const affordabilityGeneral = [
  {
    key: 'statement_start_date',
    label: 'Statement Start Date',
    type: 'date',
    autoFilled: true
  },
  {
    key: 'statement_end_date',
    label: 'Statement End Date',
    type: 'date',
    autoFilled: true
  },
  {
    key: 'period_of_statement',
    label: 'Period of Statement',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'credit_summation',
    label: 'Credit Summation',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'debit_summation',
    label: 'Debit Summation',
    type: 'number',
    autoFilled: true
  }
];

export const affordabilityReceipts = [
  { key: 'card_sales', label: 'Card Sales', type: 'number' },
  { key: 'cash_sales', label: 'Cash Sales', type: 'number' },
  { key: 'other_receipts', label: 'Other Receipts', type: 'number' },
  {
    key: 'total_sales',
    label: 'Total Sales',
    type: 'number',
    autoFilled: true
  },
  { key: 'previous_sales', label: 'Previous Sales', type: 'number' }
];

export const affordabilityExpenses = [
  { key: 'payments', label: 'Payments', type: 'number' },
  { key: 'purchases', label: 'Purchases', type: 'number' },
  { key: 'wages', label: 'Wages', type: 'number' },
  { key: 'other_expenses', label: 'Other Expenses', type: 'number' },
  {
    key: 'total_expenses_considered',
    label: 'Total Expenses Considered',
    type: 'number',
    autoFilled: true
  },
  { key: 'net_sales', label: 'Net Sales', type: 'number', autoFilled: true }
];

export const affordabilityExtraFields = [
  { key: 'paypoint_payzone', label: 'Paypoint/Payzone', type: 'number' },
  {
    key: 'c4b_existing_monthly',
    label: 'C4B Existing Monthly',
    type: 'number'
  },
  { key: 'liabilities', label: 'Liabilities', type: 'number' },
  {
    key: 'other_monthly_liabilities',
    label: 'Other Monthly Liabilities',
    type: 'number'
  },
  {
    key: 'total_liabilities',
    label: 'Total Liabilities',
    type: 'number',
    autoFilled: true
  }
];

export const affordabilityGrossFields = [
  {
    key: 'gross_affordability_weekly',
    label: 'Gross Affordability (Weekly)',
    type: 'number',
    autoFilled: true
  },
  { key: 'profit_margin', label: 'Profit Margin', type: 'number' },
  { key: 'self_withdrawals', label: 'Self Withdrawals', type: 'number' },
  {
    key: 'self_business_contribution',
    label: 'Self Business Contribution',
    type: 'number'
  },
  {
    key: 'net_investment_into_business',
    label: 'Net Investment into Business',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'net_affordability_weekly',
    label: 'Net Affordability (Weekly)',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'sales_as_per_till_report',
    label: 'Sales as Per Till Report',
    type: 'number'
  },
  {
    key: 'period_of_till_report_days',
    label: 'Period of Till Report available (in Days)',
    type: 'number'
  },
  {
    key: 'sales_for_period_of_statement',
    label: 'Sales for the period of Statement',
    type: 'number',
    autoFilled: true
  }
];

export const affordabilityApprovalFields = [
  {
    key: 'sales_as_per_till_report',
    label: 'SALES AS PER TILL REPORT',
    type: 'number'
  },
  {
    key: 'cash_sales_not_reflected',
    label: 'CASH SALES NOT REFLECTED',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'corrected_net_sales',
    label: 'CORRECTED NET SALES',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'corrected_gross_affordability',
    label: 'CORRECTED GROSS AFFORDABILITY',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'corrected_net_affordability',
    label: 'CORRECTED NET AFFORDABILITY',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'corrected_net_affordability_ideal_amount',
    label: 'IDEAL',
    type: 'number',
    autoFilled: true
  },
  {
    key: 'corrected_net_affordability_max_amount',
    label: 'MAX',
    type: 'number',
    autoFilled: true
  },

  { key: 'approved_amount', label: 'Approved Amount', type: 'number' },
  { key: 'remarks_by_approver', label: 'Remarks', type: 'text' },
  {
    key: 'amount_to_be_adjusted_by_approver',
    label: 'Amount to be Adjusted',
    type: 'number'
  },
  {
    key: 'final_release_amount_by_approver',
    label: 'Final Release Amount',
    type: 'number',
    autoFilled: true
  }
];

export const affordabilityGrossAmountFields = [
  { key: 'repayment_term', label: 'Repayment Term', type: 'number' },
  { key: 'merchant_factor', label: 'MERCHANT FACTOR', type: 'number' },
  {
    key: 'ideal_limit',
    label: 'Ideal LIMIT',
    type: 'number',
    autoFilled: true
  },
  { key: 'max_limit', label: 'Max Limit', type: 'number', autoFilled: true },
  { key: 'recommended_amount', label: 'Recommended Amount', type: 'number' },
  { key: 'remarks', label: 'Remarks', type: 'text' },
  // { key: 'existing_contracts', label: 'Existing Contracts' },
  {
    key: 'amount_to_be_adjusted',
    label: 'Amount to be Adjusted',
    type: 'number'
  },
  {
    key: 'final_release_amount',
    label: 'Final Release Amount',
    type: 'number',
    autoFilled: true
  }
];

export const creditCategoryOptions = [
  { key: 'card', label: 'Card' },
  { key: 'cash', label: 'Cash' },
  // { key: 'self_business_contribution', label: 'Liabilities' },
  { key: 'other_receipts', label: 'Other Receipts' },
  { key: 'ignore_transaction', label: 'Ignore transaction' }
];
export const debitCategoryOptions = [
  { key: 'payments', label: 'Payments' },
  { key: 'purchase', label: 'Purchase' },
  { key: 'wage', label: 'Wage' },
  { key: 'other_expenses', label: 'Other Expenses' },
  { key: 'paypoint_payzone', label: 'Paypoint/Payzone' },
  { key: 'liabilities', label: 'Liabilities' },
  { key: 'ignore_transaction', label: 'Ignore transaction' }
];

export const underWriterFormVerify: FundingFormFieldType[] = [
  {
    name: 'personal_details',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'business_details',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'business_premis_details',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'marketing_preferences',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'documents',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'guarantors',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'identity_verified',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'director_detail',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  },
  {
    name: 'gocardless_statement',
    label: 'UnderWriter Verify',
    type: 'checkbox',
    icon: () => {
      return (
        <div className="w-[26px] pr-2 text-gray-400">
          <img src={date} />
        </div>
      );
    },
    wrapperClass: 'flex items-center'
  }
];

export const addCategory = [
  {
    name: 'new category',
    placeholder: 'Heading'
  }
];

export const addSubCategoryName = [
  {
    name: 'name',
    placeholder: 'Name'
  }
];
export const addSubCategoryCode = [
  {
    name: 'Gl-Id',
    placeholder: 'Gl-Id'
  }
];

export const loanFormBankDetails: FundingFormFieldType[] = [
  {
    name: 'bank_name',
    // label: "Pincode",
    type: 'dropdown',
    placeholder: 'Bank Name',
    icon: () => {
      return (
        <div>
          <img src={bank} className="h-5 w-5 rtl:rotate-[270deg]" />
        </div>
      );
    }
  },
  {
    name: 'account_number',
    // label: "Pincode",
    type: 'number',
    placeholder: 'Account Number',
    icon: () => {
      return <MdAccountBalance className="h-4 w-4 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'sort_code',
    // label: "Pincode",
    type: 'number',
    placeholder: 'Sort Code',
    icon: () => {
      return <FaSortAlphaDown className="h-4 w-4 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'account_holder_name',
    // label: "Pincode",
    type: 'text',
    placeholder: 'Account Holder Name',
    icon: () => {
      return <IoIosPerson className="h-4 w-4 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'country_code',
    // label: "Pincode",
    type: 'text',
    placeholder: 'Country Code',
    isDisabled: true,
    icon: () => {
      return <FaGlobeEurope className="h-4 w-4 rtl:rotate-[270deg]" />;
    }
  },
  {
    name: 'business_account_statements',
    label: 'Business account statement for 6 months',
    type: 'file',
    isMultiple: true,
    memTypes:
      'image/jpg, image/gif, image/png, image/jpeg, image/svg+xml, image/webp, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: () => {
      return <img src={bill} className="h-5 w-5 rtl:rotate-[270deg]" />;
    }
  }
];

export const gocardlessSortingConstant = {
  debit: {
    payments: ['Gas', 'OVO', 'EDF', 'EON', 'Rent'],
    purchase: [
      'Booker',
      'Parfetts',
      'Parfett',
      'Dhamecha',
      'Bestway',
      'Costco',
      'Carry',
      'Menzies',
      'Daisy',
      'VAPE',
      'Nijjar',
      'DFL APP',
      'DRINKS WHOLESALE'
    ],
    'Paypoint/Payzone': [
      'Paypoint',
      'Smiths news',
      'Payzone',
      'Allwyn',
      'Passagents',
      'ATM',
      'Cash'
    ],
    wage: ['Wages', 'Salary']
  },
  credit: {
    card: [
      'Youlend',
      'Paymentsense',
      'Elavon',
      'Worldpay',
      'FDMS',
      'Bcard',
      'Natwest FYL',
      'Paypoint',
      'Payzone',
      'Cardnet',
      'Justeat',
      'Ubereat',
      'Deliveroo',
      'SQUARE',
      'DOJO'
    ],
    cash: ['P.O.', 'Deposit', 'Post Office Counter']
  }
};
