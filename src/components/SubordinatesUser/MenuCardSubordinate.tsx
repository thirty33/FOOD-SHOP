interface MenuCardSubordinateProps {
  dayName: string;
  dayNumber: number;
  month: string;
  isCompleted: boolean;
  onClick?: () => void;
}

export const MenuCardSubordinate = ({ dayName, dayNumber, month, isCompleted, onClick }: MenuCardSubordinateProps) => {
  const completedClasses = "bg-green-600 border-2 border-green-700 hover:bg-green-700";
  const pendingClasses = "bg-gray-50 border-2 border-gray-300 hover:bg-gray-100";

  const completedTextClasses = "text-white";
  const pendingTextClasses = "text-gray-700";
  const pendingMonthClasses = "text-gray-600";

  return (
    <div
      className={`rounded-lg p-2 text-center cursor-pointer transition-colors min-w-[80px] ${
        isCompleted ? completedClasses : pendingClasses
      }`}
      onClick={onClick}
    >
      <div className={`text-xs font-cera-medium ${isCompleted ? completedTextClasses : pendingTextClasses}`}>
        {dayName}
      </div>
      <div className={`text-lg font-cera-bold ${isCompleted ? completedTextClasses : pendingTextClasses}`}>
        {dayNumber}
      </div>
      <div className={`text-xs font-cera-light ${isCompleted ? completedTextClasses : pendingMonthClasses}`}>
        {month}
      </div>
      <div className={`mt-1 text-[10px] font-cera-bold ${isCompleted ? completedTextClasses : pendingMonthClasses}`}>
        {isCompleted ? '✓ Completado' : 'Pendiente'}
      </div>
    </div>
  );
};
