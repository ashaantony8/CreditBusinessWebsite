import * as yup from 'yup';

const emailValidationRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const pincodeValidationRegex =
  /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;

export const ContactUsSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number'),
  howDidYouFindUs: yup.string().nullable()
});

export const ReferralAddFormchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  business_name: yup.string().required('Business name is required'),
  bank_details: yup
    .object()
    .shape({
      bank_name: yup.string().required('Bank name is required'),
      account_holder_name: yup
        .string()
        .required('Account holder name is required'),
      account_number: yup.string().required('Account number is required'),
      sort_code: yup.string().required('Sort code is required')
    })
    .required('Bank details are required')
});

export const ManageFieldAgentSchema = yup.object().shape({
  title: yup.string(),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  description: yup.string(),
  address: yup.string(),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number')
});

export const ManageFinanceManagerSchema = yup.object().shape({
  title: yup.string(),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  description: yup.string(),
  address: yup.string(),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number')
});

export const ManageUnderWriterSchema = yup.object().shape({
  title: yup.string(),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  description: yup.string(),
  address: yup.string(),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number')
  // date_of_birth: yup.string().required("Date of Birth is required").matches(
  //   /^\d{4}-\d{2}-\d{2}$/,
  //   "Date of Birth must be in the format YYYY-MM-DD"
  // ),
});

export const ManageLeadSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number')
});

export const ProfileEditSchema = yup.object().shape({
  // image: yup
  // .mixed()
  // .required('A file is required')
  // .test('fileSize', 'The file is too large', (value) => {
  //   return value && value[0] && value[0].size <= 2000000; // 2MB limit
  // })
  // .test('fileType', 'Unsupported file format', (value) => {
  //   return value && value[0] && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
  // }),
  credit_score: yup
    .string()
    .required('Credit Score is required, Please update in profile.'),
  risk_score: yup
    .string()
    .required('Risk Score is required, Please update in profile.'),
  first_name: yup.string().required('Name is required.'),
  last_name: yup.string().required('Name is required.'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number'),
  // company_name: yup.string().required("Company name is required"),
  address: yup.string(),
  description: yup.string(),
  date_of_birth: yup.string().required('Date of Birth is required')
});

export const UnitProfileEditSchema = yup.object().shape({
  id: yup.string().required('Contract ID is required.'),
  company_name: yup.string().required('Company Name is required.'),
  customer: yup.string().required('Customer is required').optional(),
  business_type: yup.string().required('Business Type is required.'),
  company_status: yup.string().required('Company Status is required.'),

  funding_purpose: yup.string().required('Funding Purpose is required.'),
  trading_style: yup.string().required('Trading Style is required.'),
  company_number: yup.string().required('Company Number is required.'),
  other_funding_purpose: yup.string().optional()
});

export const ManageManagerSchema = yup.object().shape({
  title: yup.string(),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  description: yup.string(),
  address: yup.string(),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number')
  // assigned_manager: yup.string().required("Assigned Manager is required"),
});

export const AssignFieldAgentformSchema = yup.object().shape({
  field_agent_id: yup.string().required('Field agent is required')
});

export const PersonalInformationSchema = yup.object().shape({
  address: yup.string().required('Address is required'),
  pincode: yup
    .string()
    .required('Postcode is required')
    .matches(pincodeValidationRegex, 'Valid UK Postcode is required.'),
  title: yup.string().required('Title required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  // dob: yup
  //   .string()
  //   .required("Date of birth is required")
  //   .test("is-over-18", "Must be at least 18 years old", function (value) {
  //     // 18+ check
  //     if (!value) return false;
  //     const dobDate = new Date(value);
  //     const today = new Date();
  //     const ageDifference = today.getFullYear() - dobDate.getFullYear();
  //     if (ageDifference < 18) return false;
  //     if (ageDifference === 18) {
  //       if (today.getMonth() < dobDate.getMonth()) return false;
  //       if (
  //         today.getMonth() === dobDate.getMonth() &&
  //         today.getDate() < dobDate.getDate()
  //       )
  //         return false;
  //     }
  //     return true;
  //   }),
  is_major: yup
    .boolean()
    .required('Major classification status required')
    .oneOf([true], 'The person should be major'),
  email: yup
    .string()
    .required('Email is required.')
    .matches(emailValidationRegex, 'Invalid Email.'),
  phone_number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit UK number'),
  fund_request_amount: yup
    .number()
    .typeError('Fund request amount must be a number')
    .transform((_, originalValue) => parseFloat(originalValue) || 0)
    .required('Fund request amount is required')
    .positive('Fund request amount must be positive')
    .min(3000, 'Fund request amount must be grater than or equal to £3000')
    .max(50000, 'Fund request amount must be less than or equal to £50,000'),
  fund_request_duration_weeks: yup
    .number()
    .typeError('Duration must be a number')
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be an integer')
    .min(10, 'Duration must be minimum of 10 weeks')
    .max(30, 'Duration must be maximum of 30 weeks'),
  is_otp_verified: yup
    .boolean()
    .when('modeOfApplication', ([modeOfApplication], sch) => {
      return ['Self', 'Representative'].indexOf(modeOfApplication) > -1
        ? sch.required('OTP verification is required')
        : sch.notRequired();
    }),
  agree_terms_and_conditions: yup
    .boolean()
    .required('Required field')
    .oneOf([true], 'Must agree to terms and conditions'),
  agree_communication_authorization: yup
    .boolean()
    .required('Required field')
    .oneOf([true], 'Must authorize communication'),
  repayment_day_of_week: yup
    .string()
    .required('Repayment Day Of Week is required.'),
  company: yup.object().shape({
    company_name: yup.string().required('Company name is required'),
    business_type: yup
      .string()
      .oneOf(['Limited Company', 'Limited Partnership', 'Sole Trader'])
      .required('Business type is required'),
    trading_style: yup.string().required('Trading Style is required'),
    company_number: yup
      .string()
      .when('business_type', ([businessType], sch) => {
        if (businessType === 'Limited Company') {
          return sch.required('Company number is required');
        } else {
          return sch.notRequired();
        }
      }),
    funding_purpose: yup
      .string()
      .oneOf(
        [
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
        'Please select the Funding Purpose'
      )
      .required('Funding Purpose required'),
    other_funding_purpose: yup
      .string()
      .when('fundingPurpose', ([fundingPurpose], sch) => {
        return fundingPurpose === 'Other (please specify)'
          ? sch.required('Please specify the Funding Purpose')
          : sch.notRequired();
      }),
    company_status: yup.string()
  }),
  mode_of_application: yup
    .string()
    .required('Mode Of Application is required')
    .oneOf(
      ['Self', 'Representative'],
      'Mode of Application must be one of the following values: Self, Representative'
    ),
  agree_authorization: yup
    .boolean()
    .when('mode_of_application', ([mode_of_application], sch) => {
      return mode_of_application === 'Representative'
        ? sch.required('Required field').oneOf([true], 'Must agree to consent')
        : sch.notRequired();
    }),
  is_pending_threatened_or_recently: yup
    .boolean()
    .when('mode_of_application', ([mode_of_application], sch) => {
      return mode_of_application === 'Representative'
        ? sch.required('Required field').oneOf([true], 'Must agree to consent')
        : sch.notRequired();
    }),
  representatives: yup
    .string()
    .matches(/^[0-9]*$/, 'Representative must be a valid number')
    .nullable()
});

export const BusinessDetailsSchema = yup.object().shape({
  business_type: yup
    .string()
    .oneOf(
      ['Limited Company', 'Limited Partnership', 'Sole Trader'],
      'Business Type must be one of the following values: Limited Company, Limited Partnership, Sole Trader'
    )
    .required('Business type is required'),
  number_of_directors: yup
    .number()
    .typeError('Number of Directors must be a number')
    .min(1, 'Number of Directors must be 1 or more')
    .max(20, 'Number of Directors must be less than or equal to 20')
    .when('business_type', ([businessType], sch) => {
      if (businessType === 'Limited Company') {
        return sch
          .required('Please select the number of Directors')
          .min(1, 'Number of Directors must be 1 or more.');
      } else if (businessType === 'Limited Partnership') {
        return sch
          .required('Please select the number of Directors')
          .min(2, 'Number of Directors must be 2 or more.');
      } else {
        return sch.notRequired();
      }
    }),
  directors: yup.array().of(
    yup.object().shape({
      first_name: yup.string().required('First name is required'),
      last_name: yup.string().required('Last name is required'),
      title: yup.string().required('Title is required')
    })
  ),
  has_started_trading: yup.string().required('Start trading date is required'),
  start_trading_date: yup.string().required('Start trading date is required'),
  is_profitable: yup
    .string()
    .required(
      'Please select whether your business has been profitable in the last 12 months'
    ),
  accepts_card_payment: yup
    .string()
    .required('Accepts Card Payment field is required ')
    .oneOf(
      ['Yes', 'No'],
      'Accepts card payment must be one of the following values: Yes, No'
    ),
  average_weekly_card_sales: yup
    .number()
    .typeError('Average weekly card sales must be a number')
    .positive('Please select a weekly card sales greater than 0.')
    .when('accepts_card_payment', ([acceptCardPayment], schema) =>
      acceptCardPayment === 'Yes'
        ? schema.required('Please select your average weekly card sales')
        : schema.notRequired()
    ),

  average_monthly_turnover: yup
    .number()
    .typeError('Average monthly total turnover must be a number')
    .required('Average monthly total turnover is required')
    .positive('Please select a monthly turnover greater than 0.'),
  business_sector: yup.string().required('Business sector is required'),
  other_business_name: yup
    .string()
    .when('business_sector', ([businessSector], sch) =>
      businessSector === 'Other business'
        ? sch.required('Name of other business is required')
        : sch.notRequired()
    )
});

export const addressSchema = yup.object().shape({
  address_line: yup.string().required('Address line is required'),
  // town_city: yup.string().required("Town city is required"),
  post_code: yup
    .string()
    .required('Postcode is required')
    .matches(
      /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
      'Valid UK Postcode is required.'
    )
});

// const registeredPremiseSchema = yup.object().shape({
//   premise_type: yup
//     .string()
//     .required("Premise Type required")
//     .oneOf(["Freehold", "Leasehold", "Registered Lease"]),
//   leasehold: yup
//     .object()
//     .shape({
//       start_date: yup
//       .string()
//       // .test(
//       //   'leasehold-start-date-condition',
//       //   'Registered Address File Upload is required', // custom message
//       //   function (value) {
//       //     console.log("this",this);

//       //     console.log("this.parent",this.parent);

//       //     const { premise_type } = this.parent.parent; // Accessing the parent's parent to get the outer premise_type
//       //     return premise_type !== 'Leasehold' || !!value; // Only require this if premise_type is 'Leasehold'
//       //   }
//       // ),
//       .when(["..premise_type"], ([premise_type], schema) => {
//         console.log("premise_type",premise_type);
//         console.log("schema",schema);

//         return  premise_type === "Leasehold"
//       ? schema.required("Registered Address File Upload is required")
//       : schema.notRequired()

//     } ),
//     end_date: yup
//       .string()
//       .required("Registered Leasehold End Date is required"),
//     document: yup
//       .mixed()
//       .required("Registered Address File Upload is required"),
//     })
// });

export const registeredPremiseSchema = yup.object().shape({
  premise_type: yup
    .string()
    .required('Premise Type required')
    .oneOf(
      ['Freehold', 'Leasehold', 'Registered Lease'],
      'Premise Type must be one of the following values: Freehold, Leasehold, Registered Lease'
    ),
  start_date: yup.string().when('premise_type', ([premise_type], schema) => {
    return premise_type === 'Leasehold'
      ? schema.required('Start Date is required')
      : schema.notRequired();
  }),
  end_date: yup.string().when('premise_type', ([premise_type], schema) => {
    return premise_type === 'Leasehold'
      ? schema.required('End Date is required')
      : schema.notRequired();
  }),
  document: yup.mixed().when('premise_type', ([premise_type], schema) => {
    if (premise_type === 'Leasehold') {
      return schema
        .required('Document is required')
        .test('fileFormat', 'Document is required', value => {
          if (Array.isArray(value) && value?.length > 0) {
            return true;
          }
          return false;
        })
        .test(
          'fileFormat',
          'Only JPG, GIF, PNG, JPEG, SVG,WebP and PDF formats are accepted',
          value => {
            if (Array.isArray(value) && value?.length > 0) {
              for (let i = 0; i < value?.length; i++) {
                if (
                  [...validMimeTypes.image, ...validMimeTypes.pdf].includes(
                    value[i].type
                  )
                ) {
                  return true;
                }
              }
            }
            return false;
          }
        )
        .test('fileSize', 'File Size is too large', value => {
          if (Array.isArray(value) && value?.length > 0) {
            for (let i = 0; i < value?.length; i++) {
              if (value[i].size < MAX_FILE_SIZE_2_MB) {
                return true;
              }
            }
          }
          return false;
        });
    } else {
      return schema.notRequired();
    }
  })
});

export const BusinessPremiseDetailsSchema = yup.object().shape({
  registered_address: yup.object().shape({
    ...addressSchema.fields,
    ...registeredPremiseSchema.fields
  }),
  trading_same_as_registered: yup.boolean(),
  trading_address: yup
    .object()
    .when('trading_same_as_registered', ([trading_same_as_registered]) =>
      trading_same_as_registered === true
        ? yup.object().strip()
        : yup.object().shape({
            ...addressSchema.fields,
            ...registeredPremiseSchema.fields
          })
    )
});

export const DirectorOrProprietorDetailsSchema = yup.object().shape({
  directors: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Title is required'),
      first_name: yup.string().required('FirstName is required'),
      last_name: yup.string().required('LastName is required'),
      phone_number: yup
        .string()
        .required('Phone number is required.')
        .matches(
          /^[0-9]{10}$/,
          'Phone number must be a valid 10-digit UK number'
        ),
      email: yup
        .string()
        .required('Email is required.')
        .matches(emailValidationRegex, 'Invalid Email.'),
      stay: yup.array().of(
        yup.object().shape({
          pincode: yup
            .string()
            .required('Postcode is required')
            .matches(
              /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
              'Valid UK Postcode is required.'
            ),
          address: yup.string().required('address is required'),
          house_ownership: yup
            .string()
            .required('house Ownership is required')
            .oneOf(
              ['Owned', 'Tenant', 'Family Owned', 'Spouse Owned'],
              'House Ownership must be one of the following values: Owned, Tenant, Family Owned, Spouse Owned'
            ),
          // start_date: yup.string().required("Start date is required"),
          start_date: yup.string().required('Start date is required'),
          end_date: yup.string().required('End date is required'),
          excludeDateIntervals: yup.array().notRequired()
          // start_date: yup.date().required("start date is required"),
          // end_date: yup.date().required("end date Of Stay is required"),
        })
      ),
      owns_other_property: yup
        .string()
        .oneOf(
          ['Yes', 'No'],
          'Owns other property must be one of the following values: Yes, No'
        )
        .required('Own Other Property is required'),
      owned_property_count: yup
        .number()
        .typeError('Owned Property Count must be a number')
        .when('owns_other_property', ([owns_other_property], sch) => {
          return owns_other_property === 'Yes'
            ? sch
                .required('Owned Property Count is required')
                .positive('Owned Property Count must be positive')
                .min(1, 'Owned Property Count must be minimum of 1')
            : sch.notRequired();
        }),
      owned_property: yup.array().of(
        yup.object().shape({
          pincode: yup
            .string()
            .matches(
              /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
              'Valid UK Postcode is required.'
            )
            .required('Postcode is required'),
          address: yup.string().required('address is required')
        })
      )
    })
  )
});

const MarketingPreferencesSubSchema = yup.object().shape({
  email: yup.boolean(),
  post: yup.boolean(),
  sms: yup.boolean(),
  social_media: yup.boolean(),
  telephone: yup.boolean()
});

export const MarketingPreferencesSchema = yup.object().shape({
  receiving_marketing_info: MarketingPreferencesSubSchema,
  sending_marketing_information: MarketingPreferencesSubSchema,
  third_party_sharing: MarketingPreferencesSubSchema
});

//ToDo

// export const DocumentationUploadsSchema = yup.object().shape({
//   photo: yup.mixed().required("Photo of owner in business premises is required"),
//   passport_or_driving_license: yup
//     .mixed()
//     .required("Passport/Driving License is required"),
//   utility_bill_of_trading_business: yup
//     .mixed()
//     .required("Latest Utility bill of Trading Business is required"),
//   lease_deed: yup.mixed().required("Business premises lease deed is required"),
//   business_account_statement: yup
//     .array()
//     .min(6, "Business account statement for 6 months is required")
//     .required("Business account statement for 6 months is required"),
//   other_files: yup
//     .array()
//     .min(1, "Please select at least one file")
//     .required("Other Files are required"),
//   document_upload_self_declaration: yup.boolean().required("Self declared acknowledgment statement is required"),
// });

const validMimeTypes = {
  image: [
    'image/jpg',
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/webp'
  ],
  pdf: ['application/pdf'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};

// Function to check if the file type is valid
const isValidMimeType = (type: string, categories: string[]) => {
  return categories.some(category => validMimeTypes[category].includes(type));
};

// 2 MB in bytes
export const MAX_FILE_SIZE_2_MB = 2 * 1024 * 1024;

export const DocumentationUploadsSchema = yup.object().shape({
  photo: yup
    .mixed<File>()
    .test(
      'is-valid-type',
      'Only JPG, GIF, PNG, JPEG, SVG, WebP and PDF formats are accepted',
      (value: File | null) => {
        if (!value?.[0]) return true;
        return isValidMimeType(value?.[0]?.type, ['image', 'pdf']);
      }
    )
    .test('is-valid-size', 'Max allowed size is 2MB', (value: File | null) => {
      if (!value?.[0]) return true;
      return value?.[0]?.size <= MAX_FILE_SIZE_2_MB;
    }),
  passport: yup
    .mixed<File>()
    .test(
      'is-valid-type',
      'Only JPG, GIF, PNG, JPEG, SVG,WebP, and PDF formats are accepted',
      (value: File | null) => {
        if (!value?.[0]) return true;
        return isValidMimeType(value?.[0]?.type, ['pdf', 'image']);
      }
    )
    .test('is-valid-size', 'Max allowed size is 2MB', (value: File | null) => {
      if (!value?.[0]) return true;
      return value?.[0]?.size <= MAX_FILE_SIZE_2_MB;
    }),
  driving_license: yup
    .mixed<File>()
    .test(
      'is-valid-type',
      'Only JPG, GIF, PNG, JPEG, SVG,WebP and PDF formats are accepted',
      (value: File | null) => {
        if (!value?.[0]) return true;
        return isValidMimeType(value?.[0]?.type, ['pdf', 'image']);
      }
    )
    .test('is-valid-size', 'Max allowed size is 2MB', (value: File | null) => {
      if (!value?.[0]) return true;
      return value?.[0]?.size <= MAX_FILE_SIZE_2_MB;
    }),
  utility_bill: yup
    .mixed<File>()
    .test(
      'is-valid-type',
      'Only PDF format is accepted',
      (value: File | null) => {
        if (!value?.[0]) return true;
        return isValidMimeType(value?.[0]?.type, ['pdf']);
      }
    )
    .test('is-valid-size', 'Max allowed size is 2MB', (value: File | null) => {
      if (!value?.[0]) return true;
      return value?.[0]?.size <= MAX_FILE_SIZE_2_MB;
    }),
  council_tax: yup
    .mixed<File>()
    .test(
      'is-valid-type',
      'Only PDF format is accepted',
      (value: File | null) => {
        if (!value?.[0]) return true;
        return isValidMimeType(value?.[0]?.type, ['pdf']);
      }
    )
    .test('is-valid-size', 'Max allowed size is 2MB', (value: File | null) => {
      if (!value?.[0]) return true;
      return value?.[0]?.size <= MAX_FILE_SIZE_2_MB;
    }),
  lease_deed: yup
    .mixed<File>()
    .test(
      'is-valid-type',
      'Only PDF format is accepted',
      (value: File | null) => {
        if (!value?.[0]) return true;
        return isValidMimeType(value?.[0].type, ['pdf']);
      }
    )
    .test('is-valid-size', 'Max allowed size is 2MB', (value: File | null) => {
      if (!value?.[0]) return true;
      return value?.[0]?.size <= MAX_FILE_SIZE_2_MB;
    }),

  // business_account_statements: yup
  //   .array()
  //   .min(0, "Please upload your business account statements for the last 6 months.")
  //   .of(
  //     yup
  //       .mixed<File>()
  //       .test("is-valid-type", "Only PDF and XLSX formats are accepted", (value: File | null) => {
  //         if (!value) return false;
  //         return isValidMimeType(value.type, ["pdf", "xlsx"]);
  //       })
  //       .test("is-valid-size", "Max allowed size is 2MB", (value: File | null) => {
  //         if (!value) return false;
  //         return value?.size <= MAX_FILE_SIZE_2_MB;
  //       })
  //   ),
  other_files: yup
    .array()
    .min(0, 'Other files are required')
    .of(
      yup
        .mixed<File>()
        .test(
          'is-valid-type',
          'Only JPG, GIF, PNG, JPEG, SVG,WebP, PDF and XLSX formats are accepted',
          (value: File | null) => {
            if (!value) return false;
            return isValidMimeType(value.type, ['pdf', 'xlsx', 'image']);
          }
        )
        .test(
          'is-valid-size',
          'Max allowed size is 2MB',
          (value: File | null) => {
            if (!value) return false;
            return value.size <= MAX_FILE_SIZE_2_MB;
          }
        )
    ),

  document_upload_self_declaration: yup
    .boolean()
    .typeError('Must agree the Agreement')
    .when(
      [
        'photo',
        'passport',
        'driving_license',
        'utility_bill',
        'council_tax',
        'lease_deed',
        // 'business_account_statements',
        'other_files'
      ],
      (files, sch) => {
        return files.some(file => file && file.length > 0)
          ? sch.required().oneOf([true], 'Must agree the Agreement')
          : sch.notRequired();
      }
    )
});
// export const GuarantorSchema = yup.object().shape({

//   guarantors: yup.array().of(
//     yup.object({
//       title: yup.string().required("Title is required"),
//       first_name: yup.string().required("FirstName is required"),
//       last_name: yup.string().required("LastName is required"),
//       phone_number: yup
//         .string()
//         .required("Phone number is required.")
//         .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit UK number"),
//       email: yup.string().required("Email is required.").matches(
//       emailValidationRegex,
//       "Invalid Email."
//     ),
//       // stay_validated: yup.boolean().optional(),
//       stay: yup.array().of(
//         yup.object({
//           pincode: yup
//           .string()
//           .required("Postcode is required")
//           .matches(
//             /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
//             "Valid UK Postcode is required."
//           ),
//           address: yup.string().required("address is required"),
//           house_ownership: yup
//           .string()
//           .required("house Ownership is required")
//           .oneOf(["Owned", "Tenant", "Family Owned", "Spouse Owned"],"House Ownership must be one of the following values: Owned, Tenant, Family Owned, Spouse Owned"),
//           start_date: yup.string().required("Start date is required"),
//           end_date: yup.string().required("End date is required"),
//           excludeDateIntervals:yup.array().notRequired()
//         })
//       ),
//        owns_other_property: yup
//         .string()
//         .oneOf(["Yes", "No"],"Owns other property must be one of the following values: Yes, No")
//         .required("Own Other Property is required"),
//         owned_property_count: yup
//         .number()
//         .typeError("Owned Property Count must be a number")
//         .when("owns_other_property", ([owns_other_property], sch) => {
//           return owns_other_property === "Yes"
//             ? sch.required("Owned Property Count is required")
//             .positive("Owned Property Count must be positive")
//             .min(1, "Owned Property Count must be minimum of 1")
//             : sch.notRequired();
//         }),
//         owned_property: yup.array().of(
//           yup.object().shape({
//             pincode: yup
//               .string()
//               .matches(
//                 /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
//                 "Valid UK Postcode is required."
//               )
//               .required("Postcode is required"),
//             address: yup
//               .string()
//               .required("address is required"),
//           })
//         ),
//     })
//   ),
// });
export const GuarantorSchema = yup.object().shape({
  guarantors: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Title is required'),
      first_name: yup.string().required('FirstName is required'),
      last_name: yup.string().required('LastName is required'),
      phone_number: yup
        .string()
        .required('Phone number is required.')
        .matches(
          /^[0-9]{10}$/,
          'Phone number must be a valid 10-digit UK number'
        ),
      email: yup
        .string()
        .required('Email is required.')
        .matches(emailValidationRegex, 'Invalid Email.'),
      stay: yup.array().of(
        yup.object().shape({
          pincode: yup
            .string()
            .required('Postcode is required')
            .matches(
              /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
              'Valid UK Postcode is required.'
            ),
          address: yup.string().required('address is required'),
          house_ownership: yup
            .string()
            .required('house Ownership is required')
            .oneOf(
              ['Owned', 'Tenant', 'Family Owned', 'Spouse Owned'],
              'House Ownership must be one of the following values: Owned, Tenant, Family Owned, Spouse Owned'
            ),
          // start_date: yup.string().required("Start date is required"),
          start_date: yup.string().required('Start date is required'),
          end_date: yup.string().required('End date is required'),
          excludeDateIntervals: yup.array().notRequired()
          // start_date: yup.date().required("start date is required"),
          // end_date: yup.date().required("end date Of Stay is required"),
        })
      ),
      owns_other_property: yup
        .string()
        .oneOf(
          ['Yes', 'No'],
          'Owns other property must be one of the following values: Yes, No'
        )
        .required('Own Other Property is required'),
      owned_property_count: yup
        .number()
        .typeError('Owned Property Count must be a number')
        .when('owns_other_property', ([owns_other_property], sch) => {
          return owns_other_property === 'Yes'
            ? sch
                .required('Owned Property Count is required')
                .positive('Owned Property Count must be positive')
                .min(1, 'Owned Property Count must be minimum of 1')
            : sch.notRequired();
        }),
      owned_property: yup.array().of(
        yup.object().shape({
          pincode: yup
            .string()
            .matches(
              /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
              'Valid UK Postcode is required.'
            )
            .required('Postcode is required'),
          address: yup.string().required('address is required')
        })
      )
    })
  )
});

// export const GuarantorSchema = yup.object().shape({
//   directors: yup.array().of(
//     yup.object().shape({
//       title: yup.string().required("Title is required"),
//       first_name: yup.string().required("FirstName is required"),
//       last_name: yup.string().required("LastName is required"),
//       phone_number: yup
//         .string()
//         .required("Phone number is required.")
//         .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit UK number"),
//       email: yup.string().required("Email is required.").matches(
//       emailValidationRegex,
//       "Invalid Email."
//     ),
//       stay: yup.array().of(
//         yup.object().shape({
//           pincode: yup
//             .string()
//             .required("Postcode is required")
//             .matches(
//               /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
//               "Valid UK Postcode is required."
//             ),
//           address: yup.string().required("address is required"),
//           house_ownership: yup
//             .string()
//             .required("house Ownership is required")
//             .oneOf(["Owned", "Tenant", "Family Owned", "Spouse Owned"],"House Ownership must be one of the following values: Owned, Tenant, Family Owned, Spouse Owned"),
//             // start_date: yup.string().required("Start date is required"),
//           start_date: yup.string().required("Start date is required"),
//           end_date: yup.string().required("End date is required"),
//           excludeDateIntervals:yup.array().notRequired()
//           // start_date: yup.date().required("start date is required"),
//           // end_date: yup.date().required("end date Of Stay is required"),
//         })
//       ),
//       owns_other_property: yup
//         .string()
//         .oneOf(["Yes", "No"],"Owns other property must be one of the following values: Yes, No")
//         .required("Own Other Property is required"),
//       owned_property_count: yup
//         .number()
//         .typeError("Owned Property Count must be a number")
//         .when("owns_other_property", ([owns_other_property], sch) => {
//           return owns_other_property === "Yes"
//             ? sch.required("Owned Property Count is required")
//             .positive("Owned Property Count must be positive")
//             .min(1, "Owned Property Count must be minimum of 1")
//             : sch.notRequired();
//         }),
//       owned_property: yup.array().of(
//         yup.object().shape({
//           pincode: yup
//             .string()
//             .matches(
//               /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/,
//               "Valid UK Postcode is required."
//             )
//             .required("Postcode is required"),
//           address: yup
//             .string()
//             .required("address is required"),
//         })
//       ),
//     })
//   ),
// });

export const LoginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required.')
    .matches(emailValidationRegex, 'Invalid Username.'),
  password: yup.string().required('Password is required.'),
  remember_me: yup.boolean()
});

export const FogotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(emailValidationRegex, 'Invalid Email.')
});

export const NewPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
});

export const ChangePasswordSchema = yup.object().shape({
  old_password: yup.string().required('Old password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .notOneOf(
      [yup.ref('old_password')],
      'New password must be different from the old password'
    ),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('new_password'), null], 'Passwords must match')
});

export const ProfileSchema = yup.object().shape({
  drivingLicence: yup.mixed().required('Title is required'),
  utilityBill: yup.mixed().required('Title is required'),
  councilTax: yup.mixed().required('Title is required'),

  title: yup.string().required('Title is required'),
  firstName: yup.string().required('FirstName is required'),
  lastName: yup.string().required('LastName is required'),
  photoId: yup
    .mixed()
    .required('Photo ID is required')
    .test(
      'fileType',
      'Invalid file type. Only JPG, JPEG, and PNG are allowed.',
      value => {
        if (value) {
          // return (
          //   ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type) &&
          //   value.size <= 5 * 1024 * 1024 // 5 MB
          // );
        }
        return true; // If no file uploaded, it's valid
      }
    ),
  addressProof: yup
    .mixed()
    .required('Address Proof is required')
    .test(
      'fileType',
      'Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed.',
      value => {
        if (value) {
          // return (
          //   ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(value.type) &&
          //   value.size <= 5 * 1024 * 1024 // 5 MB
          // );
        }
        return true; // If no file uploaded, it's valid
      }
    )
});

export const dynamicPlanFieldsSchema = yup.object().shape({
  day_of_debit: yup.string().required('Days of Debit is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Amount is required')
    .positive('Must be a positive number'),
  start_date: yup.string().required('Start Date is required'),
  no_of_installments: yup
    .number()
    .typeError('Number of installments must be a number')
    .transform(value => (isNaN(value) ? undefined : value))
    .required('No of Installments is required')
    .positive('Must be a positive number'),
  total_amount_collected: yup
    .number()
    .typeError('Total amount collected must be a number')
    .notRequired()
});

export const dynamicSubscriptionFieldsSchema = yup.object().shape({
  day_of_debit: yup.string().required('Days of Debit is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Amount is required')
    .positive('Must be a positive number'),
  start_date: yup.string().required('Start Date is required'),
  period: yup
    .number()
    .typeError('Period must be a number')
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Period is required')
    .positive('Must be a positive number'),
  reference_number: yup
    .number()
    .typeError('Reference Number must be a number')
    .transform(value => (isNaN(value) ? undefined : value))
    .positive('Must be a positive number')
});

export const paymentArrangementPlanSchema = yup.object().shape({
  contract_id: yup.string().required('Contract ID is required'),

  company_name: yup.string().required('Company Name is required'),
  customer_name: yup.string().required('Customer Name is required'),
  account_number: yup.string().required('Account Number is required'),
  sort_code: yup.string().required('Sort Code is required'),
  bank: yup.string().required('Bank is required'),
  application_number: yup.string().required('Application No is required'),
  advanced_amount: yup
    .number()
    .typeError('Advanced amount must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .integer()
    .required('Advanced amount is required'),
  period: yup.string().required('Period is required'),
  total_repayable_amount: yup
    .number()
    .typeError('Total Repayable amount must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Total repayable amount is required'),
  pending_due: yup
    .number()
    .typeError('Pending due must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Pending due is required'),

  // paymentArrangementPlan: yup.string().required('Payment Arrangement Plan is required'),

  adjustment_plans: yup
    .array()
    .of(dynamicPlanFieldsSchema)
    .required('At least one Adjustment Plan is required')
});

export const subscriptiontSchema = yup.object().shape({
  contract_id: yup.string().required('Contract ID is required'),

  company_name: yup.string().required('Company Name is required'),
  customer_name: yup.string().required('Customer Name is required'),
  account_number: yup.string().required('Account Number is required'),
  sort_code: yup.string().required('Sort Code is required'),
  bank: yup.string().required('Bank is required'),
  reference_number: yup.string().required('Referrence No is required'),

  subscriptions: yup
    .array()
    .of(dynamicSubscriptionFieldsSchema)
    .required('At least one Adjustment Plan is required')
});

export const disbursementAdviseSchema = yup.object().shape({
  // contractId: yup.string().required('Contract ID is required'),
  unit_name: yup.string(),
  field_agent_name: yup.string(),
  customer_relation_start_date: yup.date(),
  no_of_contracts_executed: yup
    .number()
    .typeError('Number of contracts executed must be a number'),
  value_of_total_contracts: yup
    .number()
    .typeError('Valueof total contracts must be a number'),
  income_earned: yup.number().typeError('Income Earned must be a number'),
  present_outstanding: yup
    .number()
    .typeError('Present outstanding must be a number'),
  pending_dues: yup.number().typeError('Pending dues must be a number'),
  no_of_missed_payments: yup
    .number()
    .typeError('Number of missed payments must be a number'),
  active_contracts: yup
    .array()
    .of(
      yup.object().shape({
        loan_id: yup.string().required(),
        outstanding_amount: yup.number().required(),
        loan_number: yup.number().required()
      })
    )
    .required(),

  total_sales: yup.number().typeError('Total sales must be a number'),
  card_sales: yup.number().typeError('Card sales must be a number'),

  amount_to_be_adjusted: yup
    .number()
    .typeError('Amount to be adjusted must be a number'),
  amount_to_be_disbursed: yup
    .number()
    .typeError('Amount to be disbursed must be a number'),

  repayment_period: yup.number().typeError('Repayment period must be a number'),
  repayment_amount: yup.number().typeError('Repayment amount must be a number'),

  remarks_by_recommender: yup
    .string()
    .required('Remarks by Recommender is required'),
  remarks_by_approver: yup.string().required('Remarks by Approver is required'),

  bank_account_details: yup.object().shape({
    account_holder_name: yup.string(),
    // address: yup.string(),
    bank_account_number: yup.string(),
    bank_sort_code: yup.string(),
    bank_name: yup.string()
  }),
  directors_details: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      credit_score: yup.number().typeError('Credit score must be a number'),
      risk_score: yup.number().typeError('Risk score must be a number')
    })
  ),
  guarantors_details: yup.object().shape({
    name: yup.string(),
    credit_score: yup.number().typeError('Credit score must be a number'),
    risk_score: yup.number().typeError('Risk score must be a number')
  })
});

export const cashReceiptSchema = yup.object().shape({
  contract_id: yup.string().required('Contract ID is required'),
  company_name: yup.string().required('Company Name is required'),
  customer_name: yup.string().required('Customer Name is required'),
  application_number: yup.string().required('Application No is required'),
  advanced_amount: yup
    .number()
    .typeError('Advanced amount must be a number')
    .required('Advanced Amount is required')
    .positive('Must be a positive number'),
  period: yup.string().required('Period is required'),
  total_repayable_amount: yup
    .number()
    .typeError('Total repayable_amount must be a number')
    .required('Total Repayable Amount is required')
    .positive('Must be a positive number'),
  pending_due: yup
    .number()
    .typeError('Pending due must be a number')
    .required('Pending Due is required')
    .positive('Must be a positive number'),
  outstanding_amount: yup
    .number()
    .typeError('Outstanding_amount must be a number')
    .required('Outstanding Amount is required')
    .positive('Must be a positive number'),
  failed_mandates: yup
    .array()
    .of(
      yup.object().shape({
        contract_id: yup.string().required('Contract ID is required'),
        date: yup.date().required('Date is required'),
        amount: yup
          .number()
          .typeError('Amount must be a number')
          .required('Amount is required')
          .positive('Must be a positive number'),
        status: yup.string().required('Status is required'),
        received_date: yup.date().required('Received Date is required'),
        received_amount: yup
          .number()
          .typeError('Received amount must be a number')
          .required('Received Amount is required')
          .positive('Must be a positive number'),
        loan_number: yup.number()
      })
    )
    .required('At least one Failed Mandate is required')
});

export const ledgerFilterSchema = yup.object().shape({
  gl_code: yup.string().required('Gl code is required'),
  gl_name: yup.string().required('Gl Name is required'),
  from_date: yup.string().required('From date is required'),
  to_date: yup.string().required('To date is required')
});

export const summaryFilterSchema = yup.object().shape({
  // gl_code: yup.string().required('Gl code is required'),
  // gl_name: yup.string().required('Gl Name is required'),
  date_from: yup.string().required('From date is required'),
  date_to: yup.string().required('To date is required')
});
export const financialStatementDateSchema = yup.object().shape({
  date_from: yup.string().required('From date is required'),
  date_to: yup.string().required('To date is required')
});

export const fundingRemarksSchema = yup.object().shape({
  remarks: yup.string().required('Remark is required')
});

export const fundingCommentsSchema = yup.object().shape({
  comment: yup.string().required('Comment is required')
});

export const fundingOfferSchema = yup.object().shape({
  offer_amount: yup
    .number()
    .typeError('Fund request amount must be a number')
    .transform((_, originalValue) => parseFloat(originalValue) || 0)
    .required('Fund request amount is required')
    .positive('Fund request amount must be positive')
    .max(50000, 'Fund request amount must be less than or equal to £50,000'),
  offer_number_of_weeks: yup
    .number()
    .typeError('Duration must be a number')
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be an integer')
    .min(5, 'Duration must be minimum of 5 weeks')
    .max(40, 'Duration must be maximum of 40 weeks')
});

export const affordabilityGeneralSchema = yup.object().shape({
  statement_start_date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  statement_end_date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  period_of_statement: yup
    .number()
    .typeError('Period of Statement must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .integer()
    .required('Period of Statement is required'),
  credit_summation: yup
    .number()
    .typeError('Credit Summation  must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Credit Summation is required'),
  debit_summation: yup
    .number()
    .typeError('Debit Summation must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Debit Summation is required'),
  card_sales: yup
    .number()
    .typeError('Card Sales must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Card Sales is required'),
  cash_sales: yup
    .number()
    .typeError('Cash Sales must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Cash Sales is required'),
  other_receipts: yup
    .number()
    .typeError('Other Receipts must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Other Receipts is required'),
  total_sales: yup
    .number()
    .typeError('Total Sales must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Total Sales is required'),
  previous_sales: yup
    .number()
    .typeError('Previous Sales must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Previous Sales is required'),
  payments: yup
    .number()
    .typeError('Payments must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Payments is required'),
  purchases: yup
    .number()
    .typeError('Purchases must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Purchases is required'),
  wages: yup
    .number()
    .typeError('Wages must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Wages is required'),
  other_expenses: yup
    .number()
    .typeError('Other Expenses must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Other Expenses is required'),
  total_expenses_considered: yup
    .number()
    .typeError('Total Expenses Considered must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Total Expenses Considered is required'),
  net_sales: yup
    .number()
    .typeError('Net Sales must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Net Sales is required'),
  paypoint_payzone: yup
    .number()
    .typeError('Paypoint/Payzone must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Paypoint/Payzone is required'),
  c4b_existing_monthly: yup
    .number()
    .typeError('C4B Existing Monthly must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('C4B Existing Monthly is required'),
  liabilities: yup
    .number()
    .typeError('Liabilities must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Liabilities is required'),
  other_monthly_liabilities: yup
    .number()
    .typeError('Other Monthly Liabilities must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Other Monthly Liabilities is required'),
  total_liabilities: yup
    .number()
    .typeError('Total Liabilities must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Total Liabilities is required')
});

export const affordabilityGrossSchema = yup.object().shape({
  gross_affordability_weekly: yup
    .number()
    .typeError('Gross Affordability (Weekly) must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Gross Affordability (Weekly) is required'),

  profit_margin: yup
    .number()
    .typeError('Profit Margin must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Profit Margin is required'),

  self_withdrawals: yup
    .number()
    .typeError('Self Withdrawals must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Self Withdrawals is required'),

  self_business_contribution: yup
    .number()
    .typeError('Self Business Contribution must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Self Business Contribution is required'),

  net_investment_into_business: yup
    .number()
    .typeError('Net Investment into Business must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Net Investment into Business is required'),

  net_affordability_weekly: yup
    .number()
    .typeError('Net Affordability (Weekly) must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Net Affordability (Weekly) is required'),

  sales_as_per_till_report: yup
    .number()
    .typeError('Sales as Per Till Report must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Sales as Per Till Report is required'),

  period_of_till_report_days: yup
    .number()
    .typeError('Period of Till Report available (in Days) must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .integer()
    .required('Period of Till Report available (in Days) is required'),

  sales_for_period_of_statement: yup
    .number()
    .typeError('Sales for the Period must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Sales for the Period of Statement is required'),

  repayment_term: yup
    .number()
    .typeError('Repayment Term must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .positive('Repayment Term must be a positive number')
    .required('Repayment Term is required')
    .integer('Repayment Term must be an integer')
    .min(10, 'Repayment Term must be minimum of 10 weeks')
    .max(30, 'Repayment Term must be maximum of 30 weeks'),

  merchant_factor: yup
    .number()
    .typeError('MERCHANT FACTOR must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('MERCHANT FACTOR is required'),

  ideal_limit: yup
    .number()
    .typeError('Ideal LIMIT must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null ? undefined : value;
    })
    .required('Ideal LIMIT is required'),

  max_limit: yup
    .number()
    .typeError('Max Limit must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null ? undefined : value;
    })
    .required('Max Limit is required'),

  recommended_amount: yup
    .number()
    .typeError('Recommended Amount must be a number')
    .transform((_, originalValue) => parseFloat(originalValue) || 0)
    .positive('Recommended Amount must be a positive number')
    .required('Recommended Amount is required')
    .min(3000, 'Recommended Amount must be grater than or equal to £3000')
    .max(50000, 'Recommended Amount must be less than or equal to £50,000'),

  amount_to_be_adjusted: yup
    .number()
    .typeError('Amount to be Adjusted must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Amount to be Adjusted is required'),

  final_release_amount: yup
    .number()
    .typeError('Final Release Amount must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Final Release Amount is required'),

  remarks: yup.string().required('Remarks are required')
});

export const affordabilityApprovalSchema = yup.object().shape({
  sales_as_per_till_report: yup
    .number()
    .typeError('SALES AS PER TILL REPORT must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('SALES AS PER TILL REPORT is required'),

  cash_sales_not_reflected: yup
    .number()
    .typeError('CASH SALES NOT REFLECTED must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('CASH SALES NOT REFLECTED is required'),

  corrected_net_sales: yup
    .number()
    .typeError('CORRECTED NET SALES must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('CORRECTED NET SALES is required'),

  corrected_gross_affordability: yup
    .number()
    .typeError('CORRECTED GROSS AFFORDABILITY must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('CORRECTED GROSS AFFORDABILITY is required'),

  corrected_net_affordability: yup
    .number()
    .typeError('CORRECTED NET AFFORDABILITY must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('CORRECTED NET AFFORDABILITY is required'),

  approved_amount: yup
    .number()
    .typeError('Approved Amount must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .positive('Approved Amount must be a positive number')
    .required('Approved Amount is required'),

  remarks_by_approver: yup.string().required('Remark is required'),

  amount_to_be_adjusted_by_approver: yup
    .number()
    .typeError('Amount to be Adjusted must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Amount to be Adjusted is required'),

  final_release_amount_by_approver: yup
    .number()
    .typeError('Final Release Amount  must be a number')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Final Release Amount is required')
});

export const underWriterFormVerifySchema = yup.object().shape({
  personal_details: yup.boolean(),
  // .required("Personal Details verification is required"),
  business_details: yup.boolean(),
  // .required("Business Details verification is required"),
  business_premis_details: yup.boolean(),
  // .required("Business Premise Details verification is required"),
  marketing_preferences: yup.boolean(),
  // .required("Marketing Preferences verification is required"),
  director_detail: yup.boolean(),
  // .required("Director Detail verification is required"),
  documents: yup.boolean(),
  // .required("Documents verification is required"),
  guarantors: yup.boolean(),
  // .required("Guarantors verification is required"),
  identity_verified: yup.boolean(),
  // .required("Identity verified verification is required"),
  gocardless_statement: yup.boolean()
  // .required("Gocardless Statement verification is required"),
});

export const ClientFormSchema = yup.object().shape({
  number_of_client_target: yup
    .number()
    .required('Number Of Client Target is required')
    .typeError('Number Of Client Target must be a number')
    .positive('Must be a positive number')
    .max(99999999, 'Cannot be more than 8 digits'),

  fund_disbursement_target: yup
    .number()
    .required('Fund Disbursement Target is required')
    .typeError('Fund Disbursement Target must be a number')
    .positive('Must be a positive number')
    .max(99999999, 'Cannot be more than 8 digits')
});

export const BankDetailsSchema = yup.object().shape({
  bank_name: yup.string().required('Bank Name is required'),
  account_number: yup
    .number()
    .typeError('Account Number must be a number')
    .required('Account Number is required')
    .test(
      'len',
      'Account Number must be exactly 8 digits',
      val => val && val.toString().length === 8
    ),
  sort_code: yup
    .number()
    .typeError('Sort Code must be a number')
    .required('Sort Code is required')
    .test(
      'len',
      'Sort Code must be exactly 6 digits',
      val => val && val.toString().length === 6
    ),
  account_holder_name: yup
    .string()
    .required('Account Holder Name is required')
    .min(2, 'Account Holder Name must be at least 2 characters')
    .max(50, 'Account Holder Name must be at most 50 characters'),
  country_code: yup.string().required('Country Code is required'),
  business_account_statements: yup
    .array()
    .required(
      'Please upload your business account statements for the last 6 months.'
    )
    .min(1, 'At least one business account statement is required.')
    .max(6, 'You can upload up to 6 business account statements.')
    .of(
      yup
        .mixed<File>()
        .test(
          'is-valid-type',
          'Only JPG, GIF, PNG, JPEG, SVG,WebP, PDF and XLSX formats are accepted',
          (value: File | null) => {
            if (!value) return false;
            return isValidMimeType(value.type, ['pdf', 'xlsx', 'image']);
          }
        )
        .test(
          'is-valid-size',
          'Max allowed size is 2MB',
          (value: File | null) => {
            if (!value) return false;
            return value?.size <= MAX_FILE_SIZE_2_MB;
          }
        )
    )
});

export const EntrySchema = yup.object().shape({
  entryType: yup.string().required('Entry type required'),
  date: yup.string().required('Date required'),
  rows: yup.array().of(
    yup
      .object()
      .shape({
        gl_code: yup.string().nullable(),
        bp_code: yup.string().nullable(),
        account_name: yup.string().required('Account Name is required'),
        transition_type: yup
          .string()
          .required('Transition Type is required.')
          .oneOf(['debit', 'credit']),
        amount: yup
          .number()
          .typeError('Amount must be a number')
          .required('Amount is required')
          .min(0, 'Amount must be a positive number or zero'),
        narrative: yup.string().required('Narrative is required.'),
        loanId: yup.string().nullable(),
        loan_entry_type: yup
          .string()
          .when('loanId', ([loanId], sch) =>
            loanId
              ? sch.required('Credited To Type is required')
              : sch.notRequired()
          )
      })
      .test(
        'gl_or_bp_code_required', // test name
        'Either GL Code or BP Code is required', // validation message
        function (value) {
          return !!(value.gl_code || value.bp_code); // return true if either is provided
        }
      )
  )
});
