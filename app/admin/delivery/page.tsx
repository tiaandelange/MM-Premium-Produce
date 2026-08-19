import { saveDeliveryRuleAction } from "@/app/admin/actions";
import { Checkbox, Field, TextInput } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth/guards";
import { listDeliveryRules } from "@/services/delivery";

export const metadata = { title: "Delivery rules" };

export default async function AdminDeliveryPage() {
  await requireAdmin();
  const rules = await listDeliveryRules();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-page-title">Delivery rules</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Only published rules appear on checkout and the public delivery page. Leave fees and
          areas unpublished until they are confirmed business rules.
        </p>
      </header>
      <section className="card-surface p-5">
        <h2 className="font-heading text-card-title">Add a rule</h2>
        <form action={saveDeliveryRuleAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Name" name="name">
            <TextInput name="name" required />
          </Field>
          <Field label="Suburb" name="suburb">
            <TextInput name="suburb" />
          </Field>
          <Field label="City" name="city">
            <TextInput name="city" />
          </Field>
          <Field label="Province" name="province">
            <TextInput name="province" />
          </Field>
          <Field label="Postal code" name="postalCode">
            <TextInput name="postalCode" />
          </Field>
          <Field label="Fee (ZAR)" name="feeAmount">
            <TextInput name="feeAmount" type="number" />
          </Field>
          <Field label="Minimum order" name="minOrderAmount">
            <TextInput name="minOrderAmount" type="number" />
          </Field>
          <Field label="Free delivery threshold" name="freeDeliveryThreshold">
            <TextInput name="freeDeliveryThreshold" type="number" />
          </Field>
          <Field label="Estimated window" name="estimatedWindow">
            <TextInput name="estimatedWindow" />
          </Field>
          <Field label="Min days" name="estimatedMinDays">
            <TextInput name="estimatedMinDays" type="number" />
          </Field>
          <Field label="Max days" name="estimatedMaxDays">
            <TextInput name="estimatedMaxDays" type="number" />
          </Field>
          <Field label="Sort order" name="sortOrder">
            <TextInput name="sortOrder" type="number" defaultValue="0" />
          </Field>
          <div className="md:col-span-2">
            <Checkbox name="published" label="Published on the storefront" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">
              Save rule
            </button>
          </div>
        </form>
      </section>
      <ul className="space-y-4">
        {rules.map((rule) => (
          <li key={rule.id} className="card-surface p-5">
            <h2 className="font-heading text-card-title">{rule.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {rule.suburb || "No suburb"} · {rule.postalCode || "No postal code"} ·{" "}
              {rule.published ? "Published" : "Hidden"} · Fee {rule.fee.amount} {rule.fee.currency}
            </p>
            <form action={saveDeliveryRuleAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={rule.id} />
              <Field label="Name" name={`name-${rule.id}`}>
                <TextInput name="name" defaultValue={rule.name} required />
              </Field>
              <Field label="Suburb" name={`suburb-${rule.id}`}>
                <TextInput name="suburb" defaultValue={rule.suburb ?? ""} />
              </Field>
              <Field label="City" name={`city-${rule.id}`}>
                <TextInput name="city" defaultValue={rule.city ?? ""} />
              </Field>
              <Field label="Province" name={`province-${rule.id}`}>
                <TextInput name="province" defaultValue={rule.province ?? ""} />
              </Field>
              <Field label="Postal code" name={`postal-${rule.id}`}>
                <TextInput name="postalCode" defaultValue={rule.postalCode ?? ""} />
              </Field>
              <Field label="Fee" name={`fee-${rule.id}`}>
                <TextInput name="feeAmount" type="number" defaultValue={String(rule.fee.amount)} />
              </Field>
              <Field label="Minimum order" name={`min-${rule.id}`}>
                <TextInput name="minOrderAmount" type="number" defaultValue={rule.minOrder ? String(rule.minOrder.amount) : ""} />
              </Field>
              <Field label="Free delivery from" name={`free-${rule.id}`}>
                <TextInput
                  name="freeDeliveryThreshold"
                  type="number"
                  defaultValue={rule.freeDeliveryThreshold ? String(rule.freeDeliveryThreshold.amount) : ""}
                />
              </Field>
              <Field label="Window" name={`window-${rule.id}`}>
                <TextInput name="estimatedWindow" defaultValue={rule.estimatedWindow ?? ""} />
              </Field>
              <Field label="Min days" name={`min-days-${rule.id}`}>
                <TextInput name="estimatedMinDays" type="number" defaultValue={rule.estimatedMinDays != null ? String(rule.estimatedMinDays) : ""} />
              </Field>
              <Field label="Max days" name={`max-days-${rule.id}`}>
                <TextInput name="estimatedMaxDays" type="number" defaultValue={rule.estimatedMaxDays != null ? String(rule.estimatedMaxDays) : ""} />
              </Field>
              <Field label="Sort" name={`sort-${rule.id}`}>
                <TextInput name="sortOrder" type="number" defaultValue={String(rule.sortOrder)} />
              </Field>
              <div className="md:col-span-2">
                <Checkbox name="published" label="Published" defaultChecked={rule.published} />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="btn-secondary">
                  Update
                </button>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
