interface MenuCardSubordinateProps {
  dayName: string;
  dayNumber: number;
  month: string;
  orderStatus?: string | null;
  onClick?: () => void;
}

type StatusType = 'completed' | 'partiallyScheduled' | 'pending';

export const MenuCardSubordinate = ({ dayName, dayNumber, month, orderStatus, onClick }: MenuCardSubordinateProps) => {
  // Determine status type based on order_status
  const getStatusType = (): StatusType => {
    if (orderStatus === 'PROCESSED') return 'completed';
    if (orderStatus === 'PARTIALLY_SCHEDULED') return 'partiallyScheduled';
    return 'pending';
  };

  const statusType = getStatusType();

  // Card container classes
  const containerClasses = {
    completed: "bg-green-600 border-2 border-green-700 hover:bg-green-700",
    partiallyScheduled: "bg-gray-50 border-2 border-gray-300 hover:bg-gray-100",
    pending: "bg-red-1000 border-2 border-red-900 hover:bg-red-900",
  };

  // Text classes
  const textClasses = {
    completed: "text-white",
    partiallyScheduled: "text-gray-700",
    pending: "text-white",
  };

  const monthClasses = {
    completed: "text-white",
    partiallyScheduled: "text-gray-600",
    pending: "text-white",
  };

  // Status labels
  const statusLabels = {
    completed: "✓ Completado",
    partiallyScheduled: "Parcialmente Agendado",
    pending: "Pendiente",
  };

  return (
    <div
      className={`rounded-lg p-2 text-center cursor-pointer transition-colors min-w-[80px] ${containerClasses[statusType]}`}
      onClick={onClick}
    >
      <div className={`text-xs font-cera-medium ${textClasses[statusType]}`}>
        {dayName}
      </div>
      <div className={`text-lg font-cera-bold ${textClasses[statusType]}`}>
        {dayNumber}
      </div>
      <div className={`text-xs font-cera-light ${monthClasses[statusType]}`}>
        {month}
      </div>
      <div className={`mt-1 text-[10px] font-cera-bold ${textClasses[statusType]}`}>
        {statusLabels[statusType]}
      </div>
    </div>
  );
};
