import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
// import { useNavigate } from "react-router-dom";
// import { useNavigation } from "@react-navigation/native";

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MobileHeader = ({ title, showBackButton = true, onBackClick }: MobileHeaderProps) => {
//   const navigate = useNavigation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
    //   navigate.navigate(-1);
    }
  };

  return (
    <div 
      className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 shadow-sm"
      style={{
        height: '128px',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px'
      }}
    >
      <div className="flex items-center justify-center relative h-full">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 
          className="text-center"
          style={{
            color: '#000',
            fontFamily: '"Plus Jakarta Sans"',
            fontSize: '17px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '17px',
            letterSpacing: '-0.5px'
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default MobileHeader;