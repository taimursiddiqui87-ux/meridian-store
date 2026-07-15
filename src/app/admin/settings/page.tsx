import { Store, Truck, CreditCard, Bell, Check } from "lucide-react";
import { PageHeader, Card, CardHead } from "@/components/admin/AdminUI";
import { BRAND } from "@/lib/data";

const tabs = [
  { label: "General", icon: Store, active: true },
  { label: "Shipping", icon: Truck },
  { label: "Payments", icon: CreditCard },
  { label: "Notifications", icon: Bell },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your store, shipping and payments.">
        <button className="btn rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-ink-soft">
          <Check size={15} /> Save changes
        </button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <Card className="p-2">
            {tabs.map((t) => (
              <button
                key={t.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] transition-colors ${
                  t.active ? "bg-ink text-paper" : "text-ink-soft hover:bg-stone-100"
                }`}
              >
                <t.icon size={16} strokeWidth={1.7} /> {t.label}
              </button>
            ))}
          </Card>
        </aside>

        <div className="space-y-6">
          <Card>
            <CardHead title="Store profile" />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Store name</label>
                <input defaultValue={BRAND.name} className="field-input" />
              </div>
              <div>
                <label className="field-label">Tagline</label>
                <input defaultValue={BRAND.tagline} className="field-input" />
              </div>
              <div>
                <label className="field-label">Support email</label>
                <input defaultValue={BRAND.email} className="field-input" />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input defaultValue={BRAND.phone} className="field-input" />
              </div>
              <div>
                <label className="field-label">Currency</label>
                <select className="field-input" defaultValue="USD">
                  <option>USD — US Dollar</option>
                  <option>EUR — Euro</option>
                  <option>GBP — British Pound</option>
                </select>
              </div>
              <div>
                <label className="field-label">Timezone</label>
                <select className="field-input" defaultValue="GMT">
                  <option>GMT (London)</option>
                  <option>EST (New York)</option>
                  <option>PST (Los Angeles)</option>
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="Shipping & fulfilment" />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Free shipping threshold (USD)</label>
                <input defaultValue="150" type="number" className="field-input" />
              </div>
              <div>
                <label className="field-label">Express delivery fee (USD)</label>
                <input defaultValue="25" type="number" className="field-input" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Order confirmation email</label>
                <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-[13px]">
                  <Check size={16} className="text-success" />
                  Enabled — customers receive an email when an order is placed.
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="Payment methods" />
            <ul className="divide-y divide-stone-50">
              {["Credit & debit cards", "PayPal", "Apple Pay", "Klarna — pay in 3"].map((m, i) => (
                <li key={m} className="flex items-center justify-between px-5 py-4">
                  <span className="text-[14px]">{m}</span>
                  <span
                    className={`flex h-6 w-11 items-center rounded-full p-0.5 ${
                      i < 3 ? "justify-end bg-ink" : "justify-start bg-stone-300"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow" />
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
