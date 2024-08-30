import dynamic from 'next/dynamic';

const DynamicRecommendationPage = dynamic(() => import('../../components/RecommendationPage'), {
  ssr: false,
});

export default function RecommendationPageWrapper() {
  return <DynamicRecommendationPage />;
}