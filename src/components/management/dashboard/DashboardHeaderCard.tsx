import { CgProfile } from 'react-icons/cg';
import { RiCommunityLine, RiMoneyPoundBoxLine } from 'react-icons/ri';

const DashboardHeaderCard = () => {
  return (
    <>
      <div className="flex items-center justify-center bg-gray-200 p-10 text-gray-800">
        <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center rounded bg-white p-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-green-200">
              <RiMoneyPoundBoxLine className="h-6 w-6 fill-current text-green-700" />
            </div>
            <div className="ml-4 flex flex-grow flex-col">
              <span className="text-xl font-bold">{'Funding'}</span>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">{'Revenue last 30 days'}</span>
                <span className="ml-2 text-sm font-semibold text-green-500">
                  {'+12.6%'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center rounded bg-white p-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-red-200">
              <RiCommunityLine className="h-6 w-6 fill-current text-red-700" />
            </div>
            <div className="ml-4 flex flex-grow flex-col">
              <span className="text-xl font-bold">{'Units'}</span>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">{'Sales last 30 days'}</span>
                <span className="ml-2 text-sm font-semibold text-red-500">
                  {'-8.1%'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center rounded bg-white p-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-green-200">
              <CgProfile className="h-6 w-6 fill-current text-green-700" />
            </div>
            <div className="ml-4 flex flex-grow flex-col">
              <span className="text-xl font-bold">{'Customer'}</span>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  {'Customers last 30 days'}
                </span>
                <span className="ml-2 text-sm font-semibold text-green-500">
                  {'+28.4%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeaderCard;
