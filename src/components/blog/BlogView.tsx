import Aboutimage from '../../assets/images/blog-image-1.png';
import date from '../../assets/images/date.png';

const BlogView = () => {
  return (
    <div className="bg-[#EDF3FF] pb-12">
      <div className="relative">
        <div className="w-full max-sm:h-[250px] md:h-[350px] lg:h-[350px]">
          <img
            src={Aboutimage}
            alt="Your Image"
            className="h-full w-full object-fill"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/30 py-8 backdrop-blur-[2px] backdrop-brightness-50">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <p className="my-4 font-Playfair text-[40px] font-bold text-white max-sm:text-2xl lg:text-[64px]">
              {'Blog Post'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-12 p-6 lg:px-16">
        <div className="mt-3 flex flex-col justify-between rounded-b bg-white leading-normal lg:rounded-b-none lg:rounded-r">
          <div className="relative top-0 -mt-28 bg-white p-5 sm:p-10">
            <div className="flex items-center justify-between py-2">
              <h5 className="text-2xl tracking-tight text-gray-900">
                {'Blog Post'}
              </h5>
              <p className="flex items-center text-[13.5px] font-normal text-gray-500">
                <img src={date} className="mr-2" />
                {'Sunday 22-10-2023'}
              </p>
            </div>
            <p className="my-5 text-base font-light leading-8 text-[#555555]">
              {
                'Lorem Ipsum is simply dummy text of the printing and typesetting'
              }
              {
                "industry. Lorem Ipsum has been the industry's standard dummy text"
              }
              {'ever since the 1500s, Lorem Ipsum is simply dummy text of the'}
              {'printing and typesetting industry. Lorem Ipsum has been the'}
              {
                "industry's standard dummy text ever since the 1500s, Lorem Ipsum"
              }
              {'is simply dummy text of the printing and typesetting industry.'}
              {
                "Lorem Ipsum has been the industry's standard dummy text ever since"
              }
              {
                'the 1500s, Lorem Ipsum is simply dummy text of the printing and'
              }
              {
                "typesetting industry. Lorem Ipsum has been the industry's standard"
              }
              {
                'dummy text ever since the 1500s, Lorem Ipsum is simply dummy text'
              }
              {
                'of the printing and typesetting industry. Lorem Ipsum has been the'
              }
              {
                "industry's standard dummy text ever since the 1500s, Lorem Ipsum"
              }
              {'is simply dummy text of the printing and typesetting industry.'}
              {
                "Lorem Ipsum has been the industry's standard dummy text ever since"
              }
              {
                'the 1500s, Lorem Ipsum is simply dummy text of the printing and'
              }
              {
                "typesetting industry. Lorem Ipsum has been the industry's standard"
              }
              {
                'dummy text ever since the 1500s, Lorem Ipsum is simply dummy text'
              }
              {
                'of the printing and typesetting industry. Lorem Ipsum has been the'
              }
              {"industry's standard dummy text ever since the 1500s,"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
