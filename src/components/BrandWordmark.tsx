type BrandWordmarkProps = {
  className?: string;
};

export default function BrandWordmark({ className = '' }: BrandWordmarkProps) {
  return (
    <span className={`font-display font-normal uppercase whitespace-nowrap ${className}`}>
      G<span className="font-lambda inline-block -mx-[0.08em]">Λ</span>MÉN
    </span>
  );
}
