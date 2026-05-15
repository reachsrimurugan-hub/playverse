import { categories } from '../utils/constants';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  const { isOpen } = useSidebar();

  return (
    <div className={`w-full ${isOpen ? 'md:w-[240px]' : 'md:w-[88px]'} transition-all duration-300 flex md:flex-col overflow-x-auto md:overflow-y-auto custom-scrollbar md:h-full pb-2 md:pb-0 px-2 md:px-3 md:py-4 bg-yt-bg border-b md:border-b-0 md:border-r border-[#303030] shrink-0 sticky top-0 z-40 gap-1 md:gap-2`}>
      {categories.map((category) => (
        <button
          key={category.name}
          className={`flex items-center ${isOpen ? 'gap-4 px-4' : 'flex-col justify-center px-0 py-3 gap-1'} py-2.5 rounded-xl transition-all duration-300 min-w-fit md:min-w-0 ${
            selectedCategory === category.name
              ? 'bg-white text-yt-bg font-bold shadow-md'
              : 'text-yt-text hover:bg-yt-light'
          }`}
          onClick={() => setSelectedCategory && setSelectedCategory(category.name)}
        >
          <span className={`text-xl transition-colors duration-300 ${selectedCategory === category.name ? 'text-yt-bg' : 'text-red-500'}`}>
            {category.icon}
          </span>
          <span className={`whitespace-nowrap font-medium ${isOpen ? 'text-[15px]' : 'text-[10px] hidden md:block'}`}>{category.name}</span>
        </button>
      ))}
      <hr className={`border-[#303030] my-4 ${isOpen ? 'hidden md:block' : 'hidden'}`} />
      <p className={`text-yt-textMuted text-xs px-4 mt-auto ${isOpen ? 'hidden md:block' : 'hidden'}`}>
        © 2026 Nextube
      </p>
    </div>
  );
};

export default Sidebar;
