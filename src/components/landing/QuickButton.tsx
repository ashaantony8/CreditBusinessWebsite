import quick from '../../assets/images/quickbusinessFinding.png';

const QuickButton: React.FC = () => {
  return (
    <>
      <button className="fixed bottom-[10%] right-0 z-50 flex w-[17%] justify-between rounded-l-lg bg-[#1A439A] max-sm:hidden md:h-[60px] lg:h-[60px] xl:h-[72px]">
        <span className="w-[30%]">
          {' '}
          <img
            src={quick}
            className="absolute -bottom-6 -left-4 w-[50%] transform transition-transform duration-300 ease-in-out hover:scale-105 md:h-[110px] lg:h-[110px] xl:h-[130px]"
          ></img>
        </span>
        <span className="p-2">
          {' '}
          <p className="py-1 text-left text-white md:text-[9px] lg:text-[11px] xl:text-[15px]">
            {'Quick Business '}
            <br />
            {'Funding in 2 hours*'}
          </p>
        </span>
      </button>
    </>
  );
};
export default QuickButton;
