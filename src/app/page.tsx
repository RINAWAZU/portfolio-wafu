import { Prologue } from '@/components/sections/prologue/Prologue';
import { About } from '@/components/sections/about/About';
import { Works } from '@/components/sections/works/Works';
import { Skills } from '@/components/sections/skills/Skills';
import { Career } from '@/components/sections/career/Career';
import { Pricing } from '@/components/sections/pricing/Pricing';
import { Contact } from '@/components/sections/contact/Contact';

/**
 * 全セクションを縦に並べるだけ（設計書 §6-1）。
 * 季節がクライアント状態になったため、このページは純粋な Server Component で
 * 時刻依存を持たない（rev.2 で判明した性質。§6-5）。
 */
export default function Home() {
  return (
    <>
      <Prologue />
      <About />
      <Works />
      <Skills />
      <Career />
      <Pricing />
      <Contact />
    </>
  );
}
