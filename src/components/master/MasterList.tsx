const MasterList = ({ Subtitle1, openModal, localAssets }) => {
  return (
    <>
      <details className="mb-1">
        <summary className="mb-0 cursor-pointer rounded-lg border border-gray-200 p-4">
          <span className="font-semibold max-sm:text-[14px]">{Subtitle1}</span>
          <div className="relative flex justify-end">
            <div
              className="absolute bottom-[2px] max-sm:text-[12px]"
              onClick={openModal}
            >
              {'ADD NEW'}
            </div>
          </div>
        </summary>

        <ul className="bg-white p-3">
          {(localAssets || []).map((asset, index) => (
            <div key={index}>
              <li className="text-gray-800">
                {'Name: '}
                {asset.gl_name}
              </li>
              <li className="text-gray-800">
                {'GL-Code: '}
                {asset.gl_code}
              </li>
              <br />
            </div>
          ))}
        </ul>
      </details>
    </>
  );
};

export default MasterList;
