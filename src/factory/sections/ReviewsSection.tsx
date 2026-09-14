"use client";
import { useState } from "react";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { useLead } from "../lead-context";
import type { Review } from "../types";

const sourceLabel: Record<Review["source"], string> = {
  google: "Google",
  facebook: "Facebook",
  tripadvisor: "Tripadvisor",
  instagram: "Instagram",
  treatwell: "Treatwell",
};

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" style={{ color: i <= rounded ? "var(--accent-bright)" : "var(--line-strong)" }} fill="currentColor">
          <path d="m12 17.27 5.18 3.13-1.37-5.9 4.58-3.97-6.03-.51L12 4.5 9.64 10.02l-6.03.51 4.58 3.97-1.37 5.9L12 17.27Z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Reviews are only ever real. No quotes in the data means no quotes on the page —
 * the section falls back to the verified aggregate, or disappears entirely.
 */
export default function ReviewsSection({ index, full = false }: { index?: number; full?: boolean }) {
  const { lead, ui } = useLead();
  const { rating, reviews } = lead.reputation;
  if (!rating && reviews.length === 0) return null;

  const variant = reviews.length === 0 ? "rating-only" : lead.design.variants.reviews;

  const ratingBlock = rating ? (
    <a
      href={rating.url}
      target={rating.url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3"
    >
      <span className="display-3 tabular">{rating.value.toFixed(1)}</span>
      <span className="flex flex-col gap-0.5">
        <Stars value={rating.value} />
        <span className="text-xs muted">
          {rating.count} {ui.reviews.reviewCount} {ui.reviews.onGoogle}
        </span>
      </span>
    </a>
  ) : null;

  return (
    <section
      id="reviews"
      className={full ? "pb-16 md:pb-24" : "section-y"}
      style={{ background: "var(--surface)" }}
    >
      <div className="wrap flex flex-col gap-10 md:gap-14">
        {full ? (
          ratingBlock
        ) : (
          <SectionHead
            eyebrow={ui.nav.reviews}
            title={ui.reviews.title}
            index={index}
            aside={ratingBlock}
          />
        )}

        {variant === "quote-feature" ? <QuoteFeature reviews={reviews} /> : null}
        {variant === "review-rail" ? <ReviewRail reviews={reviews} full={full} /> : null}
        {variant === "stacked-cards" ? <StackedCards reviews={reviews} full={full} /> : null}

        {rating?.url && !full ? (
          <Reveal>
            <a
              href={rating.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-quiet self-start"
            >
              {ui.reviews.readMore}
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function Attribution({ review }: { review: Review }) {
  return (
    <span className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] muted">
      <span style={{ color: "var(--text)" }}>{review.author}</span>
      <span aria-hidden="true">·</span>
      <span>{sourceLabel[review.source]}</span>
    </span>
  );
}

function QuoteFeature({ reviews }: { reviews: Review[] }) {
  const { t } = useLead();
  const [i, setI] = useState(0);
  const review = reviews[i];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <Reveal>
        <figure className="flex flex-col gap-6 max-w-[24ch] sm:max-w-[30ch] lg:max-w-none">
          <blockquote
            className="display-2"
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.15, maxWidth: "20ch" }}
          >
            <span aria-hidden="true">“</span>
            {t(review.text)}
            <span aria-hidden="true">”</span>
          </blockquote>
          <figcaption className="flex items-center gap-4">
            {review.rating ? <Stars value={review.rating} /> : null}
            <Attribution review={review} />
          </figcaption>
        </figure>
      </Reveal>

      {reviews.length > 1 ? (
        <div className="flex items-center gap-2">
          {reviews.map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`${n + 1}/${reviews.length}`}
              aria-current={n === i}
              className="h-9 w-9 text-xs tabular transition-colors"
              style={{
                border: `1px solid ${n === i ? "var(--text)" : "var(--line-strong)"}`,
                color: n === i ? "var(--text)" : "var(--text-faint)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {n + 1}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ReviewRail({ reviews, full }: { reviews: Review[]; full: boolean }) {
  const { t } = useLead();
  const list = full ? reviews : reviews.slice(0, 6);
  return (
    <div className="rail -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)]">
      {list.map((review, i) => (
        <Reveal key={`${review.author}-${i}`} delay={Math.min(i, 5)} className="w-[80vw] sm:w-[24rem]">
          <figure
            className="flex flex-col gap-5 h-full p-7 border"
            style={{ borderColor: "var(--line)", borderRadius: "var(--radius-lg)", background: "var(--ink)" }}
          >
            {review.rating ? <Stars value={review.rating} /> : null}
            <blockquote className="text-[1.05rem] leading-relaxed" style={{ color: "var(--text)" }}>
              {t(review.text)}
            </blockquote>
            <figcaption className="mt-auto pt-2">
              <Attribution review={review} />
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

function StackedCards({ reviews, full }: { reviews: Review[]; full: boolean }) {
  const { t } = useLead();
  const list = full ? reviews : reviews.slice(0, 4);
  return (
    <div className="columns-1 md:columns-2 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
      {list.map((review, i) => (
        <Reveal key={`${review.author}-${i}`} delay={Math.min(i, 4)}>
          <figure
            className="flex flex-col gap-4 p-7 border"
            style={{ borderColor: "var(--line)", borderRadius: "var(--radius-lg)", background: "var(--ink)" }}
          >
            {review.rating ? <Stars value={review.rating} /> : null}
            <blockquote className="leading-relaxed" style={{ color: "var(--text)" }}>
              {t(review.text)}
            </blockquote>
            <figcaption>
              <Attribution review={review} />
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
