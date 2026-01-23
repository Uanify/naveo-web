export function RowOrderData(props: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <span className="text-sm text-gray-600">{props.title}</span>
      <span className="text-sm text-gray-900">{props.description}</span>
    </div>
  );
}
