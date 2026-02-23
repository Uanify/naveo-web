type OrderStatus =
  | "new"
  | "queued"
  | "assigned_to_batch"
  | "sent_to_driver"
  | "accepted"
  | "rejected_by_driver"
  | "collecting"
  | "collected"
  | "in_transit"
  | "delivered"
  | "undelivered";

type QueueRowMock = {
  id: string;
  created_at: string;
  order_number: number;
  external_id: string;
  minutes_in_queue: number;
  priority_label: "Baja" | "Media" | "Alta" | "Urgente";
  priority_dot: "bg-gray-400" | "bg-yellow-500" | "bg-red-500" | "bg-rose-600";
  status: OrderStatus;
  is_ready_for_batch?: boolean;
  client_name: string;
  value_mxn: string;
  items_count: number;
  batch_id?: string | null;
};

export const QUEUE_ROWS_MOCK: QueueRowMock[] = [
  {
    id: "JKASD900912JAS",
    created_at: "2026-02-14 10:13:35",
    order_number: 1284,
    external_id: "POS-9841",
    minutes_in_queue: 2,
    priority_label: "Media",
    priority_dot: "bg-yellow-500",
    status: "queued",
    client_name: "Juan Pérez",
    value_mxn: "$450.50",
    items_count: 3,
    batch_id: null,
  },
  {
    id: "QWERT12345ZXCV",
    created_at: "2026-02-14 10:09:12",
    order_number: 1285,
    external_id: "POS-9842",
    minutes_in_queue: 8,
    priority_label: "Alta",
    priority_dot: "bg-red-500",
    status: "queued",
    is_ready_for_batch: false,
    client_name: "María López",
    value_mxn: "$980.00",
    items_count: 5,
    batch_id: null,
  },
  {
    id: "ASDFG67890HJKL",
    created_at: "2026-02-14 10:02:40",
    order_number: 1286,
    external_id: "ECOM-3321",
    minutes_in_queue: 13,
    priority_label: "Alta",
    priority_dot: "bg-red-500",
    status: "queued",
    is_ready_for_batch: true, // ✅ listo para lote
    client_name: "Carlos Ramírez",
    value_mxn: "$1,240.00",
    items_count: 2,
    batch_id: null,
  },
  {
    id: "ZXCVB11111NMQQ",
    created_at: "2026-02-14 09:58:05",
    order_number: 1287,
    external_id: "POS-9843",
    minutes_in_queue: 1,
    priority_label: "Urgente",
    priority_dot: "bg-rose-600",
    status: "queued",
    client_name: "Ana Torres",
    value_mxn: "$320.00",
    items_count: 1,
    batch_id: "bch_9f21...d3a",
  },
  {
    id: "POIUY22222TREW",
    created_at: "2026-02-14 09:55:18",
    order_number: 1288,
    external_id: "ECOM-3322",
    minutes_in_queue: 0,
    priority_label: "Media",
    priority_dot: "bg-yellow-500",
    status: "queued",
    client_name: "Luis Medina",
    value_mxn: "$760.00",
    items_count: 4,
    batch_id: "bch_9f21...d3a",
  },
  {
    id: "LMNOP33333QWER",
    created_at: "2026-02-14 09:49:33",
    order_number: 1289,
    external_id: "POS-9844",
    minutes_in_queue: 0,
    priority_label: "Baja",
    priority_dot: "bg-gray-400",
    status: "queued",
    client_name: "Sofía Hernández",
    value_mxn: "$150.00",
    items_count: 1,
    batch_id: "bch_55ac...9aa",
  },
  {
    id: "GHJKL44444ASDF",
    created_at: "2026-02-14 09:44:10",
    order_number: 1290,
    external_id: "POS-9845",
    minutes_in_queue: 0,
    priority_label: "Alta",
    priority_dot: "bg-red-500",
    status: "queued",
    client_name: "Ricardo Vela",
    value_mxn: "$2,100.00",
    items_count: 8,
    batch_id: "bch_55ac...9aa",
  },
  {
    id: "TYUIO55555BNMM",
    created_at: "2026-02-14 09:36:52",
    order_number: 1291,
    external_id: "ECOM-3323",
    minutes_in_queue: 0,
    priority_label: "Media",
    priority_dot: "bg-yellow-500",
    status: "queued",
    client_name: "Diana Silva",
    value_mxn: "$560.00",
    items_count: 2,
    batch_id: "bch_88de...1cc",
  },
  {
    id: "CVBNM66666LKJH",
    created_at: "2026-02-14 09:18:25",
    order_number: 1292,
    external_id: "POS-9846",
    minutes_in_queue: 0,
    priority_label: "Media",
    priority_dot: "bg-yellow-500",
    status: "queued",
    client_name: "Pedro Aguilar",
    value_mxn: "$410.00",
    items_count: 3,
    batch_id: "bch_88de...1cc",
  },
  {
    id: "QAZWS77777EDCR",
    created_at: "2026-02-14 09:10:03",
    order_number: 1293,
    external_id: "POS-9847",
    minutes_in_queue: 0,
    priority_label: "Alta",
    priority_dot: "bg-red-500",
    status: "queued",
    client_name: "Karla Núñez",
    value_mxn: "$890.00",
    items_count: 6,
    batch_id: "bch_12ab...77f",
  },
  {
    id: "RFVTG88888YHNU",
    created_at: "2026-02-14 08:58:44",
    order_number: 1294,
    external_id: "ECOM-3324",
    minutes_in_queue: 0,
    priority_label: "Baja",
    priority_dot: "bg-gray-400",
    status: "queued",
    client_name: "Jorge Salas",
    value_mxn: "$230.00",
    items_count: 1,
    batch_id: "bch_19ef...0aa",
  },
];
