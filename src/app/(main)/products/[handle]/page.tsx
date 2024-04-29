import { getProductByHandle, getAllProductHandles } from "@/lib/data"
import ProductTemplate from "@/components/products/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { GetStaticPaths } from 'next';


type Props = {
  params: { handle: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getProductByHandle(params.handle);
  const product = data.products[0];

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { products } = await getProductByHandle(params.handle).catch((err) => {
    notFound();
  });

  return <ProductTemplate product={products[0]} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const handles = await getAllProductHandles();
    return {
      paths: handles.map(handle => ({
        params: { handle }
      })),
      fallback: 'blocking' // or `false` as per your fallback strategy
    };
  };