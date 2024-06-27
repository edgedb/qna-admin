export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-10 px-4 flex gap-6 max-w-[1666px] m-auto">
      {children}
    </div>
  );
}
