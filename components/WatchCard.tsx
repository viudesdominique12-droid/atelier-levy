import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatYear, type Watch } from '@/lib/watches'
import { asset } from '@/lib/asset'

export default function WatchCard({ watch }: { watch: Watch }) {
  const yearLabel = formatYear(watch.year)
  const yearPrefix = watch.yearApproximate && watch.year ? 'Vers ' : ''
  const onSale = watch.onSale && watch.priceOriginal
  return (
    <Link
      href={`/montres/${watch.slug}`}
      className="group block focus:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        {watch.mainImage ? (
          <Image
            src={asset(watch.mainImage)}
            alt={`${watch.brand} ${watch.model}`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-text-dim">
            —
          </div>
        )}
        {watch.isVintage ? (
          <span className="absolute left-3 top-3 bg-bg/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.32em] text-brass backdrop-blur">
            Vintage
          </span>
        ) : null}
        {onSale ? (
          <span className="absolute right-3 top-3 bg-copper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.32em] text-text">
            En promotion
          </span>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brass">
            {watch.brand}
          </p>
          <h3 className="mt-2 font-display text-2xl leading-[1.1] tracking-tight text-text">
            {watch.model}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-dim">
            {yearPrefix}
            {yearLabel}
            {watch.reference ? ` · Réf. ${watch.reference}` : null}
          </p>
        </div>

        <div className="shrink-0 text-right">
          {onSale ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-dim line-through">
              {formatPrice(watch.priceOriginal as string, watch.currency)}
            </p>
          ) : null}
          <p className="font-display text-xl text-text">
            {formatPrice(watch.price, watch.currency)}
          </p>
        </div>
      </div>
    </Link>
  )
}
