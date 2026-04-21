"use client";

import { motion } from "framer-motion";

export default function SafetyPoliciesSection() {
  return (
    <section className="bg-ink border-t border-white/8 py-20">
      <div className="wrap">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5 }}
            className="eyebrow mb-5 text-accent"
          >
            Trust & Safety
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y:"100%" }} whileInView={{ y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7, delay:0.1, ease:[0.22,1,0.36,1] }}
              className="text-d2 font-black text-white"
            >
              Built for peace of mind.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay:0.2 }}
            className="mt-3 text-white/40 text-sm max-w-sm mx-auto"
          >
            Every transaction is protected from the moment you place an order.
          </motion.p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* How pricing works */}
          <motion.div
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay:0 }}
            className="rounded-2xl p-7 border border-white/10"
            style={{ background:"rgba(255,255,255,0.04)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-6">How pricing works</p>
            <div className="space-y-5">
              {[
                { n:"01", text:"You pay the listed carry fee to reserve your traveler's slot." },
                { n:"02", text:"Funds are held in escrow — neither party gets paid yet." },
                { n:"03", text:"After you confirm receipt, the carry fee is released to your traveler. Item retail price is settled at handoff." },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="text-[10px] font-black text-accent/50 mt-0.5 flex-shrink-0 tabular-nums">{n}</span>
                  <p className="text-[13px] text-white/55 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* If something goes wrong */}
          <motion.div
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay:0.08 }}
            className="rounded-2xl p-7 border border-white/10"
            style={{ background:"rgba(255,255,255,0.04)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-6">If something goes wrong</p>
            <div className="space-y-4">
              {[
                { icon:"⏱️", text:"5-day dispute window after delivery to file a claim." },
                { icon:"🛡️", text:"24-hour resolution team dedicated to every dispute." },
                { icon:"💸", text:"Full refund if item isn't delivered or doesn't match the listing." },
                { icon:"📸", text:"Receipt & photos required from traveler on all high-value carries." },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 leading-snug">{icon}</span>
                  <p className="text-[13px] text-white/55 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Prohibited items */}
          <motion.div
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay:0.16 }}
            className="rounded-2xl p-7 border border-white/10"
            style={{ background:"rgba(255,255,255,0.04)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-6">What can&apos;t be carried</p>
            <div className="space-y-3">
              {[
                "Weapons, explosives, or dangerous goods",
                "Prescription medications without documentation",
                "Live animals or cold-chain perishables",
                "Counterfeit or trademark-infringing goods",
                "Items exceeding airline carry-on limits",
                "Cash, gift cards, or negotiable instruments",
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-[10px] text-accent/60 mt-1 flex-shrink-0 font-bold">✕</span>
                  <p className="text-[12px] text-white/45 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Customs note */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          transition={{ duration:0.5, delay:0.2 }}
          className="flex items-start gap-3 p-5 rounded-2xl border border-white/8 max-w-3xl mx-auto"
          style={{ background:"rgba(255,255,255,0.03)" }}
        >
          <span className="text-base flex-shrink-0 mt-0.5">📋</span>
          <p className="text-[12px] text-white/35 leading-relaxed">
            <strong className="text-white/55">Customs & tax:</strong> Travelers must declare all carried items per local customs law. Import duties or taxes at the destination are the buyer&apos;s responsibility. handi is not liable for customs delays or seizures.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
