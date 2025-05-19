const AssetModal = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[80%] max-w-[600px] rounded bg-white p-4 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AssetModal;
