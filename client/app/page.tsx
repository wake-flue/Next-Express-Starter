'use client';

import { PageLayout } from 'components/common/PageLayout';
import { HeroSection } from '@/components/features/home/HeroSection';
import { FeatureSection } from '@/components/features/home/FeatureSection';
import { TechStackSection } from '@/components/features/home/TechStackSection';
import { ContactSection } from '@/components/features/home/ContactSection';

export default function Home() {
  return (
    <PageLayout noTopPadding fullWidth>
      <HeroSection />
      <FeatureSection />
      <TechStackSection />
      <ContactSection />
    </PageLayout>
  );
}
