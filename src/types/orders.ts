export type OrderStatus =
  | "pending"
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
