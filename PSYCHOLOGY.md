# handi — Psychology Layer

A trust-led conversion system. **Subtle, not pushy** — every device is wrapped in editorial typography so it reads as concierge, not Booking.com.

## The 5 principles in play

### 1. Authority (Trust signals — the dominant lever)
**Where:** Landing hero, every Item Detail page, every carrier card.
- **Trust quartet** under hero: Escrow / ID-verified / Money-back / 24h disputes — concrete, not "we're trustworthy."
- **Carrier Dossier** (`HCarrierTrust`): 4 verifications + 4 lifetime stats laid out like a credit report. Trust score 98/100 framed like a Stripe risk score.
- **Reviews · last 3 trips** under each carrier — recent, specific, names not stock photos.
- Why it works: Your specific obstacle is "trust in stranger." We don't tell, we **show the receipts**.

### 2. Anchoring (frames the carry fee as a deal)
**Where:** Every item card, Item Detail price block.
- **Local resale crossed out** vs handi all-in: `$240 ↗ $155 · SAVE 35%`. The local resale anchor is computed at ~1.45–1.55× retail+fee — realistic for the "international markup" Tokyo→NYC scenario.
- Above the fold on detail page so the deal is visible before they scroll.
- Card-level anchor (`HRetailAnchor`) keeps the comparison alive in browse.

### 3. Endowment effect (it's already yours, briefly)
**Where:** Item Detail purchase panel, Cart.
- **`HHoldTimer`** — "Reserved for you · 14:23 · auto-releases" with a thin rouge progress line. No red blinking, no "HURRY!"
- Once they see "reserved for you" their brain assigns ownership — losing it now feels like a loss, not a missed gain.

### 4. Micro-commitment (low-friction yes → bigger yes)
**Where:** All cards, item detail.
- **`HMicroSave`** — Save toggle that lights rouge with a save count. Saving is one click, no signup gate. Tiny commitment compounds: saved items → wishlist sidebar → "2 carriers heading your way" alert → purchase.
- Browse sidebar shows "3 items saved · We'll alert you when a carrier picks up your route" — turns the wishlist into reciprocity (we're working for you).

### 5. Social proof (live, specific, low-volume)
**Where:** Landing top of fold, Browse header.
- **`HLiveActivity`** — single rotating event ("Maya from Brooklyn reserved a Tokyo carry · 2 min ago"). Cycles every 5.5s. One event at a time, editorial type, fade-up animation.
- **"10 people viewing now"** on item gallery (subtle, in a dark glass pill, not red banner).
- **Slot bar** (`HSlotBar`) — "2 of 4 slots reserved · 2 left." Visual scarcity without urgency-screaming.

## What we deliberately did NOT do
| Pattern | Why we skipped |
|---|---|
| Red countdown banners | Cheap. Breaks SSENSE-grade aesthetic. |
| "5 PEOPLE BOUGHT IN THE LAST HOUR!!" toasts | Feels Booking.com-grade aggressive |
| Asterisk legal text in tiny gray | Erodes trust. We use mono captions instead. |
| Pop-up email gate | High dismissal rate; we use the wishlist for capture instead |
| Decoy pricing tiers | No use case yet — handi is one-fee-per-carry |
| Free-shipping countdown | We literally have no shipping. |

## Component reference

| Component | Principle | Where used |
|---|---|---|
| `HHoldTimer` | Endowment | Item Detail (sticky), Cart |
| `HCarrierTrust` | Authority | Item Detail dossier section |
| `HAnchorPrice` | Anchoring | Item Detail above price block |
| `HMicroSave` | Commitment | All cards, item gallery, secondary CTAs |
| `HLiveActivity` | Social proof | Landing hero, Browse header |
| `HRetailAnchor` | Anchoring | Inline (card-level) |
| `HSlotBar` | Scarcity (subtle) | Cards, item-detail trip block |

## Conversion funnel — where each lever fires

```
LANDING HERO
  ├── Live activity ticker         → social proof
  ├── Trust quartet                → authority (the BIG lever for handi)
  └── Stats bar incl. 4.9 ★ · 8,210 reviews → social proof

BROWSE
  ├── "Picked for you" rail        → commitment (returns), reciprocity
  ├── Trust filter sidebar         → authority + control
  ├── Live activity in header      → social proof
  ├── Card-level: anchor + slot bar + save → all 4 levers in 1 card
  └── Wishlist counter             → goal gradient

ITEM DETAIL
  ├── Hold timer (sticky)          → endowment
  ├── Anchor block (above fold)    → anchoring
  ├── Carrier dossier              → authority (THE deciding factor)
  ├── "10 viewing now" pill        → social proof
  ├── Recent reviews               → authority + social proof
  ├── Slot bar in trip card        → scarcity
  ├── "You won't be charged until accepted" → loss aversion (reverse: removes loss)
  └── More from this trip          → bundle anchoring + commitment
```

## Recommended A/B tests (post-launch)

1. **Hold timer length:** 15min vs 30min vs no timer. Track Reserve clicks per detail visit.
2. **Anchor strength:** "Save 35%" vs "Save $85" vs no anchor. Watch for trust erosion.
3. **Live activity:** real events vs synthetic vs none. Real always wins long-term.
4. **Trust quartet position:** above-fold (current) vs below hero copy. Hypothesis: above-fold is dominant for new users.
5. **Card-level slot bar:** show vs hide. Hypothesis: hides better for "fully booked" items (avoids dead inventory).

## Animation hooks for psych devices
- **Hold timer:** progress bar uses `transition: width 1s linear` — no React re-render flicker.
- **Save button:** rouge fill + scale 0.9→1 spring on click (build later via animations.jsx).
- **Live activity:** `animation: h-fade-up .4s` keyed off content change.
- **Slot bar fill:** `transition: width .8s cubic-bezier(.2,.7,.2,1)` — fills in on first paint.
