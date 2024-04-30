import AccountLayout from "@/components/account/templates/account-layout"

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountLayout>{children}</AccountLayout>
}
