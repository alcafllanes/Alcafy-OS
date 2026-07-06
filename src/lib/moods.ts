export const MOODS = [
  { key: "happy", label: "Happy", icon: "/moods/happy.png" },
  { key: "surprised", label: "Surprised", icon: "/moods/surprised.png" },
  { key: "sleepy", label: "Sleepy", icon: "/moods/sleepy.png" },
  { key: "sad", label: "Sad", icon: "/moods/sad.png" },
  { key: "angry", label: "Angry", icon: "/moods/angry.png" },
];

export function moodIcon(key: string) {
  return MOODS.find((m) => m.key === key)?.icon ?? "/moods/happy.png";
}

export function moodLabel(key: string) {
  return MOODS.find((m) => m.key === key)?.label ?? key;
}
