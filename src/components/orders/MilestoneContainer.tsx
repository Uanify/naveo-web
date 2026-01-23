export function MilestoneContainer(props: {
  title: string;
  date: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -left-[50px] top-1 border rounded-full">
        <div className=" size-4.5 bg-blue-900 border-4 border-white rounded-full shadow-xl shadow-blue-900/40 z-10" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <p className="text-[14.5px] font-medium text-gray-900">
            {props.title}
          </p>
          <p className="text-[13.5px] text-gray-600 tabular-nums">
            {props.date}
          </p>
        </div>
        <p className="text-sm text-gray-500">{props.description}</p>
      </div>
    </div>
  );
}
