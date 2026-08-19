import { submitCheckoutForm } from "@/lib/commerce/place-order";

export async function POST(request: Request) {
  const formData = await request.formData();
  await submitCheckoutForm(formData);
}
