import { ProductHome } from "../components/experience/experience";
import { product } from "../components/experience/product";

export const metadata = {
  title: product.name + " — " + product.title.replace("\n", " "),
  description: product.description,
  alternates: { canonical: "https://www.saaszo.in" },
  openGraph: {
    title: product.name,
    description: product.description,
    url: "https://www.saaszo.in",
    type: "website",
  },
};

export default function HomePage() {
  return <ProductHome />;
}
