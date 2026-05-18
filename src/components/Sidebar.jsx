import { useSidebar } from '../context/SidebarContext';
import { categories } from '../utils/constants';

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  const { isOpen } = useSidebar();

  if (!isOpen) return null;

  return (
    <div className="w-64 bg-yt-bg border-r border-[#303030] flex flex-col h-full overflow-y-auto custom-scrollbar shrink-0">
      <div className="p-4 space-y-1">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory?.(category.id)}
            className={`w-full flex items-center gap-5 px-4 py-3 rounded-xl transition-all duration-200 group ${
              selectedCategory === category.id 
                ? 'bg-yt-light text-white font-bold' 
                : 'text-yt-text hover:bg-yt-hover'
            }`}
          >
            <span className={`${selectedCategory === category.id ? 'text-red-600' : 'text-yt-text group-hover:text-white'}`}>
              {category.icon}
            </span>
            <span className="text-[15px]">{category.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto p-4 border-t border-[#303030]">
        <p className="text-[12px] text-yt-textMuted px-4">
          © 2026 PlayVerse
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
