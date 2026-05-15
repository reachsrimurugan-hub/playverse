const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full min-h-[50vh]">
      <div className="relative flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 absolute"></div>
        <div className="rounded-full h-8 w-8 bg-red-600/20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loader;
