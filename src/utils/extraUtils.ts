export const EquipmentCategories = [
  { value: "camera", label: "Camera" },
  { value: "lense", label: "Lense" },
  { value: "audio", label: "Audio" },
  { value: "lighting", label: "Lighting" },
  { value: "3d-printer", label: "3D Printer" },
  { value: "electronics", label: "Electronics" },
] as const; // 'as const' makes these values readonly and strictly typed