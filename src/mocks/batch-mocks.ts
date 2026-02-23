type BatchStatus =
  | "assigned"
  | "sent_to_driver"
  | "accepted"
  | "partially_accepted"
  | "rejected"
  | "decomposed"
  | "in_progress"
  | "completed"
  | "cancelled";

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

type BatchOrderRow = {
  id: string;
  order_number: number;
  external_id: string;
  status: OrderStatus;
  client_name: string;
  client_address: string;
  items_count: number;
  merchandise_value_mxn: string;
  created_at: string;
  sequence_number?: number | null;
};

type BatchRow = {
  id: string;
  created_at: string;
  status: BatchStatus;
  zone_name?: string | null;
  order_count: number;
  total_value_mxn: string;
  assigned_driver_name?: string | null;
  assigned_driver_id?: string | null;
  sent_to_driver_at?: string | null;
  response_timeout_at?: string | null;
  rejection_reason?: string | null;
  orders: BatchOrderRow[];
};

export const BATCHES_MOCK: BatchRow[] = [
  // assigned
  {
    id: "batch_assigned_01",
    created_at: "2026-02-14 09:58:12",
    status: "assigned",
    zone_name: "Zona Centro",
    order_count: 3,
    total_value_mxn: "$1,140.50",
    assigned_driver_name: "Carlos Ruiz",
    assigned_driver_id: "driver_12",
    sent_to_driver_at: null,
    response_timeout_at: null,
    orders: [
      {
        id: "ord_a_2001",
        order_number: 2001,
        external_id: "POS-2001",
        status: "assigned_to_batch",
        client_name: "Juan Pérez",
        client_address: "Blvd. Principal 123, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$450.50",
        created_at: "2026-02-14 09:49:35",
        sequence_number: 1,
      },
      {
        id: "ord_a_2002",
        order_number: 2002,
        external_id: "POS-2002",
        status: "assigned_to_batch",
        client_name: "María López",
        client_address: "Av. Reforma 210, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$390.00",
        created_at: "2026-02-14 09:50:12",
        sequence_number: 2,
      },
      {
        id: "ord_a_2003",
        order_number: 2003,
        external_id: "POS-2003",
        status: "assigned_to_batch",
        client_name: "Pedro Sánchez",
        client_address: "Calle 5 #12, León, Gto.",
        items_count: 4,
        merchandise_value_mxn: "$300.00",
        created_at: "2026-02-14 09:52:01",
        sequence_number: 3,
      },
    ],
  },

  // sent_to_driver
  {
    id: "batch_sent_01",
    created_at: "2026-02-14 10:25:10",
    status: "sent_to_driver",
    zone_name: "Zona Centro",
    order_count: 3,
    total_value_mxn: "$1,240.50",
    assigned_driver_name: "Carlos Ruiz",
    assigned_driver_id: "driver_12",
    sent_to_driver_at: "2026-02-14 10:28:01",
    response_timeout_at: "2026-02-14 10:33:01",
    orders: [
      {
        id: "ord_s_1284",
        order_number: 1284,
        external_id: "POS-9841",
        status: "sent_to_driver",
        client_name: "Juan Pérez",
        client_address: "Blvd. Principal 123, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$450.50",
        created_at: "2026-02-14 10:13:35",
        sequence_number: 1,
      },
      {
        id: "ord_s_1285",
        order_number: 1285,
        external_id: "POS-9842",
        status: "sent_to_driver",
        client_name: "María López",
        client_address: "Av. Reforma 210, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$390.00",
        created_at: "2026-02-14 10:14:12",
        sequence_number: 2,
      },
      {
        id: "ord_s_1286",
        order_number: 1286,
        external_id: "POS-9843",
        status: "sent_to_driver",
        client_name: "Pedro Sánchez",
        client_address: "Calle 5 #12, León, Gto.",
        items_count: 4,
        merchandise_value_mxn: "$400.00",
        created_at: "2026-02-14 10:16:01",
        sequence_number: 3,
      },
    ],
  },

  // accepted
  {
    id: "batch_accepted_01",
    created_at: "2026-02-14 09:40:22",
    status: "accepted",
    zone_name: "Zona Norte",
    order_count: 4,
    total_value_mxn: "$1,980.00",
    assigned_driver_name: "Luis Hernández",
    assigned_driver_id: "driver_09",
    sent_to_driver_at: "2026-02-14 09:44:10",
    response_timeout_at: "2026-02-14 09:49:10",
    orders: [
      {
        id: "ord_ac_1201",
        order_number: 1201,
        external_id: "EC-1201",
        status: "accepted",
        client_name: "Ana Torres",
        client_address: "Calle Jardín 10, León, Gto.",
        items_count: 1,
        merchandise_value_mxn: "$520.00",
        created_at: "2026-02-14 09:35:01",
        sequence_number: 1,
      },
      {
        id: "ord_ac_1202",
        order_number: 1202,
        external_id: "EC-1202",
        status: "accepted",
        client_name: "Roberto Díaz",
        client_address: "Blvd. Aeropuerto 55, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$460.00",
        created_at: "2026-02-14 09:36:44",
        sequence_number: 2,
      },
      {
        id: "ord_ac_1203",
        order_number: 1203,
        external_id: "EC-1203",
        status: "accepted",
        client_name: "Sofía Mora",
        client_address: "Av. Universidad 99, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$520.00",
        created_at: "2026-02-14 09:38:05",
        sequence_number: 3,
      },
      {
        id: "ord_ac_1204",
        order_number: 1204,
        external_id: "EC-1204",
        status: "accepted",
        client_name: "Daniel Ríos",
        client_address: "Calle Río 23, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$480.00",
        created_at: "2026-02-14 09:40:11",
        sequence_number: 4,
      },
    ],
  },

  // partially_accepted
  {
    id: "batch_partial_01",
    created_at: "2026-02-14 10:05:42",
    status: "partially_accepted",
    zone_name: "Zona Norte",
    order_count: 4,
    total_value_mxn: "$1,980.00",
    assigned_driver_name: "Luis Hernández",
    assigned_driver_id: "driver_09",
    sent_to_driver_at: "2026-02-14 10:09:10",
    response_timeout_at: "2026-02-14 10:14:10",
    rejection_reason: "Aceptó 2 pedidos, rechazó 2 por distancia",
    orders: [
      {
        id: "ord_p_1201",
        order_number: 1201,
        external_id: "EC-1201",
        status: "accepted",
        client_name: "Ana Torres",
        client_address: "Calle Jardín 10, León, Gto.",
        items_count: 1,
        merchandise_value_mxn: "$520.00",
        created_at: "2026-02-14 09:55:01",
        sequence_number: 1,
      },
      {
        id: "ord_p_1202",
        order_number: 1202,
        external_id: "EC-1202",
        status: "accepted",
        client_name: "Roberto Díaz",
        client_address: "Blvd. Aeropuerto 55, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$460.00",
        created_at: "2026-02-14 09:56:44",
        sequence_number: 2,
      },
      {
        id: "ord_p_1203",
        order_number: 1203,
        external_id: "EC-1203",
        status: "rejected_by_driver",
        client_name: "Sofía Mora",
        client_address: "Av. Universidad 99, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$520.00",
        created_at: "2026-02-14 09:58:05",
        sequence_number: 3,
      },
      {
        id: "ord_p_1204",
        order_number: 1204,
        external_id: "EC-1204",
        status: "rejected_by_driver",
        client_name: "Daniel Ríos",
        client_address: "Calle Río 23, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$480.00",
        created_at: "2026-02-14 10:00:11",
        sequence_number: 4,
      },
    ],
  },

  // rejected (batch-level)
  {
    id: "batch_rejected_01",
    created_at: "2026-02-14 10:18:05",
    status: "rejected",
    zone_name: "Zona Sur",
    order_count: 3,
    total_value_mxn: "$1,110.00",
    assigned_driver_name: "Iván Castro",
    assigned_driver_id: "driver_21",
    sent_to_driver_at: "2026-02-14 10:20:12",
    response_timeout_at: "2026-02-14 10:25:12",
    rejection_reason: "Rechazó lote completo (sin capacidad / fuera de zona)",
    orders: [
      {
        id: "ord_r_2101",
        order_number: 2101,
        external_id: "POS-2101",
        status: "rejected_by_driver",
        client_name: "Karla Jiménez",
        client_address: "Blvd. Delta 300, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$380.00",
        created_at: "2026-02-14 10:10:05",
        sequence_number: 1,
      },
      {
        id: "ord_r_2102",
        order_number: 2102,
        external_id: "POS-2102",
        status: "rejected_by_driver",
        client_name: "Héctor Salas",
        client_address: "Calle Niebla 12, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$410.00",
        created_at: "2026-02-14 10:11:21",
        sequence_number: 2,
      },
      {
        id: "ord_r_2103",
        order_number: 2103,
        external_id: "POS-2103",
        status: "rejected_by_driver",
        client_name: "Laura Ortiz",
        client_address: "Av. Insurgentes 777, León, Gto.",
        items_count: 1,
        merchandise_value_mxn: "$320.00",
        created_at: "2026-02-14 10:12:44",
        sequence_number: 3,
      },
    ],
  },

  // decomposed
  {
    id: "batch_decomposed_01",
    created_at: "2026-02-14 09:12:33",
    status: "decomposed",
    zone_name: "Zona Centro",
    order_count: 3,
    total_value_mxn: "$930.00",
    assigned_driver_name: "Carlos Ruiz",
    assigned_driver_id: "driver_12",
    sent_to_driver_at: "2026-02-14 09:16:01",
    response_timeout_at: "2026-02-14 09:21:01",
    rejection_reason: "Timeout - chofer no respondió en 5 minutos",
    orders: [
      {
        id: "ord_d_3001",
        order_number: 3001,
        external_id: "EC-3001",
        status: "queued",
        client_name: "Diego Aranda",
        client_address: "Calle Roma 45, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$310.00",
        created_at: "2026-02-14 09:05:10",
        sequence_number: 1,
      },
      {
        id: "ord_d_3002",
        order_number: 3002,
        external_id: "EC-3002",
        status: "queued",
        client_name: "Paola Reyes",
        client_address: "Blvd. Campestre 120, León, Gto.",
        items_count: 1,
        merchandise_value_mxn: "$280.00",
        created_at: "2026-02-14 09:06:22",
        sequence_number: 2,
      },
      {
        id: "ord_d_3003",
        order_number: 3003,
        external_id: "EC-3003",
        status: "queued",
        client_name: "Mauricio Vela",
        client_address: "Av. Las Torres 18, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$340.00",
        created_at: "2026-02-14 09:07:55",
        sequence_number: 3,
      },
    ],
  },

  // in_progress
  {
    id: "batch_progress_01",
    created_at: "2026-02-14 08:35:40",
    status: "in_progress",
    zone_name: "Zona Poniente",
    order_count: 3,
    total_value_mxn: "$1,520.00",
    assigned_driver_name: "Marcos Ledesma",
    assigned_driver_id: "driver_07",
    sent_to_driver_at: "2026-02-14 08:39:05",
    response_timeout_at: "2026-02-14 08:44:05",
    orders: [
      {
        id: "ord_ip_4101",
        order_number: 4101,
        external_id: "POS-4101",
        status: "in_transit",
        client_name: "Cynthia Lara",
        client_address: "Blvd. López Mateos 100, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$520.00",
        created_at: "2026-02-14 08:20:10",
        sequence_number: 1,
      },
      {
        id: "ord_ip_4102",
        order_number: 4102,
        external_id: "POS-4102",
        status: "in_transit",
        client_name: "Jorge Beltrán",
        client_address: "Calle Olivo 33, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$500.00",
        created_at: "2026-02-14 08:22:44",
        sequence_number: 2,
      },
      {
        id: "ord_ip_4103",
        order_number: 4103,
        external_id: "POS-4103",
        status: "collecting",
        client_name: "Erika Muñoz",
        client_address: "Av. Paseo del Moral 200, León, Gto.",
        items_count: 4,
        merchandise_value_mxn: "$500.00",
        created_at: "2026-02-14 08:24:05",
        sequence_number: 3,
      },
    ],
  },

  // completed
  {
    id: "batch_completed_01",
    created_at: "2026-02-14 07:55:10",
    status: "completed",
    zone_name: "Zona Centro",
    order_count: 3,
    total_value_mxn: "$1,360.00",
    assigned_driver_name: "Carlos Ruiz",
    assigned_driver_id: "driver_12",
    sent_to_driver_at: "2026-02-14 07:58:01",
    response_timeout_at: "2026-02-14 08:03:01",
    orders: [
      {
        id: "ord_c_5101",
        order_number: 5101,
        external_id: "EC-5101",
        status: "delivered",
        client_name: "Mónica Salgado",
        client_address: "Calle Morelos 12, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$420.00",
        created_at: "2026-02-14 07:40:22",
        sequence_number: 1,
      },
      {
        id: "ord_c_5102",
        order_number: 5102,
        external_id: "EC-5102",
        status: "delivered",
        client_name: "Hugo Navarro",
        client_address: "Av. Hidalgo 500, León, Gto.",
        items_count: 3,
        merchandise_value_mxn: "$460.00",
        created_at: "2026-02-14 07:41:10",
        sequence_number: 2,
      },
      {
        id: "ord_c_5103",
        order_number: 5103,
        external_id: "EC-5103",
        status: "delivered",
        client_name: "Fernanda Pérez",
        client_address: "Blvd. Juan Alonso 40, León, Gto.",
        items_count: 1,
        merchandise_value_mxn: "$480.00",
        created_at: "2026-02-14 07:42:05",
        sequence_number: 3,
      },
    ],
  },

  // cancelled
  {
    id: "batch_cancelled_01",
    created_at: "2026-02-14 11:02:40",
    status: "cancelled",
    zone_name: "Zona Sur",
    order_count: 2,
    total_value_mxn: "$740.00",
    assigned_driver_name: "Iván Castro",
    assigned_driver_id: "driver_21",
    sent_to_driver_at: null,
    response_timeout_at: null,
    rejection_reason: "Cancelado por admin (prueba / incidente)",
    orders: [
      {
        id: "ord_x_6101",
        order_number: 6101,
        external_id: "POS-6101",
        status: "assigned_to_batch",
        client_name: "Rosa Medina",
        client_address: "Calle Palma 18, León, Gto.",
        items_count: 2,
        merchandise_value_mxn: "$360.00",
        created_at: "2026-02-14 10:58:10",
        sequence_number: 1,
      },
      {
        id: "ord_x_6102",
        order_number: 6102,
        external_id: "POS-6102",
        status: "assigned_to_batch",
        client_name: "Alberto Cuevas",
        client_address: "Av. Los Parques 9, León, Gto.",
        items_count: 1,
        merchandise_value_mxn: "$380.00",
        created_at: "2026-02-14 10:59:22",
        sequence_number: 2,
      },
    ],
  },
];
