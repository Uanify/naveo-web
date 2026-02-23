export type BatchStatus =
  | "assigned"
  | "sent_to_driver"
  | "accepted"
  | "partially_accepted"
  | "rejected"
  | "decomposed"
  | "in_progress"
  | "completed"
  | "cancelled";