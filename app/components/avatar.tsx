type AvatarProps = {
  label: string;
  size?: "small" | "large";
};

const tones = [
  "bg-blue-100 text-blue-800",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
  "bg-rose-100 text-rose-800",
  "bg-violet-100 text-violet-800",
  "bg-cyan-100 text-cyan-800",
];

export const Avatar = ({ label, size = "small" }: AvatarProps) => {
  const tone = [...label].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const initials = label
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${tones[tone % tones.length]} ${
        size === "large" ? "size-12 text-sm" : "size-8 text-[11px]"
      }`}
    >
      {initials}
    </span>
  );
};
